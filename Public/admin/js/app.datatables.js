

// (function($) {

//   $.fn.checkbox = function(option) {

//   }

// })(jQuery);


var datatableUtil = {

  customFilter : function(filterId) {
      $('#'+filterId).children().remove();
      // $('#'+filterId).append('<button id="create" type="button" class="btn btn-primary btn-sm" data-toggle="modal" data-target="#create_modal">高级搜索</button>');
      


      $('#'+filterId).append('<div class="input-group" style="text-align:left"><select class="select2" id="searchColumn"></select></div>');

      //$('#'+filterId).append('<button class="btn btn-default search-btn" >test</button>');

      $('#'+filterId).append('<div class="input-group"><input type="text" class="form-control" placeholder="搜索..."><span class="input-group-btn"><button class="btn btn-default" id="searchIcon" ><span class="fa fa-search"></span></button></span></div>');
  },


	changeFilterTrigger : function(table) {

		$('.dataTables_filter input')
          .unbind()
          .bind('keypress keyup', function(e){
            if(e.keyCode == 13 && e.type == 'keypress') {
              //Call the API search function
              table.search("");
              for(var i = 0; i< table.ajax.params().columns.length;i++) {
                table.column(i).search("");
              }
              var searchColumn = $("#searchColumn").val();
              if(searchColumn != "undefined" && searchColumn != 0) {
                 table.column(searchColumn).search(this.value).draw();
              } else {
                table.search(this.value).draw();
              }
            }
        });


    $("#searchIcon").click( function(){
        
        var e = $.Event('keypress');
        e.keyCode = 13;
        $('.dataTables_filter input').trigger(e);
    });

	},


};