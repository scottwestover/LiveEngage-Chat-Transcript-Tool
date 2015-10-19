/*handles the file that the client loads*/
function handleFiles(files) {
    /*Check for the various File API support.*/
    if (window.FileReader) {
        /* FileReader are supported.*/
        /*gets the order total variable from the input*/
        getOrderID();
        /*shows loading panel while it processes transcripts*/
        loadingPannel.show();
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
    var x = xmlDoc.getElementsByTagName("Session");
    var zb = xmlDoc.getElementsByTagName("var");
    var xmlElements = $(xmlDoc).find('Session');
    var xmlElements2 = $(xmlDoc).find('var');
    var length = xmlElements.length;
    var index = 0;
    /*sets the cookie for the custom input variables*/
    setCookie();
    /*process the transcript it has a timeout so the screen does not freeze when processing large sets of data*/
    var process = function () {
        for (; index < length; index++) {
            var toProcess = xmlElements[index];
            /* Perform xml processing*/
            myProcess(index, xmlElements2, x);
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
    $('#example').DataTable().draw();
    $('#t2').show();
    $('#t3').show();
    $('#t4').show();
    $('#t5').show();
    /*draws the revenue table on the revenue tab*/
    revenueTable();
}
