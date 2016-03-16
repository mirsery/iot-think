/**
 *地图图标切割
 *x：0-i*24，y：0.其中i可取0,1,2,3,4，依次对应绿灯，红灯，灰灯，蓝小点，红小点。
 *x: 1 - i * 24 y:0 - 40 - 30 *j x中的i可取0-9，分别对应A-J，y中的j可取0,1,2，分别对应颜色红，蓝，橙
 *大图标的BMap.Size（22,30）
 *小图标的BMap.Size(22,22)
 *@author Green 150731
 *@email green.coder@hotmail.com
 */

var BDMap = {

    /*初始化和重载*/
    centerLongitude : null,
    centerLatitude : null,
    centerZoom : null,
    num_per_page : 5,
    total_page : 0,
    page_num: 0,
    searchBy : 'cell',
    all_data : [],
    all_cells : [],
    all_markers : [],
    all_info_windows : [],
    all_points: [],
    map : null,
    is_route_search_show : false,

    /**
     * init the map
     * @param  {[DOM]} mapDiv    the element to put the map
     * @param  {[float]} longitude [经度]
     * @param  {[float]} latitude  [纬度]
     * @param  {[type]} zoom      [放大级别]
     */
    init : function(mapDiv,longitude,latitude,zoom) {

        this.centerLongitude = longitude;
        this.centerLatitude = latitude;
        this.centerZoom = zoom;

        this.map = new BMap.Map(mapDiv,{minZoom:11,maxZoom:19});

        this.map.centerAndZoom(new BMap.Point(this.centerLongitude,this.centerLatitude), this.centerZoom);//中心点及缩放级别


        this.map.addControl(new BMap.NavigationControl());// 添加平移缩放控件
        this.map.addControl(new BMap.ScaleControl({anchor: BMAP_ANCHOR_TOP_LEFT}));//比例尺
        this.map.addControl(new BMap.MapTypeControl({mapTypes: [BMAP_NORMAL_MAP,BMAP_HYBRID_MAP]}));//2D图，卫星图，不包含3D

        // map.addControl(new BMap.OverviewMapControl());//添加缩略地图控件
        // map.addControl(new BMap.OverviewMapControl({isOpen:true, anchor: BMAP_ANCHOR_TOP_RIGHT}));

        this.map.enableScrollWheelZoom();//启用滚轮放大缩小

        //this.map = initMap(mapDiv,this.centerLongitude,this.centerLatitude,this.centerZoom);
    },
    /**
     * [loadCell load all the cells when open the page with default icon]
     * @param  {[string]} requestUrl [the url to get the cells data]
     */
    loadCell : function(requestUrl) {
        var that = this;
        this.all_cells.length = 0;
        this.all_markers.length = 0;
        this.all_info_windows.length = 0;

        $.ajax({
          url: requestUrl,
          data: {},
          success: function (data) {

            var cellJson = $.parseJSON(data);
            var cellArray = [];
            var cells = [];
            if(cellJson == undefined || cellJson.length == 0){
                alert("当前暂无小区信息！");
                return;
            }
            for (var i = 0; i < cellJson.data.length; i++) {
                cells[i] = cellJson.data[i].id;
                cellArray[cells[i]] = cellJson.data[i];
            };
            for (var i = 0; i < cells.length; i ++) {
                var point = new BMap.Point(cellArray[cells[i]].longitude,cellArray[cells[i]].latitude);
                // console.log(cellArray[cells[i]].longitude+"---"+cellArray[cells[i]].latitude);
                var marker = new BMap.Marker(point);
                that.map.addOverlay(marker);
            }            

          },
          error: function(data) {
              alert("{$Think.Config.WARNING_MSG}");
          }
        });
    },

    loadHeatCell: function(requestUrl){
        var that = this;

        $.ajax({
            url: requestUrl,
            data: {},
            success: function(data){
                var points = new Array();
                var data = $.parseJSON(data);
                $.each(data['list'],function(index,val) {
                     var point = {
                        "lng":val['longitude'],
                        "lat":val['latitude'],
                        "count":val['count']
                        };
                     points.push(point);
                });
                //console.log(points);
               that.addHeatPoints(points);
            },
        });
    },

    addVisitor: function(points){
        for(var i=0;i<points.length;i++){
            var longitude = points[i][0];
            var latitude = points[i][1];
            var cell_name = points[i][2];
            var id_card = points[i][3];
            var image = points[i][4];
            var name = points[i][5];
            var intime = points[i][6];
            var point = new BMap.Point(longitude+i,latitude+i);
            var myIcon = new BMap.Icon("http://webmap1.map.bdstatic.com/wolfman/static/common/images/markers_new2x_fbb9e99.png",
                                    new BMap.Size(21, 33), {
                                       anchor: new BMap.Size(10.5,33), // 指定定位位置 
                                       imageSize: new BMap.Size(300,300),
                                       imageOffset: new BMap.Size(-21*i,0), 
                                    });

            var content = '<hr/><div style="margin:0;line-height:20px;padding:2px;">' +
                            '<img id="imgDemo" src="'+image+'" alt="" style="float:right;zoom:1;overflow:hidden;width:100px;height:100px;margin-left:3px;"/>'
                            +name+'<br/>'+id_card+'<br/>'+intime+'<br/>'+cell_name+'<br/>'+
                          '</div>';

            var marker = new BMap.Marker(point,{icon:myIcon});
            this.map.addOverlay(marker);
            this.addClickHandler(content,marker,i+1);
        }
    },
    /**
    *[add the Heatmap points]
    **/
    addHeatPoints: function(points){
       // console.log(points);
        var that = this;
        if(!isSupportCanvas()){
            alert('热力图目前只支持有canvas支持的浏览器,您所使用的浏览器不能使用热力图功能~')
        }
        //详细的参数,可以查看heatmap.js的文档 https://github.com/pa7/heatmap.js/blob/master/README.md
        //参数说明如下:
        /* visible 热力图是否显示,默认为true
         * opacity 热力的透明度,1-100
         * radius 势力图的每个点的半径大小   
         * gradient  {JSON} 热力图的渐变区间 . gradient如下所示
         *  {
                .2:'rgb(0, 255, 255)',
                .5:'rgb(0, 110, 255)',
                .8:'rgb(100, 0, 255)'
            }
            其中 key 表示插值的位置, 0~1. 
                value 为颜色值. 
         */
         this.map.clearOverlays();
        var heatmapOverlay = new BMapLib.HeatmapOverlay({"radius":40});
        this.map.addOverlay(heatmapOverlay);
        heatmapOverlay.setDataSet({data:points,max:100});
        heatmapOverlay.show();
        //是否显示热力图
        //closeHeatmap();
        function setGradient(){
            /*格式如下所示:
            {
                0:'rgb(102, 255, 0)',
                .5:'rgb(255, 170, 0)',
                1:'rgb(255, 0, 0)'
            }*/
            var gradient = {};
            var colors = document.querySelectorAll("input[type='color']");
            colors = [].slice.call(colors,0);
            colors.forEach(function(ele){
                gradient[ele.getAttribute("data-key")] = ele.value; 
            });
            heatmapOverlay.setOptions({"gradient":gradient});
        }
        //判断浏览区是否支持canvas
        function isSupportCanvas(){
            var elem = document.createElement('canvas');
            return !!(elem.getContext && elem.getContext('2d'));
        }
    },
    removeAllMarkers: function()
    {
        for(var i=0;i<this.all_markers.length;i++)
         {
            // console.log(this.all_markers[i]);
            this.map.removeOverlay(this.all_markers[i]);
         } 
    },
    setPointJump: function(index){
         this.removeAllMarkers();
         var centerLongitude = this.all_points[index].lng;
         var centerLatitude = this.all_points[index].lat;
         var point = new BMap.Point(centerLongitude,centerLatitude);
         //重新设置地图中心
         this.map.panTo(point);
         var marker = this.all_markers[index];
         this.map.addOverlay(marker);               // 将标注添加到地图中
         marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画  
    },
    /**
    *  [add the plate in the map]
    */
    addPlate: function(points){
        for(var i=0;i<points.length;i++){
            var longitude = points[i][0];
            var latitude = points[i][1];
            var cell_name = points[i][2];
            var license = points[i][3];
            var image = points[i][4];
            var phone = points[i][5];
            var point = new BMap.Point(longitude+i,latitude+i);
            var myIcon = new BMap.Icon("http://webmap1.map.bdstatic.com/wolfman/static/common/images/markers_new2x_fbb9e99.png",
                                    new BMap.Size(21, 33), {
                                       anchor: new BMap.Size(10.5,33), // 指定定位位置 
                                       imageSize: new BMap.Size(300,300),
                                       imageOffset: new BMap.Size(-21*i,0), 
                                    });

            var content = '<hr/><div style="margin:0;line-height:20px;padding:2px;">' +
                            '<img id="imgDemo" src="'+image+'" alt="" style="float:right;zoom:1;overflow:hidden;width:100px;height:100px;margin-left:3px;"/>'
                            +license+'<br/>'+cell_name+'<br/>'+phone+'<br/>' +
                          '</div>';

            var marker = new BMap.Marker(point,{icon:myIcon});
            this.map.addOverlay(marker);
            this.addClickHandler(content,marker,i+1);
        }
    },
    /**
    *[触发marker的单击事件]
    */
    markerClick : function(index){
        this.openInfo(index,this.all_markers[index]);
    },

    addClickHandler : function(content,marker,index){
        var that = this;
        this.loadInfo(content,marker,index);
        marker.addEventListener("click",function(){
            that.openInfo(index,this);
        });
    },
    loadPoint: function(index,point){
        var myIcon = new BMap.Icon("http://webmap1.map.bdstatic.com/wolfman/static/common/images/markers_new2x_fbb9e99.png",
                                    new BMap.Size(21, 33), {
                                       anchor: new BMap.Size(10.5,33), // 指定定位位置 
                                       imageSize: new BMap.Size(300,300),
                                       imageOffset: new BMap.Size(-21*(index),0), 
                                    });
        var marker = new BMap.Marker(point,{icon:myIcon});
        this.all_markers[index] = marker;
        this.all_points[index] = point;
    },
    loadInfo : function(content,marker,index){
        this.all_markers[index] = marker;
        var opts = {
            width : 300,     // 信息窗口宽度
            height: 150,     // 信息窗口高度
            title : "信息窗口" , // 信息窗口标题
        };
        var infoWindow = new BMap.InfoWindow(content,opts);
        infoWindow.enableCloseOnClick();
        this.all_info_windows[index] = infoWindow;
    },
    openInfo : function(index,marker){
        marker.openInfoWindow(this.all_info_windows[index]);
    },
    /**
     * [reset reset the GIS page]
     */
    reset : function() {
        this.clear_sidebar();
        //this.clear_searchbar();
        this.all_data = null;
        this.searchBy = 'cell';
        this.total_page = 1;
        this.page_num = 1;
        $("#clickSearchButton").show();

        this.map.clearOverlays();
        this.map.centerAndZoom(new BMap.Point(this.centerLongitude,this.centerLatitude), this.centerZoom);//中心点及缩放级别

        this.reset_cells();
    },

    /**
     * [reset_cells reset the cells on the map to original status]
     */
    reset_cells : function(){
        for(var marker_id in this.all_markers){
            myIcon = new BMap.Icon( this.cell_image + "new_marker.png",
                                        new BMap.Size(22, 22), {
                                            offset: new BMap.Size(10, 25), // 指定定位位置
                                            //(x, y)
                                            imageOffset: new BMap.Size(0 - 4 * 24 , 0) // 设置图片偏移
                                        });
            this.all_markers[marker_id].setIcon(myIcon);
        }
        if(this.all_markers.length != 0 ){
            marker = this.all_markers.pop();
            this.map.panTo(marker.getPosition());
            this.all_markers.push(marker);
        }

        this.renderData(this.all_cells);
    },


    /*功能函数区*/
    clear_sidebar : function() {

        $("#sidebarList").empty();
        $("#pageNum").hide();
    },

    clear_searchbar : function() {
        this.is_route_search_show = false;
        $("#search_by").get(0).selectedIndex=0;
        $("#search_text").val("");
        $('#start_time').val("");
        $('#end_time').val("");
        $('#start_time_td').hide();
        $('#end_time_td').hide();
        $('#search_text_td').hide();
    },

    show_searchbar : function(){
        this.is_route_search_show = true;
        $('#start_time_td').show();
        $('#end_time_td').show();
        $("#search_text_td").show();
    },

    date_compare : function(strDate1, strDate2) {
        var date1 = new Date(strDate1.replace(/\-+/g, "\/"));
        var date2 = new Date(strDate2.replace(/\-+/g, "\/"));
        return date1-date2;
    },

    change_color_back : function(){
        var current_cell = this.get_current_cells();

        if(current_cell == undefined)
            return;
        for (var i = 0; i < current_cell.length; i++) {
            myIcon = new BMap.Icon(this.cell_image + "new_marker.png",
                                    new BMap.Size(22, 30), {
                                        offset: new BMap.Size(10, 25),
                                        //red is first row, blue is second row
                                        imageOffset: new BMap.Size(1 - i * 24, - 40 - 30 *0) // 设置图片偏移
                                    });
            this.all_markers[current_cell[i]].setIcon(myIcon);
        };
    },

    check_search_condition : function(search_text, search_by, start_time, end_time){
        if($.trim(search_text) == ''){
            if(search_by == ''){
                alert("请选择查询方式！");
                return false;
            }
            else if(search_by == 'license'){
                alert("请输入车牌号！");
                return false;
            }
            else if(search_by == 'id_card'){
                alert("请输入身份证号！");
                return false;
            }
        }

        if( start_time == '' && this.is_route_search_show){
            alert("请输入开始时间！");
            return false;
        }

        if( end_time == '' && this.is_route_search_show){
            alert("请输入截止时间！");
            return false;
        }


        if( BDMap.date_compare(start_time, end_time) > 0 && this.is_route_search_show ){
            alert("截止时间不能小于开始时间！");
            return false;
        }
        $("#search_text").val("");
        $('#start_time').val("");
        $('#end_time').val("");

        return true;
    },

    spilit_data : function(data, total_page){
        var result = [];
        for (var i = 0; i < total_page; i++) {
            var start_index = this.num_per_page * i;
            var end_index = start_index + this.num_per_page;

            result.push(data.slice(start_index,end_index));
        };

        return result;
    },

    get_current_cells : function(){
        if(this.all_data == undefined || this.all_data.length == 0)
            return;
        var current_page = this.all_data[this.page_num - 1],
            ids = [],
            result = [];

        for (var i = 0; i < current_page.length; i++) {
            if($.inArray(current_page[i].cell_id, result) == -1)
                result.push(current_page[i].cell_id);
        };

        return result;
    },

    get_other_cells : function(current_cell){
        var cells = this.all_cells,
            result = [];

        if(current_cell == undefined)
            return result;
        for(var cell_id in cells) {
            if( $.inArray(cell_id, current_cell) == -1){
                result.push(cell_id);
            }
        };

        return result;
    },

    addArrow : function (polyline, length, angleValue){ //绘制箭头的函数
        var linePoint = polyline.getPath();//线的坐标串
        var arrowCount = linePoint.length;
        for(var i = 1; i < arrowCount; i++){ //在拐点处绘制箭头
            var pixelStart = this.map.pointToPixel(linePoint[i-1]);
            var pixelEnd = this.map.pointToPixel(linePoint[i]);
            var angle = angleValue;//箭头和主线的夹角
            var r = length; // r/Math.sin(angle)代表箭头长度
            var delta = 0; //主线斜率，垂直时无斜率
            var param = 0; //代码简洁考虑
            var pixelTemX,pixelTemY;//临时点坐标
            var pixelX,pixelY,pixelX1,pixelY1;//箭头两个点
            if(pixelEnd.x - pixelStart.x == 0){ //斜率不存在是时
                pixelTemX = pixelEnd.x;
                if(pixelEnd.y > pixelStart.y){
                    pixelTemY = pixelEnd.y - r;
                }
                else{
                    pixelTemY = pixelEnd.y + r;
                }
                //已知直角三角形两个点坐标及其中一个角，求另外一个点坐标算法
                pixelX = pixelTemX - r * Math.tan(angle);
                pixelX1 = pixelTemX + r * Math.tan(angle);
                pixelY = pixelY1 = pixelTemY;
            }
            else {  //斜率存在时
                delta = (pixelEnd.y-pixelStart.y)/(pixelEnd.x-pixelStart.x);
                param = Math.sqrt(delta*delta+1);

                if((pixelEnd.x - pixelStart.x) < 0){//第二、三象限
                    pixelTemX = pixelEnd.x + r/param;
                    pixelTemY = pixelEnd.y + delta * r/param;
                }  else{//第一、四象限
                    pixelTemX = pixelEnd.x - r/param;
                    pixelTemY = pixelEnd.y -delta * r/param;
                }
                //已知直角三角形两个点坐标及其中一个角，求另外一个点坐标算法
                pixelX = pixelTemX + Math.tan(angle) * r* delta/param;
                pixelY = pixelTemY - Math.tan(angle) * r/param;

                pixelX1 = pixelTemX - Math.tan(angle) * r * delta/param;
                pixelY1 = pixelTemY + Math.tan(angle) * r/param;
            }

            var pointArrow = this.map.pixelToPoint(new BMap.Pixel(pixelX,pixelY));
            var pointArrow1 =this.map.pixelToPoint(new BMap.Pixel(pixelX1,pixelY1));
            var Arrow = new BMap.Polyline([
                pointArrow,
             linePoint[i],
                pointArrow1
            ], {strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5});
            this.map.addOverlay(Arrow);
        }
    },

    addClickHandlerToTrack : function (track) {
        var that = this;
        var current_cell = this.get_current_cells();
        var marker,index,pre_marker,next_marker,points;


        if(track != null){
            $('#sidebar_name_' + track.id).click(function(event){
                that.change_color_back();
                that.map.clearOverlays();
                marker = that.all_markers[track.cell_id];
                $(".selected_two").removeClass("selected_two");
                $("#sidebar_name_" + track.id).addClass("selected_two");
                i = $.inArray(track.cell_id,current_cell)
                myIcon = new BMap.Icon(that.cell_image + "new_marker.png",
                                            new BMap.Size(22, 30), {
                                                offset: new BMap.Size(10, 25),
                                                //red is first row, blue is second row
                                                imageOffset: new BMap.Size(1 - i * 24, - 40 - 30 *1) // 设置图片偏移
                                            });
                marker.setIcon(myIcon);
                that.map.panTo(marker.getPosition());

                that.draw_the_line(track,marker);
            });
        }

    },

    draw_the_line : function(track,marker){
        var current_page = this.all_data[this.page_num - 1];

        if(current_page == undefined || current_page.length == 1)
            return;
        index = $.inArray(track,current_page);
        if(index == 0){
            pre_marker = null;
            next_marker = this.all_markers[current_page[index + 1].cell_id];
            points = [marker.getPosition(),next_marker.getPosition(),];
        }else if(index == current_page.length - 1){
            pre_marker = this.all_markers[current_page[index - 1].cell_id];
            next_marker = null;
            points = [pre_marker.getPosition(),marker.getPosition(),];
        }else{
            pre_marker = this.all_markers[current_page[index - 1].cell_id];
            next_marker = this.all_markers[current_page[index + 1].cell_id];
            points = [pre_marker.getPosition(),marker.getPosition(),next_marker.getPosition(),];
        }
        var polyline = new BMap.Polyline(points, {strokeColor:"blue", strokeWeight:3, strokeOpacity:0.5});
        this.map.addOverlay(polyline);
        this.addArrow(polyline,15,Math.PI/7);
    },

    search : function(request_url) {
        var searchBy = $("#search_by").val();
        var searchText = $("#search_text").val();
        var startTime = $("#start_time").val();
        var endTime = $("#end_time").val();
        var that = this;

        if(this.check_search_condition(searchText, searchBy, startTime, endTime) == false)
            return;
        this.searchBy = searchBy;


        var jqxhr = $.post( request_url,{search_text : searchText, start_time : startTime, end_time : endTime, search_by : searchBy});

        jqxhr.done(function(data){
            var tracks = $.parseJSON(data);
            if( tracks == undefined || tracks.length == 0){
                alert("找不到相关数据！");
                return;
            }
            that.init_the_tracks(tracks);
        }).fail(function() {
                alert("请求失败！稍后请重试！");
        });

    },

    init_the_tracks : function(tracks){
        this.total_page = Math.ceil(tracks.length/this.num_per_page);
        this.page_num = 1;
        this.all_data = this.spilit_data(tracks, this.total_page);
        this.clear_sidebar();
        $("#clickSearchButton").hide();
        $("#pageNum").show();
        this.renderTableandMap();
    },

    renderTableandMap : function() {
        this.renderTable(this.searchBy);

        //add the click event to the track
        var current_page = this.all_data[this.page_num-1];

        for (var i = 0; i < current_page.length; i++) {
            this.addClickHandlerToTrack(current_page[i]);
        };

        this.renderMap();
    },

    renderTable : function () {

        //ipp = this.ITEMS_PER_PAGE,
        //grp = this.spilitLarge(jsonData, ipp),
        //cnt = jsonData.length,

        this.renderData(this.all_data[this.page_num - 1], this.searchBy);
        this.renderPagination();
    },

    renderData : function (one_page) {
        var data = '';
        data += '<div class="record_content">';
        switch(this.searchBy){
            case 'license' :
                for (var i = 0; i < one_page.length; i++) {
                    data = this.generate_plate_track_data(one_page[i], data);
                };
                break;

            case 'id_card' :
                for (var i = 0; i < one_page.length; i++) {
                    data = this.generate_visitor_track_data(one_page[i], data);
                };
                break;

            case 'cell' :
                var i = 0;
                for (var key in one_page) {
                    data = this.generate_cell_data(one_page[key], i++, data);
                };
                break;
        };
        data += '</div>';

        $("#sidebarList").html(data);
    },

    generate_plate_track_data : function(track, data){
        var current_cell = this.get_current_cells();

        if(track.start_time == track.end_time){
        data += [
                '<div class="' + 'itempic_' + $.inArray(track.cell_id, current_cell) +' itempic' + '" >' + '</div>',
                '<div class="itemBlock" id=sidebar_name_' + track.id + '>',
                    '<div class="itemLicense"><b>车牌号:</b>' + track.license + '</div>',
                    '<div class="itemTime"><b>出入时间:</b>' + track.start_time + '</div>',
                    '<div class="itemCount"><b>出入次数:</b>' + track.count + '</div>',
                    '<div class="itemLocation"><b>出入地点:</b>' + track.cell + '-' + track.location + '</div>',
                '</div>'
                ].join("");
        }else{
        data += [
                '<div class="' + 'itempic_' + $.inArray(track.cell_id, current_cell) +' itempic' + '" >' + '</div>',
                '<div class="itemBlock" id=sidebar_name_' + track.id + '>',
                    '<div class="itemLicense"><b>车牌号:</b>' + track.license + '</div>',
                    '<div class="itemStartTime"><b>最初出入时间:</b>' + track.start_time + '</div>',
                    '<div class="itemEndTime"><b>最后出入时间:</b>' + track.end_time + '</div>',
                    '<div class="itemCount"><b>出入次数:</b>' + track.count + '</div>',
                    '<div class="itemLocation"><b>出入地点:</b>' + track.cell +  '-' + track.location + '</div>',
                '</div>'
                ].join("");
        }

        return data;
    },

    generate_cell_data : function(cell, i, data){
        data += [
                '<div class="disabled_side itemBlock" id=sidebar_name_' + cell.id + '>',
                    '<div class="itemLicense"><b>小区名称:</b>' + cell.name + '</div>',
                    '<div class="itemTime"><b>小区简称:</b>' + cell.short_name + '</div>',
                    '<div class="itemCount"><b>小区经度:</b>' + cell.longitude + '</div>',
                    '<div class="itemLocation"><b>小区纬度:</b>' + cell.latitude + '</div>',
                    '<div class="itemLocation"><b>地址:</b>' + cell.address + '</div>',
                '</div>'
                ].join("");

        return data;
    },

    generate_visitor_track_data : function(track, data){
        var current_cell = this.get_current_cells();

        if(track.start_time == track.end_time){
        data += [
                '<div class="' + 'itempic_' + $.inArray(track.cell_id, current_cell) +' itempic' + '" >' + '</div>',
                '<div class="itemBlock" id=sidebar_name_' + track.id + '>' +
                    '<div class="itemLicense"><b>访客姓名:</b>' + track.name + '</div>' +
                    '<div class="itemLicense"><b>访客身份证:</b>' + track.id_card + '</div>' +
                    '<div class="itemTime"><b>出入时间:</b>' + track.start_time + '</div>' +
                    '<div class="itemCount"><b>出入次数:</b>' + track.count + '</div>' +
                    '<div class="itemLocation"><b>出入地点:</b>' + track.cell + '-' + track.location + '</div>' +
                '</div>'
                ].join("");
        }else{
        data += [
                '<div class="' + 'itempic_' + $.inArray(track.cell_id, current_cell) +' itempic' + '" >' + '</div>',
                '<div class="itemBlock" id=sidebar_name_' + track.id + '>',
                '<div class="itemName"><b>访客姓名:</b>' + track.name + '</div>',
                '<div class="itemIDCard"><b>访客身份证:</b>' + track.id_card + '</div>',
                '<div class="itemStartTime"><b>最初出入时间:</b>' + track.start_time + '</div>',
                '<div class="itemEndTime"><b>最后出入时间:</b>' + track.end_time + '</div>',
                '<div class="itemCount"><b>出入次数:</b>' + track.count + '</div>',
                '<div class="itemLocation"><b>出入地点:</b>' + track.cell +  '-' + track.location + '</div>',
                '</div>'
                ].join("");
        }

        return data;
    },

    renderPagination : function () {
        var that = this;
        this.init_page();

        if(this.total_page == this.page_num){
            $("#previous").click(function(){
            that.previous_page();
            that.renderTableandMap();
            });
            $("#first").click(function(){
                that.first_page();
                that.renderTableandMap();
            });
        }
        if(this.page_num == 1 && this.total_page > 1){
            $("#next").click(function(){
            that.next_page();
            that.renderTableandMap();
            });
            $("#last").click(function(){
            that.last_page();
            that.renderTableandMap();
            });
        }
        if(this.total_page > this.page_num && this.page_num != 1){
            $("#next").click(function(){
            that.next_page();
            that.renderTableandMap();
            });
            $("#previous").click(function(){
                that.previous_page();
                that.renderTableandMap();
            });
            $("#first").click(function(){
                that.first_page();
                that.renderTableandMap();
            });
            $("#last").click(function(){
                that.last_page();
                that.renderTableandMap();
            });
        }
    },

    init_page : function(){
        var pagination = [
                        '<li class="disabled">',
                            '<span><span>当前页:</span><span id="current_page"> ' + this.page_num + '</span></span>',
                        '</li>',
                        '<li class="disabled">',
                            '<span><span>共</span><span id="total_page">' + this.total_page + '</span><span>页</span></span>',
                        '</li>',
                            '<li id="first" class="j-first disabled">',
                            '<span class="first"><span>首页</span></span>',
                        '</li>',
                        '<li id="previous" class="j-prev disabled">',
                            '<a class="previous" href="javascript:;" style="display: none;"><span>上一页</span></a>',
                            '<span class="previous"><span>上一页</span></span>',
                        '</li>',
                        '<li id="next" class="j-next disabled">',
                            '<a class="next" href="javascript:;" style="display: none;"><span>首页</span></a>',
                            '<span class="next"><span>下一页</span></span></li>',
                        '<li id="last" class="j-last disabled"><a class="last" href="javascript:;" style="display: none;"><span>末页</span></a><span class="last"><span>末页</span></span></li>'

            ].join("");
        $("#page_content").html(pagination);

        this.disable_page();
    },

    disable_page : function(){
        if(this.total_page == 1){
            $("#next").attr("class","j-next disabled");
            $("#previous").attr("class","j-prev disabled");
            $("#first").attr("class","j-first disabled");
            $("#last").attr("class","j-last disabled");
        }else if(this.total_page == this.page_num){
            $("#next").attr("class","j-next disabled");
            $("#previous").attr("class","j-prev");
            $("#first").attr("class","j-first");
            $("#last").attr("class","j-last disabled");
        }else if(this.page_num == 1 && this.total_page > 1){
            $("#next").attr("class","j-next");
            $("#previous").attr("class","j-prev disabled");
            $("#first").attr("class","j-first disabled");
            $("#last").attr("class","j-last");
        }else if(this.total_page > this.page_num && this.page_num != 1){
            $("#next").attr("class","j-next");
            $("#previous").attr("class","j-prev");
            $("#first").attr("class","j-first");
            $("#last").attr("class","j-last");
        }
    },

    next_page : function(){
        if(this.page_num < this.total_page)
            this.page_num += 1;
        this.disable_page();
    },

    previous_page : function(){
        if(this.page_num > 1)
            this.page_num -= 1;
        this.disable_page();
    },

    first_page : function(){
        this.page_num = 1;
        this.disable_page();
    },

    last_page : function(){
        this.page_num = this.total_page;
        this.disable_page();
    },

    renderMap : function () {
        var current_cell = this.get_current_cells();
        var other_cell = this.get_other_cells(current_cell);

        this.map.clearOverlays();
        if(this.all_data.length > 0) {

            if(current_cell.length > 0){
                this.renderMapFocus(current_cell);
            }

            if (other_cell.length > 0) {
                this.renderMapOther(other_cell);
            }
        }
    },

    renderMapFocus : function(current_cell) {

        var count  = current_cell.length,
            markers = this.all_markers,
            myIcon;

        for (var i = 0; i < count; i++) {
            myIcon = new BMap.Icon(this.cell_image + "new_marker.png",
                                        new BMap.Size(22, 30), {
                                            offset: new BMap.Size(10, 25),
                                            //red is first row, blue is second row
                                            imageOffset: new BMap.Size(1 - i * 24, - 40 - 30 *0) // 设置图片偏移
                                        });
            markers[current_cell[i]].setIcon(myIcon);
        }

        //panto the first of recent page 10 object
        this.map.panTo(markers[current_cell[0]].getPosition());
    },

    renderMapOther : function(other_cell) {

        var count = other_cell.length,
            markers = this.all_markers,
            myIcon;

        for (var i = 0; i < count; i++) {
            myIcon = new BMap.Icon( this.cell_image + "new_marker.png",
                                        new BMap.Size(22, 22), {
                                            offset: new BMap.Size(10, 25), // 指定定位位置
                                            //(x, y)
                                            imageOffset: new BMap.Size(0 - 4 * 24 , 0) // 设置图片偏移
                                        });
            markers[other_cell[i]].setIcon(myIcon);
        }

    },

};