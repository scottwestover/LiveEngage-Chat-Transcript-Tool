var salesTotal = 0; //added to keep track of order total
var divText = "";
var divText2 = ""; //added to track error in sales totals
var loadingPannel;
var myOrderID = "";
//visitor response time
var myLineChart;
//csat totals
var myLineChart2;
//csat avg
var myLineChart3;
//holder for visitor response
var temObj = [];
var temObjT = [];
//var holder for csat scores
var temObj2 = [];
//var holder for agent response
var temObj3 = [];
var temObj3T = [];
//var for average response time
var avgT = 0;
//var for average csat score
var avgT2 = 0;
//var for average visitor response time
var avgT3 = 0;
var csat = [];

//revenue by agent code
var agents = [];
//list of agents used for average response time
var agentList = [];

loadingPannel = loadingPannel || (function () {
    var lpDialog = $("" +
        "<div class='modal' id='lpDialog' data-backdrop='static' data-keyboard='false'>" +
        "<div class='modal-dialog' >" +
        "<div class='modal-content'>" +
        "<div class='modal-header'><b>Processing...</b></div>" +
        "<div class='modal-body'>" +
        "<div class='progress'>" +
        "<div class='progress-bar progress-bar-striped active' role='progressbar' aria-valuenow='100' aria-valuemin='100' aria-valuemax='100' style='width:100%'> " +
        "Please Wait..." +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>");
    return {
        show: function () {
            lpDialog.modal('show');
        },
        hide: function () {
            lpDialog.modal('hide');
        },

    };
})();

function handleFiles(files) {
    // Check for the various File API support.
    if (window.FileReader) {
        // FileReader are supported.
        getOrderID();
        loadingPannel.show();
        getAsText(files[0]);
    } else {
        alert('FileReader are not supported in this browser.');
    }
}

function getAsText(fileToRead) {
    var reader = new FileReader();
    // Handle errors load
    reader.onload = loadHandler;
    reader.onerror = errorHandler;
    // Read file into memory as UTF-8      
    reader.readAsText(fileToRead);
}

function loadHandler(event) {
    var xml = event.target.result;
    //alert(xml);   
    doc = StringtoXML(xml);
    searchXML(doc);
}


function errorHandler(evt) {
    if (evt.target.error.name == "NotReadableError") {
        alert("Canno't read file !");
    }
}

function StringtoXML(text) {
    if (window.ActiveXObject) {
        var doc = new ActiveXObject('Microsoft.XMLDOM');
        doc.async = 'false';
        doc.loadXML(text);
    } else {
        var parser = new DOMParser();
        var doc = parser.parseFromString(text, 'text/xml');
    }
    return doc;
}

function searchXML(xmlDoc) {
    var x = xmlDoc.getElementsByTagName("Session");
    var zb = xmlDoc.getElementsByTagName("var");
    var xmlElements = $(xmlDoc).find('Session');
    var xmlElements2 = $(xmlDoc).find('var');
    var length = xmlElements.length;
    var index = 0;
    setCookie();
    var process = function () {
        for (; index < length; index++) {
            var toProcess = xmlElements[index];
            // Perform xml processing
            myProcess(index, xmlElements2, x);
            if (index + 1 < length && index % 100 == 0) {
                setTimeout(process, 0);
            }
        }
    };
    process();
    document.getElementById("total").innerHTML = "<b>Order Total: </b>$" + salesTotal.toFixed(2);
    document.getElementById("error").innerHTML = "Order Total Errors: " + divText2;
    loadingPannel.hide();
    $('#example').DataTable().draw();
    $('#t2').show();
    $('#t3').show();
    $('#t4').show();
    $('#t5').show();
    revenueTable();
}

$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
    initMap();
    checkCookie();
    $('#t2').hide();
    $('#t3').hide();
    $('#t4').hide();
    $('#t5').hide();
    $("#xmlFileinput").change(function () {
        handleFiles(this.files);
    });

    $("#pntbtn").click(function () {
        printME();
    });

    var table = $('#example').DataTable({
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

    // Setup - add a text input to each footer cell
    $('.srcT').each(function () {
        $(this).html('<input type="text" placeholder="Search" size="4"/>');
    });

    $('input.column_filter').on('keyup click', function () {
        filterColumn($(this).attr('data-column'));
    });

    // Apply the search
    table.columns().every(function () {
        var that = this;

        $('input', this.footer()).on('keyup change', function () {
            that
                .search(this.value)
                .draw();
        });
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
    $('#example tbody').on('click', 'td', function () {
        var td = table.cell(this).data();
        if (td === '<button type="button" id="pntbtn1" class="btn btn-info btn-sm" data-toggle="modal" data-target="#myModal">Print</button>') {
            var myData = "";
            myData = table.cell(this).index();
            myData = table.row(myData.row).data();
            changeModal(myData);
        }
    });

    //visibility buttons
    $('a.toggle-vis').on('click', function (e) {
        e.preventDefault();

        // Get the column API object
        var column = table.column($(this).attr('data-column'));

        // Toggle the visibility
        column.visible(!column.visible());
    });

    $('a[href=#chart2]').on('shown.bs.tab', function () {
        //chart for pie chart
        var pieData = [{
            value: 300,
            color: "#F7464A",
            highlight: "#FF5A5E",
            label: "Red"
                }];
        var ctx4 = document.getElementById("invest-chart4").getContext("2d");
        var csatPie = new Chart(ctx4).Pie(pieData, {
            responsive: true
        });

        //chart data for CSAT
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
            responsive: true
        });
        csat.sort();
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
        csatPie.removeData(0);
    });

    $('a[href=#chart]').on('shown.bs.tab', function () {
        //chart data for visitor
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
            responsive: true
        });

        //chart data for agent
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
            responsive: true
        });

        //chart data for agent avg response time
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
            responsive: true
        });

        //visitor response graph
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
        //agent response time graph
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

        //populate agent average response time for each agent
        for (var i = 0; i < agentList.length; i++) {
            var tempAgAvg = 0;
            for (var j = 0; j < agentList[i].chats.length; j++) {
                tempAgAvg += agentList[i].chats[j];
            }
            tempAgAvg = tempAgAvg / agentList[i].chats.length;
            invest_chart21.addData([tempAgAvg, avgT3], agentList[i].name);
        }
    });

    $('a[href=#chart4]').on('shown.bs.tab', function () {
        google.maps.event.trigger(map, "resize");
    });
});
/* Formatting function for row details - modify as you need */
function format(d) {
    // `d` is the original data object for the row
    return '<table class="tableModal" cellpadding="5" cellspacing="0" border="1" style="padding-left:50px;">' +
        '<tr>' +
        '<td><b>Chat Transcript:</b></td>' +
        '<td><b>Prechat Survey:</b></td>' +
        '<td><b>Postchat Survey:</b></td>' +
        '<td><b>Offline Survey:</b></td>' +
        '<td><b>Opperator Survey:</b></td>' +
        '</tr>' +
        '<tr>' +
        '<td>' + d[17] + '</td>' +
        '<td>' + d[18] + '</td>' +
        '<td>' + d[19] + '</td>' +
        '<td>' + d[20] + '</td>' +
        '<td>' + d[24] + '</td>' +
        '</tr>' +
        '</table>' +
        '<br />' +
        '<table class="tableModal" cellpadding="5" cellspacing="0" border="1" style="padding-left:50px;">' +
        '<tr>' +
        '<th colspan="2" style="text-align: center"><b>General Chat Info</b></th>' +
        '</tr>' +
        '<tr>' +
        '<td>Browser:</td>' +
        '<td>' + d[7] + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Host IP:</td>' +
        '<td>' + d[8] + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Country:</td>' +
        '<td>' + d[10] + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>City:</td>' +
        '<td>' + d[11] + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Organization:</td>' +
        '<td>' + d[12] + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>World Region:</td>' +
        '<td>' + d[13] + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Postal Code:</td>' +
        '<td>' + d[14] + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Time Zone:</td>' +
        '<td>' + d[15] + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>ISP:</td>' +
        '<td>' + d[16] + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Chat Referer:</td>' +
        '<td>' + d[26] + '</td>' +
        '</tr>' +
        '</table>';
}

