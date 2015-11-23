$(document).ready(function () {
    /*hide variable input boxes*/
    $("#var1").hide();
    /*enables the tooltip feature*/
    $('[data-toggle="tooltip"]').tooltip();
    /*initializes the google map*/
    initMap();
    /*checks to see if the cookies exist for the custom variables*/
    checkCookie();
    /*hides the tabs until we are done processing the transcript*/
    $('#t1').hide();
    $('#too2').hide();
    $('#too').hide();
    $('#t2').hide();
    $('#t3').hide();
    $('#t4').hide();
    $('#t5').hide();
    $('#t6').hide();
    $('#t7').hide();
    /*checks if a new file was loaded*/
    $("#xmlFileinput").change(function () {
        handleFiles(this.files);
    });
    /*listens for a click on the print button*/
    $("#pntbtn").click(function () {
        printME();
    });
    /*initializes the data table*/
    var table = $('#example').DataTable({
        dom: 'lBfrtip',
        buttons: [
            'copyHtml5',
            {
                extend: 'excelHtml5',
                title: todayDate
        }, {
                extend: 'colvis',
                columns: [2, 3, 4, 5, 6, 9, 10, 11, 12, 13, 21, 22, 23, 25, 26, 27]
            }
            /*,
                            'csvHtml5'
                        ,
                                    {
                                        extend: 'pdfHtml5',
                                        orientation: 'landscape',
                                        pageSize: 'A2'
                                    }
            {
                extend: 'print',
                exportOptions: {
                    columns: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
                },
                customize: function (win) {
                    $(win.document.body)
                        .css('font-size', '6pt');

                    $(win.document.body).find('table')
                        .addClass('compact')
                        .css('font-size', 'inherit');
                }
                }*/
            ],
        "deferRender": true,
        "lengthMenu": [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]],
        "columnDefs": [{
                "targets": 0,
                "data": null,
                "orderable": false,
                "className": 'details-control',
                "defaultContent": ''
        }, {
                "targets": 1,
                "data": null,
                "orderable": false,
                "defaultContent": '<button type="button" id="pntbtn1" class="btn btn-info btn-sm" data-toggle="modal" data-target="#myModal">Print</button>'
        }
                       ,
            {
                "targets": [7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 24, 26],
                "visible": false
        }
            ]
    });
    /* Setup - add a text input to each footer cell*/
    $('.srcT').each(function () {
        $(this).html('<input type="text" placeholder="Search" size="4"/>');
    });
    /*filters the columns based on the input*/
    $('input.column_filter').on('keyup click', function () {
        filterColumn($(this).attr('data-column'));
    });
    /* Apply the search*/
    table.columns().every(function () {
        var that = this;

        $('input', this.footer()).on('keyup change', function () {
            that
                .search(this.value)
                .draw();
        });
    });

    /* Add event listener for opening and closing details - whole row*/
    $('#example tbody').on('click', 'tr', function () {
        var tr = $(this);
        var row = table.row(tr);
        if (row.child.isShown()) {
            /* This row is already open - close it*/
            row.child.hide();
            tr.removeClass('shown');
        } else {
            /* Open this row*/
            row.child(format(row.data())).show();
            tr.addClass('shown');
        }
    });
    /*checks to see what print button was click on the table and then shows the print modal for that button*/
    $('#example tbody').on('click', 'td', function () {
        var td = table.cell(this).data();
        if (td === '<button type="button" id="pntbtn1" class="btn btn-info btn-sm" data-toggle="modal" data-target="#myModal">Print</button>') {
            var myData = "";
            myData = table.cell(this).index();
            myData = table.row(myData.row).data();
            changeModal(myData);
        }
    });
    /*visibility buttons*/
    $('a.toggle-vis').on('click', function (e) {
        e.preventDefault();
        /*Get the column API object*/
        var column = table.column($(this).attr('data-column'));
        /* Toggle the visibility*/
        column.visible(!column.visible());
    });
    /*code for the charts on CSAT tab*/
    $('a[href=#chart2]').on('shown.bs.tab', function () {
        /*chart for pie chart*/
        var pieData = [{}];
        var ctx4 = document.getElementById("invest-chart4").getContext("2d");
        var csatPie = new Chart(ctx4).Pie(pieData, {
            responsive: true,
            animation: false
        });
        /*chart data for CSAT*/
        var data = {
            labels: [],
            datasets: [{
                label: "My First dataset",
                fillColor: "rgba(151,187,205,0.5)",
                strokeColor: "rgba(151,187,205,0.8)",
                highlightFill: "rgba(151,187,205,0.75)",
                highlightStroke: "rgba(151,187,205,1)",
                data: []
                    }]
        };
        var ctx3 = $("#invest-chart3").get(0).getContext("2d");
        var invest_chart3 = new Chart(ctx3).Bar(data, {
            responsive: true,
            animation: false
        });
        csat.sort();
        csatPie.removeData(0);
        for (k = 0; k < csat.length; k++) {
            invest_chart3.addData([csat[k].total], csat[k].name);
            var myTotal = parseInt(csat[k].total);
            switch (k) {
                case 0:
                    csatPie.addData({
                        value: csat[k].total,
                        color: "#B48EAD",
                        highlight: "#C69CBE",
                        label: csat[k].name
                    });
                    break;
                case 1:
                    csatPie.addData({
                        value: csat[k].total,
                        color: "#F7464A",
                        highlight: "#FF5A5E",
                        label: csat[k].name
                    });
                    break;
                case 2:
                    csatPie.addData({
                        value: csat[k].total,
                        color: "#46BFBD",
                        highlight: "#5AD3D1",
                        label: csat[k].name
                    });
                    break;
                case 3:
                    csatPie.addData({
                        value: csat[k].total,
                        color: "#FDB45C",
                        highlight: "#FFC870",
                        label: csat[k].name
                    });
                    break;
                case 4:
                    csatPie.addData({
                        value: csat[k].total,
                        color: "#949FB1",
                        highlight: "#A8B3C5",
                        label: csat[k].name
                    });
                    break;
            }
        }
    });
    /*updates the charts on the response time tab*/
    $('a[href=#chart]').on('shown.bs.tab', function () {
        /*chart data for visitor*/
        var minResp = [];
        var data = {
            labels: [],
            datasets: [{
                label: "My First dataset",
                fillColor: "rgba(151,187,205,0.5)",
                strokeColor: "rgba(151,187,205,0.8)",
                highlightFill: "rgba(151,187,205,0.75)",
                highlightStroke: "rgba(151,187,205,1)",
                data: []
                    }]
        };
        var ctx1 = $("#invest-chart").get(0).getContext("2d");
        var invest_chart = new Chart(ctx1).Bar(data, {
            responsive: true,
            animation: false
        });
        /*chart data for agent*/
        var data2 = {
            labels: [],
            datasets: [{
                label: "My First dataset",
                fillColor: "rgba(151,187,205,0.5)",
                strokeColor: "rgba(151,187,205,0.8)",
                highlightFill: "rgba(151,187,205,0.75)",
                highlightStroke: "rgba(151,187,205,1)",
                data: []
                    }]
        };
        var ctx2 = $("#invest-chart2").get(0).getContext("2d");
        var invest_chart2 = new Chart(ctx2).Bar(data2, {
            responsive: true,
            animation: false
        });
        /*chart data for agent avg response time*/
        var data21 = {
            labels: [],
            datasets: [{
                    label: "My Second dataset",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: []
                    }, {
                    label: "My 2nd dataset",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: []
                }
                ]
        };
        var ctx21 = $("#invest-chart5").get(0).getContext("2d");
        var invest_chart21 = new Chart(ctx21).Bar(data21, {
            responsive: true,
            animation: false
        });
        /*visitor response graph*/
        for (k = 0; k < temObjT.length; k++) {
            avgT += temObjT[k].responseTime;
            minResp.push(temObjT[k].responseTime);
        }
        minResp.sort(function (a, b) {
            return a - b
        });
        avgT = avgT / temObjT.length;
        invest_chart.addData([minResp[0]], "Low");
        invest_chart.addData([avgT], "Average");
        invest_chart.addData([minResp[minResp.length - 1]], "High");
        minResp = [];
        /*agent response time graph*/
        for (k = 0; k < temObj3T.length; k++) {
            avgT3 += temObj3T[k].responseTime;
            minResp.push(temObj3T[k].responseTime);
        }
        minResp.sort(function (a, b) {
            return a - b
        });
        avgT3 = avgT3 / temObj3T.length;
        invest_chart2.addData([minResp[0]], "Low");
        invest_chart2.addData([avgT3], "Average");
        invest_chart2.addData([minResp[minResp.length - 1]], "High");
        /*populate agent average response time for each agent*/
        for (var i = 0; i < agentList.length; i++) {
            var tempAgAvg = 0;
            for (var j = 0; j < agentList[i].chats.length; j++) {
                tempAgAvg += agentList[i].chats[j];
            }
            tempAgAvg = tempAgAvg / agentList[i].chats.length;
            invest_chart21.addData([tempAgAvg, avgT3], agentList[i].name);
        }
    });
    /*updates the map on the map tab*/
    $('a[href=#chart4]').on('shown.bs.tab', function () {
        google.maps.event.trigger(map, "resize");
    });
    /*code for checkbox choices*/
    $("#rCheck").change(function () {
        if (this.checked) {
            $("#var1").show();
        } else {
            $("#var1").hide();
        }
    }).change();
    $("#cCheck").change(function () {
        if (this.checked) {
            $("#var2").show();
        } else {
            $("#var2").hide();
        }
    }).change();
    /*code for custom report table*/
    $('#example10 tbody').on('click', 'tr', function () {
        $(this).toggleClass('selected');
    });
    /*Generate the custom reports*/
    $("#ch1").click(function () {
        $("#choice111").hide();
        $("#choiceR1").show();
        var lis = [];
        var lis2 = [];
        $('#example10').DataTable().rows('.selected').every(function (rowIdx, tableLoop, rowLoop) {
            var data = this.data();
            lis.push(data[0]);
            lis2.push(data[1]);
        });
        generateReports(lis, lis2);
    });
});
