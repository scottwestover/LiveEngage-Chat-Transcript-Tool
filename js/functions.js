/*used to create a print view for the individual chats when user clicks the print button*/
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
/*updates the modal that is displayed when user clicks the print button for the transcript*/
function changeModal(d) {
    var d = d;
    document.getElementById("otherTables").innerHTML = "";
    document.getElementById("st").innerHTML = "<b>Chat Start Time: </b>" + d[2];
    document.getElementById("et").innerHTML = "<b>Chat End Time: </b>" + d[3];
    document.getElementById("dur").innerHTML = "<b>Chat Duration: </b>" + d[4];
    document.getElementById("sk").innerHTML = "<b>Skill Group: </b>" + d[5];
    document.getElementById("ag").innerHTML = "<b>Operator: </b>" + d[6];
    document.getElementById("sess").innerHTML = "<b>Session ID: </b>" + d[9];
    /*chat transcript*/
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
    /*pre chat survey*/
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
    /*post chat survey*/
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
    /*Operator survey*/
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
    /*Offline survey*/
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
    /*General chat info*/
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

/*gets the order id from the input for the order total*/
function getOrderID() {
    myOrderID = document.getElementById("orderIDVar").value;
}
/*filters the colums based on the selection */
function filterColumn(i) {
    $('#example').DataTable().column(i).search(
        $('#col' + i + '_filter').val()
    ).draw();
}
/*populates the revenue table that is displayed on the revenue tab*/
/*This information is populated from the code for agents total section in the processing function*/
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
/*This information is populated from disconnected by array*/
function disconnectTable(){
    var t3 = $('#disconnectTable').DataTable();
    for (var i = 0; i < disconnectList.length; i++) {
        t3.row.add([
                      disconnectList[i].name,disconnectList[i].total
                  ]);
    }
    $('#disconnectTable').DataTable().draw();
}
/* Formatting function for row details - modify as you need */
function format(d) {
    /*`d` is the original data object for the row*/
    return '<table class="tableModal" cellpadding="5" cellspacing="0" border="1" style="padding-left:50px;">' +
        '<tr>' +
        '<td><b>Chat Transcript:</b></td>' +
        '<td><b>Prechat Survey:</b></td>' +
        '<td><b>Postchat Survey:</b></td>' +
        '<td><b>Offline Survey:</b></td>' +
        '<td><b>Opperator Survey:</b></td>' +
        '</tr>' +
        '<tr>' +
        '<td>' + d[19] + '</td>' +
        '<td>' + d[20] + '</td>' +
        '<td>' + d[21] + '</td>' +
        '<td>' + d[22] + '</td>' +
        '<td>' + d[26] + '</td>' +
        '</tr>' +
        '</table>' +
        '<br />' +
        '<table class="tableModal" cellpadding="5" cellspacing="0" border="1" style="padding-left:50px;">' +
        '<tr>' +
        '<th colspan="2" style="text-align: center"><b>General Chat Info</b></th>' +
        '</tr>' +
        '<tr>' +
        '<td>Browser:</td>' +
        '<td>' + d[9] + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Host IP:</td>' +
        '<td>' + d[10] + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Country:</td>' +
        '<td>' + d[12] + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>City:</td>' +
        '<td>' + d[13] + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Organization:</td>' +
        '<td>' + d[14] + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>World Region:</td>' +
        '<td>' + d[15] + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Postal Code:</td>' +
        '<td>' + d[16] + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Time Zone:</td>' +
        '<td>' + d[17] + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>ISP:</td>' +
        '<td>' + d[18] + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Chat Referer:</td>' +
        '<td>' + d[28] + '</td>' +
        '</tr>' +
        '<tr>' +
        '<td>Disconnected By:</td>' +
        '<td>' + d[29] + '</td>' +
        '</tr>' +
        '</table>';
}
/*splits the date so we can convert it into a date object*/
function splitDate(date) {
    date = date.split("T");
    var subDate = date[1].split("+");
    subDate = subDate[0];
    date = date[0];
    var combinedDate = date + "<br />" + subDate + " (UTC)";
    return combinedDate;
}
/*splits the date so we can convert it into a date object*/
function splitDate2(date) {
    date = date.split("T");
    var subDate = date[1].split("+");
    subDate = subDate[0];
    date = date[0];
    //console.log("d: " + date + " s: " + subDate);
    var combinedDate = "<b>Date: </b>" + date + " <b>Time: </b>" + subDate + " (UTC)";
    return combinedDate;
}
/*calculates the duration of the chat*/
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
/*adds zero to the date so it will be formated correctly*/
function addZero(n) {
    return (n < 10) ? ("0" + n) : n;
}