function splitDate(date) {
    date = date.split("T");
    var subDate = date[1].split("+");
    subDate = subDate[0];
    date = date[0];
    var combinedDate = date + "<br />" + subDate + " (UTC)";
    return combinedDate;
}

function splitDate2(date) {
    date = date.split("T");
    var subDate = date[1].split("+");
    subDate = subDate[0];
    date = date[0];
    var combinedDate = "<b>Date: </b>" + date + " <b>Time: </b>" + subDate + " (UTC)";
    return combinedDate;
}

function getDuration(x) {
    var msec = x;
    var hh = Math.floor(msec / 1000 / 60 / 60);
    msec -= hh * 1000 * 60 * 60;
    var mm = Math.floor(msec / 1000 / 60);
    msec -= mm * 1000 * 60;
    var ss = Math.floor(msec / 1000);
    msec -= ss * 1000;
    hh = addZero(hh);
    mm = addZero(mm);
    ss = addZero(ss);
    var rTime = hh + ":" + mm + ":" + ss;
    return rTime;
}

function addZero(n) {
    return (n < 10) ? ("0" + n) : n;
}

function myProcess(i, zb, x) {
    divText += "<tr><td>";
    chatObj = x[i].getElementsByTagName("Chat")[0];
    if (chatObj == undefined) {
        d1 = "";
        d2 = "";
        d3 = "";
    } else {
        var startTime = x[i].getElementsByTagName("Chat")[0].attributes[1].nodeValue;
        var endTime = x[i].getElementsByTagName("Chat")[0].attributes[0].nodeValue;
        var eDate = new Date(endTime);
        var sDate = new Date(startTime);
        var diffDate = eDate - sDate;
        d1 = splitDate(startTime);
        d2 = splitDate(endTime);
        d3 = getDuration(diffDate);
    }

    chatObj = x[i].getElementsByTagName("chatReferer")[0];
    if (chatObj == undefined) {
        d4 = "";
    } else {
        d4 = x[i].getElementsByTagName("chatReferer")[0].childNodes[0].nodeValue;
    }
    chatObj = x[i].getElementsByTagName("Rep")[0];
    if (chatObj == undefined) {
        d5 = "";
    } else {
        d5 = x[i].getElementsByTagName("Rep")[0].attributes.getNamedItem("repName").nodeValue;
    }
    chatObj = x[i].getElementsByTagName("agent")[0];
    if (chatObj == undefined) {
        d6 = "";
    } else {
        d6 = x[i].getElementsByTagName("agent")[0].childNodes[0].nodeValue;
    }
    chatObj = x[i].getElementsByTagName("ip")[0];
    if (chatObj == undefined) {
        d7 = "";
    } else {
        d7 = x[i].getElementsByTagName("ip")[0].childNodes[0].nodeValue;
    }
    d8 = x[i].attributes[1].nodeValue;

    chatObj = x[i].getElementsByTagName("geoCountry")[0].childNodes[0];
    if (chatObj == undefined) {
        d9 = "";
    } else {
        d9 = x[i].getElementsByTagName("geoCountry")[0].childNodes[0].nodeValue;
    }

    chatObj = x[i].getElementsByTagName("geoCity")[0].childNodes[0];
    if (chatObj == undefined) {
        d10 = "";
    } else {
        d10 = x[i].getElementsByTagName("geoCity")[0].childNodes[0].nodeValue;
    }

    chatObj = x[i].getElementsByTagName("geoOrg")[0].childNodes[0];
    if (chatObj == undefined) {
        d11 = "";
    } else {
        d11 = x[i].getElementsByTagName("geoOrg")[0].childNodes[0].nodeValue;
    }

    chatObj = x[i].getElementsByTagName("geoReg")[0].childNodes[0];
    if (chatObj == undefined) {
        d12 = "";
    } else {
        d12 = x[i].getElementsByTagName("geoReg")[0].childNodes[0].nodeValue;
    }

    chatObj = x[i].getElementsByTagName("geoPost")[0].childNodes[0];
    if (chatObj == undefined) {
        d13 = "";
    } else {
        d13 = x[i].getElementsByTagName("geoPost")[0].childNodes[0].nodeValue;
    }

    chatObj = x[i].getElementsByTagName("geoTimeZone")[0].childNodes[0];
    if (chatObj == undefined) {
        d14 = "";
    } else {
        d14 = x[i].getElementsByTagName("geoTimeZone")[0].childNodes[0].nodeValue;
    }

    chatObj = x[i].getElementsByTagName("geoISP")[0].childNodes[0];
    if (chatObj == undefined) {
        d15 = "";
    } else {
        d15 = x[i].getElementsByTagName("geoISP")[0].childNodes[0].nodeValue;
    }

    var long = x[i].getElementsByTagName("geoLong")[0].childNodes[0].nodeValue;
    var lat = x[i].getElementsByTagName("geoLat")[0].childNodes[0].nodeValue;
    lat = parseFloat(lat);
    long = parseFloat(long);
    addPoints(lat, long);

    //chat transcript
    var y = x[i].getElementsByTagName("line");
    d16 = "";
    for (j = 0; j < y.length; j++) {
        //code for calculating response time
        if (j != 0) {
            // visitor response time
            if (y[j].attributes.getNamedItem("by").nodeValue != "info" && y[j].hasAttribute("repId") == false) {
                if (y[j - 1].attributes.getNamedItem("by").nodeValue != "info" && y[j - 1].hasAttribute("repId") == false) {} else {
                    var vDate = y[j].attributes.getNamedItem("time").nodeValue;
                    var eDate = new Date(vDate);
                    var oDate = y[j - 1].attributes.getNamedItem("time").nodeValue;
                    var sDate = new Date(oDate);
                    var diffDate = eDate - sDate;
                    diffDate = diffDate / 1000;
                    var dd = {
                        dd1: diffDate,
                        dd2: i,
                        dd3: j
                    };
                    temObj.push(dd);
                }
            }
            // agent response time
            if (y[j].attributes.getNamedItem("by").nodeValue != "info" && y[j].hasAttribute("repId") == true) {
                if (y[j - 1].attributes.getNamedItem("by").nodeValue == "info") {
                    //console.log(y[j].attributes);
                    var vDate = y[j].attributes.getNamedItem("time").nodeValue;
                    var eDate = new Date(vDate);
                    var oDate = y[j - 1].attributes.getNamedItem("time").nodeValue;
                    var sDate = new Date(oDate);
                    var diffDate = eDate - sDate;
                    diffDate = diffDate / 1000;
                    var dd = {
                        dd1: diffDate,
                        dd2: i,
                        dd3: j
                    };
                    temObj3.push(dd);
                }
                if (y[j - 1].attributes.getNamedItem("by").nodeValue != "info" && y[j - 1].hasAttribute("repId") == false) {
                    //console.log(y[j].attributes);
                    var vDate = y[j].attributes.getNamedItem("time").nodeValue;
                    var eDate = new Date(vDate);
                    var oDate = y[j - 1].attributes.getNamedItem("time").nodeValue;
                    var sDate = new Date(oDate);
                    var diffDate = eDate - sDate;
                    diffDate = diffDate / 1000;
                    var dd = {
                        dd1: diffDate,
                        dd2: i,
                        dd3: j
                    };
                    temObj3.push(dd);
                }
            }
        }

        if (y[j].childNodes[0].nodeName == "Text") {
            //who talked
            txt = y[j].attributes[0].nodeValue;
            if (txt == "You") {
                txt = "Visitor";
            }
            title = y[j].getElementsByTagName("Text")[0].childNodes[0].nodeValue;
            tempTime = y[j].getAttribute("time");
            d16 += splitDate2(tempTime) + "<br />";
            if (y[j].attributes[0].nodeValue == "info") {
                d16 += "<font color='green'>" + txt + ': ' + title + "</font><br /><br />";
            } else if (y[j].attributes[1].nodeName == "repId") {
                d16 += "<font color='blue'>" + txt + ': ' + title + "</font><br /><br />";
            } else {
                d16 += "<font color='red'>" + txt + ': ' + title + "</font><br /><br />";
            }
        } else {
            //who talked
            txt = y[j].attributes[0].nodeValue;
            title = y[j].getElementsByTagName("HTML")[0].childNodes[0].nodeValue;
            title = title.replace(/(<p[^>]*>|<\/p>)/g, "");
            tempTime = y[j].getAttribute("time");
            d16 += splitDate2(tempTime) + "<br />";
            if (y[j].attributes[0].nodeValue == "info") {
                d16 += "<font color='green'>" + txt + ': ' + title + "</font><br /><br />";
            } else if (y[j].attributes[1].nodeName == "repId") {
                d16 += "<font color='blue'>" + txt + ': ' + title + "</font><br /><br />";
            } else {
                d16 += "<font color='red'>" + txt + ': ' + title + "</font><br /><br />";
            }
        }
    }

    //calculate average chat time for the chats
    var agentResponse = 0;
    for (var ii = 0; ii < temObj3.length; ii++) {
        agentResponse += temObj3[ii].dd1;
    }
    if (agentResponse != 0) {
        agentResponse = agentResponse / temObj3.length;
    }
    temObj3 = [];
    var responses = {
        responseTime: agentResponse,
        chat: i
    }
    if (agentResponse != 0) {
        temObj3T.push(responses);
        var agentExisits2 = false;
        var agentName = x[i].getElementsByTagName("Rep")[0].attributes.getNamedItem("repName").nodeValue;
        for (var t = 0; t < agentList.length; t++) {
            var tempAgent = agentList[t];
            if (tempAgent.name == agentName) {
                agentExisits2 = true;
                tempAgent.chats.push(agentResponse);
            }
        }
        if (agentExisits2 == false) {
            //code for indidvidual agents
            var myAgent = {
                name: agentName,
                chats: [agentResponse]
            }
            agentList.push(myAgent);
        }
    }
    var visitorResponse = 0;
    for (var ii = 0; ii < temObj.length; ii++) {
        visitorResponse += temObj[ii].dd1;
    }
    if (visitorResponse != 0) {
        visitorResponse = visitorResponse / temObj.length;
    }
    temObj = [];
    var responses = {
        responseTime: visitorResponse,
        chat: i
    }
    if (visitorResponse != 0) {
        temObjT.push(responses);
    }

    //Prechat Survey
    chatObj = x[i].getElementsByTagName("varValue");
    var pcs3 = "";
    d17 = "";
    d20 = "";
    for (k = 0; k < chatObj.length; k++) {
        pcs2 = chatObj[k].attributes[2].nodeValue;
        if (pcs2 == "PreChat") {
            d20 = "Y";
            pcs2 = chatObj[k].attributes[0].nodeValue; //id
            for (ii = 0; ii < zb.length; ii++) {
                if (zb[ii].attributes[0].nodeValue == pcs2) {
                    pcs3 = zb[ii].getElementsByTagName("title")[0].childNodes[0].nodeValue;
                    d17 += pcs3 + ": ";
                    pcs3 = chatObj[k].childNodes[0].nodeValue;
                    d17 += "<b>" + pcs3 + "</b><br /><br />";
                }
            }
        }
    }
    //Post Chat Survey
    d18 = "";
    chatObj = x[i].getElementsByTagName("varValue");
    pcs3 = "";
    d21 = "";
    for (k = 0; k < chatObj.length; k++) {
        pcs2 = chatObj[k].attributes[2].nodeValue;
        if (pcs2 == "PostChat") {
            d21 = "Y";
            pcs2 = chatObj[k].attributes[0].nodeValue; //id
            for (ii = 0; ii < zb.length; ii++) {
                if (zb[ii].attributes[0].nodeValue == pcs2) {
                    pcs3 = zb[ii].getElementsByTagName("title")[0].childNodes[0].nodeValue;
                    d18 += pcs3 + ": ";
                    pcs3 = chatObj[k].childNodes[0].nodeValue;
                    d18 += "<b>" + pcs3 + "</b><br /><br />";
                }
            }
            if (chatObj[k].attributes.getNamedItem("name").nodeValue == "chat_customer_satisfaction_1") {
                var surveyExists = false;
                var surveyQ = chatObj[k].childNodes[0].nodeValue;
                for (var t = 0; t < csat.length; t++) {
                    var tempCSAT = csat[t];
                    if (tempCSAT.name == surveyQ) {
                        surveyExists = true;
                        tempCSAT.total += 1;
                    }
                }
                if (surveyExists == false) {
                    //code for indidvidual agents
                    var agent = {
                        name: surveyQ,
                        total: 1
                    }
                    csat.push(agent);
                }
            }
        }
    }
    //Offline Survey
    chatObj = x[i].getElementsByTagName("varValue");
    d19 = "";
    pcs3 = "";
    d22 = "";
    for (k = 0; k < chatObj.length; k++) {
        pcs2 = chatObj[k].attributes[2].nodeValue;
        if (pcs2 == "Offline") {
            d22 = "Y";
            pcs2 = chatObj[k].attributes[0].nodeValue; //id
            for (ii = 0; ii < zb.length; ii++) {
                if (zb[ii].attributes[0].nodeValue == pcs2) {
                    pcs3 = zb[ii].getElementsByTagName("title")[0].childNodes[0].nodeValue;
                    d19 += pcs3 + ": ";
                    pcs3 = chatObj[k].childNodes[0].nodeValue;
                    d19 += "<b>" + pcs3 + "</b><br /><br />";
                }
            }
        }
    }
    //Operator Survey
    chatObj = x[i].getElementsByTagName("varValue");
    d23 = "";
    pcs3 = "";
    d24 = "";
    for (k = 0; k < chatObj.length; k++) {
        pcs2 = chatObj[k].attributes[2].nodeValue;
        if (pcs2 == "Operator") {
            d24 = "Y";
            pcs2 = chatObj[k].attributes[0].nodeValue; //id
            for (ii = 0; ii < zb.length; ii++) {
                if (zb[ii].attributes[0].nodeValue == pcs2) {
                    pcs3 = zb[ii].getElementsByTagName("title")[0].childNodes[0].nodeValue;
                    d23 += pcs3 + ": ";
                    pcs3 = chatObj[k].childNodes[0].nodeValue;
                    d23 += "<b>" + pcs3 + "</b><br /><br />";

                    //code for order total
                    if (pcs2 == myOrderID) {
                        pcs3x = pcs3.toLowerCase();
                        pcs3x = pcs3x.replace("$", "");
                        if (pcs3x.indexOf("n") == -1) {
                            subtotal = parseFloat(pcs3x);
                            if (isNaN(subtotal) == true) {
                                console.log(x[i]);
                                divText2 += pcs3x + "<br />"
                                subtotal = 0;
                            } else {
                                salesTotal += subtotal;
                            }
                        } else {
                            subtotal = 0;
                        }
                        // code for agent totals
                        var agentExists = false;
                        var agentName = x[i].getElementsByTagName("Rep")[0].attributes.getNamedItem("repName").nodeValue;
                        if (subtotal != 0) {
                            for (var t = 0; t < agents.length; t++) {
                                var tempAgent = agents[t];
                                if (tempAgent.name == agentName) {
                                    agentExists = true;
                                    tempAgent.total += subtotal;
                                    tempAgent.conversions += 1;
                                }
                            }
                            if (agentExists == false) {
                                //code for indidvidual agents
                                var agent = {
                                    name: agentName,
                                    total: subtotal,
                                    conversions: 1,
                                    aov: 0
                                }
                                agents.push(agent);
                            }
                        }
                    }
                }
            }
        }
    }
    //get skill group
    chatObj = x[i].getElementsByTagName("varValue");
    pcs3 = "null";
    for (k = 0; k < chatObj.length; k++) {
        pcs2 = chatObj[k].attributes[1].nodeValue;
        if (pcs2 == "skill") {
            pcs3 = chatObj[k].childNodes[0].nodeValue;
        }
    }
    if (pcs3 == "null") {
        d25 = "Unassigned";
    } else {
        d25 = pcs3;
    }

    //add data to table
    var t = $('#example').DataTable();
    t.row.add([
                      null, null, d1, d2, d3, d25, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17, d18, d19, d20, d21, d22, d23, d24, d4
                  ]);
}

