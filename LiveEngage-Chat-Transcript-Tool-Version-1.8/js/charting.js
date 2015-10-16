< script >
    //visitor response time
    var myLineChart;
//csat totals
var myLineChart2;
//csat avg
var myLineChart3;
//holder for visitor response
var temObj = [];
//var holder for csat scores
var temObj2 = [];
//var for average response time
var avgT = 0;
//var for average csat score
var avgT2 = 0;
var csat = {
    dd1: 0,
    dd2: 0,
    dd3: 0,
    dd4: 0,
    dd5: 0
};
$(document).ready(function () {
    var ctx = document.getElementById("canvas").getContext("2d");
    myLineChart = new Chart(ctx).Line(lineChartData, {
        responsive: true
    });
    var ctx2 = document.getElementById("canvas2").getContext("2d");
    myLineChart2 = new Chart(ctx2).Bar(lineChartData2, {
        responsive: true
    });
    var ctx3 = document.getElementById("canvas3").getContext("2d");
    myLineChart3 = new Chart(ctx3).Line(lineChartData3, {
        responsive: true
    });
    console.log(data);
    var tbody = document.getElementById('tbody');
    var tr = "";
    for (var i = 0; i < data.interactionHistoryRecords.length; i++) {
        tr += "<tr>";
        tr += "<td>" + data.interactionHistoryRecords[i].info.accountId + "</td>";
        tr += "<td>" + data.interactionHistoryRecords[i].info.agentId + "</td>";
        tr += "<td>" + data.interactionHistoryRecords[i].info.duration + "</td>";
        tr += "<td>" + data.interactionHistoryRecords[i].info.endReason + "</td>";
        tr += "<td>" + data.interactionHistoryRecords[i].info.endTime + "</td>";
        tr += "<td>" + data.interactionHistoryRecords[i].info.startTime + "</td>";
        var temp = getTrans(data.interactionHistoryRecords[i].transcript, i);
        tr += "<td>" + temp + "</td>";
        tr += "</tr>";
        if (data.interactionHistoryRecords[i].surveys != null) {
            if (data.interactionHistoryRecords[i].surveys.postChat != null) {
                for (n = 0; n < data.interactionHistoryRecords[i].surveys.postChat.length; n++) {
                    if (data.interactionHistoryRecords[i].surveys.postChat[n].questionID == 4) {
                        var csatResp = data.interactionHistoryRecords[i].surveys.postChat[n].value;
                        var dd = {
                            dd2: 1,
                            dd3: 2
                        };
                        switch (csatResp) {
                            case "Very Dissatisfied":
                                csat.dd1++;
                                dd.dd2 = 1;
                                dd.dd3 = i;
                                temObj2.push(dd);
                                avgT2 += 1;
                                break;
                            case "Dissatisfied":
                                csat.dd2++;
                                dd.dd2 = 2;
                                dd.dd3 = i;
                                temObj2.push(dd);
                                avgT2 += 2;
                                break;
                            case "Neither Satisfied Nor Dissatisfied":
                                csat.dd3++;
                                dd.dd2 = 3;
                                dd.dd3 = i;
                                temObj2.push(dd);
                                avgT2 += 3;
                                break;
                            case "Satisfied":
                                csat.dd4++;
                                dd.dd2 = 4;
                                dd.dd3 = i;
                                temObj2.push(dd);
                                avgT2 += 4;
                                break;
                            case "Very Satisfied":
                                csat.dd5++;
                                dd.dd2 = 5;
                                dd.dd3 = i;
                                temObj2.push(dd);
                                avgT2 += 5;
                                break;
                        }
                    }
                }
            }
        }
    }
    myLineChart2.addData([csat.dd1], "VD");
    myLineChart2.addData([csat.dd2], "D");
    myLineChart2.addData([csat.dd3], "N");
    myLineChart2.addData([csat.dd4], "S");
    myLineChart2.addData([csat.dd5], "VS");
    for (k = 0; k < temObj.length; k++) {
        avgT += temObj[k].dd1;
    }
    avgT = avgT / temObj.length;
    tbody.innerHTML += tr;
    for (k = 0; k < temObj.length; k++) {
        // The values array passed into addData should be one for each dataset in the chart
        myLineChart.addData([temObj[k].dd1, avgT], temObj[k].dd2 + "." + temObj[k].dd3);
        // This new data will now animate at the end of the chart.
    }
    avgT2 = avgT2 / temObj2.length;
    for (k = 0; k < temObj2.length; k++) {
        // The values array passed into addData should be one for each dataset in the chart
        myLineChart3.addData([temObj2[k].dd2, avgT2], temObj2[k].dd3);
        console.log(avgT2);
        // This new data will now animate at the end of the chart.
    }
    var table = $('#example').DataTable({
        "deferRender": true,
        "columnDefs": [{
            "targets": 6,
            "visible": false
            }]
    });
    // Add event listener for opening and closing details - whole row
    $('#example tbody').on('click', 'tr', function () {
        var tr = $(this);
        var row = table.row(tr);
        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        } else {
            // Open this row
            row.child(format(row.data())).show();
            tr.addClass('shown');
        }
    });
});

