
var SSHAChart = {


  chartColor : {  yellow: "#f39c12",  blue: "#3c8dbc",  green: "#00a65a", red: "#df4a32",grew: "#d2d6de"},


  initChart : function(chartId) {
    var chartCanvas = $("#"+chartId).get(0).getContext("2d");
    var chart = new Chart(chartCanvas);

    return chart;
  },

  barChart : function(chartId,chartLabels,chartDataset,chartColor) {

    var chart = this.initChart(chartId);

    var chartData = {
        labels: chartLabels,
        datasets: [
          {
            label: "Top Alarm",
            fillColor: chartColor,
            strokeColor: chartColor,
            pointColor: chartColor,
            pointStrokeColor: "rgba(60,141,188,1)",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(60,141,188,1)",
            data: chartDataset
          }
        ]
      };

    var chartOptions = {
      //Boolean - Whether the scale should start at zero, or an order of magnitude down from the lowest value
      scaleBeginAtZero: true,
      //Boolean - Whether grid lines are shown across the chart
      scaleShowGridLines: true,
      //String - Colour of the grid lines
      scaleGridLineColor: "rgba(0,0,0,.05)",
      //Number - Width of the grid lines
      scaleGridLineWidth: 1,
      //Boolean - Whether to show horizontal lines (except X axis)
      scaleShowHorizontalLines: true,
      //Boolean - Whether to show vertical lines (except Y axis)
      scaleShowVerticalLines: true,
      //Boolean - If there is a stroke on each bar
      barShowStroke: true,
      //Number - Pixel width of the bar stroke
      barStrokeWidth: 2,
      //Number - Spacing between each of the X value sets
      barValueSpacing: 5,
      //Number - Spacing between data sets within X values
      barDatasetSpacing: 1,

      datasetFill: false,
      //String - A legend template
      //legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].fillColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
      tooltipTemplate: "<%=value %>",
      //Boolean - whether to make the chart responsive
      responsive: true,
      maintainAspectRatio: true
    };

    chart.Bar(chartData,chartOptions);
  },

  pieChart : function(chartId,chartLabels,chartDataset,chartColors) {

    var chart = this.initChart(chartId);
    var chartData = [];

    for (var i = chartDataset.length - 1; i >= 0; i--) {
      chartData[i] = {
        value: chartDataset[i],
        color: chartColors[i],
        highlight: chartColors[i],
        label: chartLabels[i]
      }
    };

    var chartOptions = {
        //Boolean - Whether we should show a stroke on each segment
        segmentShowStroke: true,
        //String - The colour of each segment stroke
        segmentStrokeColor: "#fff",
        //Number - The width of each segment stroke
        segmentStrokeWidth: 1,
        //Number - The percentage of the chart that we cut out of the middle
        percentageInnerCutout: 0, // This is 0 for Pie charts
        //Number - Amount of animation steps
        animationSteps: 100,
        //String - Animation easing effect
        animationEasing: "easeOutBounce",
        //Boolean - Whether we animate the rotation of the Doughnut
        animateRotate: true,
        //Boolean - Whether we animate scaling the Doughnut from the centre
        animateScale: false,
        //Boolean - whether to make the chart responsive to window resizing
        responsive: true,
        // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
        maintainAspectRatio: false,
        //String - A legend template
        legendTemplate: "<ul class='<%=name.toLowerCase()%>-legend'><% for (var i=0; i<segments.length; i++){%><li><span style='background-color:<%=segments[i].fillColor%>'></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>",
        //String - A tooltip template
        tooltipTemplate: "<%=label%>: <%=value %>"
    }

    chart.Pie(chartData,chartOptions);
  },

  lineChart : function(chartId,chartLabels,chartDataset,chartColor,fillFlag) {
      var chart = this.initChart(chartId);
      var chartData = {
          labels: chartLabels,
          datasets: [
            {
              fillColor: chartColor,
              strokeColor: chartColor,
              pointColor: chartColor,
              pointStrokeColor: chartColor,
              pointHighlightFill: "#fff",
              pointHighlightStroke: chartColor,
              data: chartDataset
            }
          ]
      };

      var chartOptions = {
           //Boolean - If we should show the scale at all
            showScale: true,
            //Boolean - Whether grid lines are shown across the chart
            scaleShowGridLines: false,
            //String - Colour of the grid lines
            scaleGridLineColor: "rgba(0,0,0,.05)",
            //Number - Width of the grid lines
            scaleGridLineWidth: 1,
            //Boolean - Whether to show horizontal lines (except X axis)
            scaleShowHorizontalLines: true,
            //Boolean - Whether to show vertical lines (except Y axis)
            scaleShowVerticalLines: true,
            //Boolean - Whether the line is curved between points
            bezierCurve: true,
            //Number - Tension of the bezier curve between points
            bezierCurveTension: 0.3,
            //Boolean - Whether to show a dot for each point
            pointDot: false,
            //Number - Radius of each point dot in pixels
            pointDotRadius: 4,
            //Number - Pixel width of point dot stroke
            pointDotStrokeWidth: 1,
            //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
            pointHitDetectionRadius: 20,
            //Boolean - Whether to show a stroke for datasets
            datasetStroke: true,
            //Number - Pixel width of dataset stroke
            datasetStrokeWidth: 2,
            //Boolean - Whether to fill the dataset with a color
            datasetFill: fillFlag,
            //String - A legend template
            legendTemplate: "<ul class='<%=name.toLowerCase()%>-legend'><% for (var i=0; i<datasets.length; i++){%><li><span style='background-color:<%=datasets[i].lineColor%>'></span><%=datasets[i].label%></li><%}%></ul>",
            //Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
            maintainAspectRatio: true,
            //Boolean - whether to make the chart responsive to window resizing
            responsive: true
      }

      chart.Line(chartData,chartOptions);
  },

  resetCanvas : function(id,parentId) {
      $('#'+id).remove(); // this is my <canvas> element
      $('#'+parentId).append('<canvas id="'+id+'"><canvas>');
      canvas = document.querySelector('#'+id);
      ctx = canvas.getContext('2d');
      ctx.canvas.width = $('#'+parentId).width(); // resize to parent width
      ctx.canvas.height = $('#'+parentId).height(); // resize to parent height
  }

};