function printME() {
    var DocumentContainer = document.getElementById('divtoprint');
    var WindowObject = window.open("", "PrintWindow",
        "width=750,height=650,top=50,left=50,toolbars=no,scrollbars=yes,status=no,resizable=yes");
    WindowObject.document.writeln(DocumentContainer.innerHTML);
    WindowObject.document.close();
    WindowObject.focus();
    WindowObject.print();
    WindowObject.close();
}

function changeModal(d) {
    var d = d;
    document.getElementById("otherTables").innerHTML = "";
    document.getElementById("st").innerHTML = "<b>Chat Start Time: </b>" + d[2];
    document.getElementById("et").innerHTML = "<b>Chat End Time: </b>" + d[3];
    document.getElementById("dur").innerHTML = "<b>Chat Duration: </b>" + d[4];
    document.getElementById("sk").innerHTML = "<b>Skill Group: </b>" + d[5];
    document.getElementById("ag").innerHTML = "<b>Operator: </b>" + d[6];
    document.getElementById("sess").innerHTML = "<b>Session ID: </b>" + d[9];
    //chat transcript
    if (d[17] !== "") {
        document.getElementById("otherTables").innerHTML += '<table border=1 class="tableModal">' +
            '<tr>' +
            '<td><div style="text-align: center"><b>Transcript</b></div></td>' +
            '</tr>' +
            '<tr>' +
            '<td><div>' + d[17] + '</div></td>' +
            '</tr>' +
            '</table><br />';
    }
    //pre chat survey
    if (d[18] !== "") {
        document.getElementById("otherTables").innerHTML += '<table border=1 class="tableModal">' +
            '<tr>' +
            '<td><div style="text-align: center"><b>Pre Chat Survey</b></div></td>' +
            '</tr>' +
            '<tr>' +
            '<td><div>' + d[18] + '</div></td>' +
            '</tr>' +
            '</table><br />';
    }
    //post chat survey
    if (d[19] !== "") {
        document.getElementById("otherTables").innerHTML += '<table border=1 class="tableModal">' +
            '<tr>' +
            '<td><div style="text-align: center"><b>Post Chat Survey</b></div></td>' +
            '</tr>' +
            '<tr>' +
            '<td><div>' + d[19] + '</div></td>' +
            '</tr>' +
            '</table><br />';
    }
    //Operator survey
    if (d[24] !== "") {
        document.getElementById("otherTables").innerHTML += '<table border=1 class="tableModal">' +
            '<tr>' +
            '<td><div style="text-align: center"><b>Operator Survey</b></div></td>' +
            '</tr>' +
            '<tr>' +
            '<td><div>' + d[24] + '</div></td>' +
            '</tr>' +
            '</table><br />';
    }
    //Offline survey
    if (d[20] !== "") {
        document.getElementById("otherTables").innerHTML += '<table border=1 class="tableModal">' +
            '<tr>' +
            '<td><div style="text-align: center"><b>Offline Survey</b></div></td>' +
            '</tr>' +
            '<tr>' +
            '<td><div>' + d[20] + '</div></td>' +
            '</tr>' +
            '</table><br />';
    }
    //General chat info
    document.getElementById("otherTables").innerHTML += '<table class="tableModal" cellpadding="5" cellspacing="0" border="1" style="padding-left:50px;">' +
        '<tr>' +
        '<th colspan="2" style="text-align: center"><b>General Chat Info</b></th>' +
        '</tr>' +
        '<tr>' +
        '<td>Browser:</td>' +
        '<td>' + d[7] + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Host IP:</td>' +
        '<td>' + d[8] + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Country:</td>' +
        '<td>' + d[10] + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>City:</td>' +
        '<td>' + d[11] + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Organization:</td>' +
        '<td>' + d[12] + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>World Region:</td>' +
        '<td>' + d[13] + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Postal Code:</td>' +
        '<td>' + d[14] + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Time Zone:</td>' +
        '<td>' + d[15] + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>ISP:</td>' +
        '<td>' + d[16] + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Chat Referer:</td>' +
        '<td>' + d[26] + '</td>' +
        '</tr>' +
        '</table>';
}

