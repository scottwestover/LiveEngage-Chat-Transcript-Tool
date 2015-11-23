var xml = null;
var myReportArray = [];
var report = {
    id: null,
    vals: null
};
/*handles the file that the client loads*/
function handleFiles(files) {
    /*Check for the various File API support.*/
    if (window.FileReader) {
        /* FileReader are supported.*/
        /*gets the order total variable from the input*/
        getOrderID();
        /*shows loading panel while it processes transcripts*/
        loadingPannel.show();
        /*hide options panel*/
        $('#1stChoice').hide();
        /*gets the text of the file so we can process it*/
        getAsText(files[0]);
    } else {
        alert('FileReader are not supported in this browser.');
    }
}
/*tries to read the file that is loaded*/
function getAsText(fileToRead) {
    var reader = new FileReader();
    /* Handle errors load*/
    reader.onload = loadHandler;
    reader.onerror = errorHandler;
    /* Read file into memory as UTF-8  */
    reader.readAsText(fileToRead);
}
/*loads the functions to parse the data*/
function loadHandler(event) {
    var xml = event.target.result;
    /*alert(xml);   */
    doc = StringtoXML(xml);
    searchXML(doc);
}
/*error that displays if file is corrupt*/
function errorHandler(evt) {
    if (evt.target.error.name == "NotReadableError") {
        alert("Canno't read file !");
    }
}
/*converts the text to xml so it can be parsed*/
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
/*searches the xml doc and processes the chat transcript*/
function searchXML(xmlDoc) {
    /*variables that are used for processing the chat transcript*/
    xml = xmlDoc;
    var x = xmlDoc.getElementsByTagName("Session");
    var zb = xmlDoc.getElementsByTagName("var");
    var xmlElements = $(xmlDoc).find('Session');
    var xmlElements2 = $(xmlDoc).find('var');
    var length = xmlElements.length;
    var index = 0;
    /*generate table for custom reports*/
    for (var i = 0; i < zb.length; i++) {
        if (zb[i].getElementsByTagName("title")[0].childNodes[0] != undefined) {
            $('#example10').DataTable().row.add([zb[i].getAttribute("id"), zb[i].getElementsByTagName("title")[0].childNodes[0].nodeValue]).draw();
        }
    }
    /*sets the cookie for the custom input variables*/
    setCookie();
    /*process the transcript it has a timeout so the screen does not freeze when processing large sets of data*/
    var process = function () {
        for (; index < length; index++) {
            var toProcess = xmlElements[index];
            /* Perform xml processing*/
            if (document.getElementById("interactiveCheck").checked) {
                myProcess2(index, xmlElements2, x);
            } else {
                myProcess(index, xmlElements2, x);
            }
            if (index + 1 < length && index % 100 == 0) {
                setTimeout(process, 0);
            }
        }
    };
    process();
    /*updates the divs for the order total on the revenue tab*/
    document.getElementById("total").innerHTML = "<b>Order Total: </b>$" + salesTotal.toFixed(2);
    /*updates the div for any errors when checking for revenue on the revenue tab*/
    document.getElementById("error").innerHTML = "Order Total Errors: " + divText2;
    /*done processing transcript so hide the processing modal, show the transcript table, and show the tabs*/
    loadingPannel.hide();
    $('#too').show();
    $('#too2').show();
    $('#t1').show();
    $('#example').DataTable().draw();
    if (document.getElementById("vCheck").checked) {
        $('#t2').show();
    }
    if (document.getElementById("cCheck").checked) {
        $('#t3').show();
    }
    if (document.getElementById("rCheck").checked) {
        $('#t4').show();
    }
    if (document.getElementById("mCheck").checked) {
        $('#t5').show();
    }
    if (document.getElementById("CusCheck").checked) {
        $('#t6').show();
    }
    if (document.getElementById("disCheck").checked) {
        $('#t7').show();
    }
    /*draws the revenue table on the revenue tab*/
    revenueTable();
    /*update the csat by agent div*/
    generateCSAT();
    /*draws the disconnect table*/
    disconnectTable();
}

function generateReports(x, y) {
    var reportDiv = "";
    //console.log(x);
    for (var i = 0; i < x.length; i++) {
        var transcript = xml.getElementsByTagName("varValue");
        var qName = "";
        for (var j = 0; j < transcript.length; j++) {
            if (x[i] == transcript[j].attributes.getNamedItem("id").nodeValue) {
                //console.log("match");
                /*push value to report array*/
                var answerExists = false;
                var answerValue = transcript[j].childNodes[0].nodeValue;
                for (var t = 0; t < myReportArray.length; t++) {
                    var tempAnswer = myReportArray[t];
                    if (tempAnswer.name == answerValue) {
                        answerExists = true;
                        tempAnswer.total += 1;
                    }
                }
                if (answerExists == false) {
                    /*code for indidvidual answers*/
                    var answer = {
                        name: answerValue,
                        total: 1
                    };
                    myReportArray.push(answer);
                }
            }
        }
        if (myReportArray.length > 0) {
            reportDiv = "<div class='row'><div class='col-md-12'><b><h4>Report - " + y[i] + "</h4></b><table id='example" + i + "C' class='display dataTable cell-border' cellspacing='0' width='100%'><thead><tr><th>Answer</th><th>Answer Total</th></tr></thead><tfoot><tr><th></th><th></th></tr></tfoot><tbody></tbody></table></div></div>";
            $("#myreports").append(reportDiv);
            var tableName = "#example" + i + "C";
            //console.log(tableName);
            var oTable = $(tableName).DataTable();
            for (var m = 0; m < myReportArray.length; m++) {
                oTable.row.add([myReportArray[m].name, myReportArray[m].total]).draw();
            }
        }
        //console.log(myReportArray);
        myReportArray = [];
    }
}