function getTrans(d, p) {
    var tdata = '<table class="tableModal" cellpadding="5" cellspacing="0" border="1" style="padding-left:50px;">' +
        '<tr><td colspan="8">Chat Transcript</td></tr><tr>' +
        '<td><b>By:</b></td>' +
        '<td><b>Canned Answer Type:</b></td>' +
        '<td><b>Control Type:</b></td>' +
        '<td><b>Source:</b></td>' +
        '<td><b>SubType:</b></td>' +
        '<td><b>Text:</b></td>' +
        '<td><b>TextType:</b></td>' +
        '<td><b>Time:</b></td>' +
        '</tr>';
    for (var i = 0; i < d.lines.length; i++) {
        tdata += '<tr>' +
            '<td>' + d.lines[i].by + '</td>' +
            '<td>' + d.lines[i].cannedAnswerType + '</td>' +
            '<td>' + d.lines[i].controlType + '</td>' +
            '<td>' + d.lines[i].source + '</td>' +
            '<td>' + d.lines[i].subType + '</td>' +
            '<td>' + d.lines[i].text + '</td>' +
            '<td>' + d.lines[i].textType + '</td>' +
            '<td>' + d.lines[i].time + '</td>' +
            '</tr>';
        if (i != 0) {
            if (d.lines[i].source == "visitor") {
                var vDate = d.lines[i].time;
                vDate = splitDate(vDate);
                var sDate = new Date(vDate.replace(/-/g, "/"));

                var oDate = d.lines[i - 1].time;
                oDate = splitDate(oDate);
                var eDate = new Date(oDate.replace(/-/g, "/"));

                var diffDate = sDate - eDate;
                diffDate = diffDate / 1000;
                var dd = {
                    dd1: diffDate,
                    dd2: p,
                    dd3: i
                };
                temObj.push(dd);
            }
        }
    }
    tdata += '</table>';
    return tdata;
}

function format(d) {
    // `d` is the original data object for the row
    return d[6];
}

function splitDate(date) {
    date = date.split(".");
    return date[0];
}
var randomScalingFactor = function () {
    return Math.round(Math.random() * 100)
};
var lineChartData = {
    labels: [],
    datasets: [{
        label: "My First dataset",
        fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
        data: []
        }, {
        label: "X = Chat/Chat line, Y = Time In Seconds",
        fillColor: "rgba(220,220,220,0.2)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: []
        }]

}
var lineChartData2 = {
    labels: [],
    datasets: [{
        label: "CSAT",
        fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
        data: []
        }]

}
var lineChartData3 = {
    labels: [],
    datasets: [{
        label: "My First dataset",
        fillColor: "rgba(151,187,205,0.2)",
        strokeColor: "rgba(151,187,205,1)",
        pointColor: "rgba(151,187,205,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(151,187,205,1)",
        data: []
        }, {
        label: "X = Chat/Chat line, Y = Time In Seconds",
        fillColor: "rgba(220,220,220,0.2)",
        strokeColor: "rgba(220,220,220,1)",
        pointColor: "rgba(220,220,220,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: []
        }]

}

< /script>