function strip(html) {
    var tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText;
}

function getOrderID() {
    myOrderID = document.getElementById("orderIDVar").value;
}

function filterColumn(i) {
    $('#example').DataTable().column(i).search(
        $('#col' + i + '_filter').val()
    ).draw();
}

function revenueTable() {
    var t2 = $('#example1').DataTable();
    for (var i = 0; i < agents.length; i++) {
        agents[i].aov = (agents[i].total / agents[i].conversions).toFixed(2);
        t2.row.add([
                      agents[i].name, agents[i].conversions, agents[i].total.toFixed(2), agents[i].aov
                  ]);
    }
    $('#example1').DataTable().draw();
}
var map, heatmap;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 3,
        center: {
            lat: 37.775,
            lng: -122.434
        },
        mapTypeId: google.maps.MapTypeId.SATELLITE
    });

    heatmap = new google.maps.visualization.HeatmapLayer({
        data: getPoints(),
        map: map
    });
}

function toggleHeatmap() {
    heatmap.setMap(heatmap.getMap() ? null : map);
}

function changeGradient() {
    var gradient = [
                    'rgba(0, 255, 255, 0)',
                    'rgba(0, 255, 255, 1)',
                    'rgba(0, 191, 255, 1)',
                    'rgba(0, 127, 255, 1)',
                    'rgba(0, 63, 255, 1)',
                    'rgba(0, 0, 255, 1)',
                    'rgba(0, 0, 223, 1)',
                    'rgba(0, 0, 191, 1)',
                    'rgba(0, 0, 159, 1)',
                    'rgba(0, 0, 127, 1)',
                    'rgba(63, 0, 91, 1)',
                    'rgba(127, 0, 63, 1)',
                    'rgba(191, 0, 31, 1)',
                    'rgba(255, 0, 0, 1)'
                ]
    heatmap.set('gradient', heatmap.get('gradient') ? null : gradient);
}

function changeRadius() {
    heatmap.set('radius', heatmap.get('radius') ? null : 20);
}

function changeOpacity() {
    heatmap.set('opacity', heatmap.get('opacity') ? null : 0.2);
}

// Heatmap data: 500 Points
function getPoints() {
    return [];
}

function addPoints(x, y) {
    var latLng = new google.maps.LatLng(x, y);
    heatmap.data.push(latLng);
}

function setCookie() {
    if (typeof (Storage) !== "undefined") {
        // Store
        var myOrderVar = document.getElementById("orderIDVar").value;
        localStorage.setItem("lastname", myOrderVar);
    } else {
        console.log("Sorry, your browser does not support Web Storage...");
    }
}

function checkCookie() {
    if (typeof (Storage) !== "undefined") {
        console.log(localStorage.getItem("lastname"));
        if (localStorage.getItem("lastname") == null) {
            console.log("Not set yet");
        } else {
            document.getElementById("orderIDVar").value = localStorage.getItem("lastname");
        }
    } else {
        console.log("Sorry, your browser does not support Web Storage...");
    }
}
