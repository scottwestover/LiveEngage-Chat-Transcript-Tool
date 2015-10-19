/*parse the transcript and update the data table*/
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
        if (x[i].getElementsByTagName("agent")[0].childNodes[0] == undefined) {
            d6 = "";
        } else {
            d6 = x[i].getElementsByTagName("agent")[0].childNodes[0].nodeValue;
        }
    }
    chatObj = x[i].getElementsByTagName("ip")[0];
    if (chatObj == undefined) {
        d7 = "";
    } else {
        if (x[i].getElementsByTagName("ip")[0].childNodes[0] == undefined) {
            d7 = ""
        } else {
            d7 = x[i].getElementsByTagName("ip")[0].childNodes[0].nodeValue;
        }
    }
    d8 = x[i].attributes[1].nodeValue;

    chatObj = x[i].getElementsByTagName("geoCountry")[0];
    if (chatObj == undefined) {
        d9 = "";
    } else {
        if (x[i].getElementsByTagName("geoCountry")[0].childNodes[0] == undefined) {
            d9 = "";
        } else {
            d9 = x[i].getElementsByTagName("geoCountry")[0].childNodes[0].nodeValue;
        }
    }
    chatObj = x[i].getElementsByTagName("geoCity")[0];
    if (chatObj == undefined) {
        d10 = "";
    } else {
        if (x[i].getElementsByTagName("geoCity")[0].childNodes[0] == undefined) {
            d10 = "";
        } else {
            d10 = x[i].getElementsByTagName("geoCity")[0].childNodes[0].nodeValue;
        }
    }

    chatObj = x[i].getElementsByTagName("geoOrg")[0];
    if (chatObj == undefined) {
        d11 = "";
    } else {
        if (x[i].getElementsByTagName("geoOrg")[0].childNodes[0] == undefined) {
            d11 = "";
        } else {
            d11 = x[i].getElementsByTagName("geoOrg")[0].childNodes[0].nodeValue;
        }
    }

    chatObj = x[i].getElementsByTagName("geoReg")[0];
    if (chatObj == undefined) {
        d12 = "";
    } else {
        if (x[i].getElementsByTagName("geoReg")[0].childNodes[0] == undefined) {
            d12 = "";
        } else {
            d12 = x[i].getElementsByTagName("geoReg")[0].childNodes[0].nodeValue;
        }
    }

    chatObj = x[i].getElementsByTagName("geoPost")[0];
    if (chatObj == undefined) {
        d13 = "";
    } else {
        if (x[i].getElementsByTagName("geoPost")[0].childNodes[0] == undefined) {
            d13 = "";
        } else {
            d13 = x[i].getElementsByTagName("geoPost")[0].childNodes[0].nodeValue;
        }
    }

    chatObj = x[i].getElementsByTagName("geoTimeZone")[0];
    if (chatObj == undefined) {
        d14 = "";
    } else {
        if (x[i].getElementsByTagName("geoTimeZone")[0].childNodes[0] == undefined) {
            d14 = "";
        } else {
            d14 = x[i].getElementsByTagName("geoTimeZone")[0].childNodes[0].nodeValue;
        }
    }

    chatObj = x[i].getElementsByTagName("geoISP")[0];
    if (chatObj == undefined) {
        d15 = "";
    } else {
        if (x[i].getElementsByTagName("geoISP")[0].childNodes[0] == undefined) {
            d15 = "";
        } else {
            d15 = x[i].getElementsByTagName("geoISP")[0].childNodes[0].nodeValue;
        }
    }

    var long = x[i].getElementsByTagName("geoLong")[0];
    if (long == undefined) {} else {
        if (x[i].getElementsByTagName("geoLong")[0].childNodes[0].nodeValue == undefined) {} else {
            long = x[i].getElementsByTagName("geoLong")[0].childNodes[0].nodeValue;
            var lat = x[i].getElementsByTagName("geoLat")[0].childNodes[0].nodeValue;
            lat = parseFloat(lat);
            long = parseFloat(long);
            addPoints(lat, long);
        }
    }

    /*chat transcript*/
    var y = x[i].getElementsByTagName("line");
    d16 = "";
    for (j = 0; j < y.length; j++) {
        /*code for calculating response time*/
        if (j != 0) {
            /* visitor response time*/
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
            /* agent response time*/
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
                    /*console.log(y[j].attributes);*/
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
            /*who talked*/
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
        d16 += "<div style='display: none;'>#NEL#Test#</div>";
    }
    /*calculate average chat time for the chats*/
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
            /*code for indidvidual agents*/
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

    /*Prechat Survey*/
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
                    d17 += "<div style='display: none;'>#NEL#Test#</div>";
                }
            }
        }
    }
    /*Post Chat Survey*/
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
                    d18 += "<div style='display: none;'>#NEL#Test#</div>";
                }
            }
            csatID = document.getElementById("CSATIDVar").value;
            if (chatObj[k].attributes.getNamedItem("name").nodeValue == csatID) {
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
                    /*code for indidvidual agents*/
                    var agent = {
                        name: surveyQ,
                        total: 1
                    }
                    csat.push(agent);
                }
            }
        }
    }
    /*Offline Survey*/
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
                    d19 += "<div style='display: none;'>#NEL#Test#</div>";
                }
            }
        }
    }
    /*Operator Survey*/
    chatObj = x[i].getElementsByTagName("varValue");
    d23 = "";
    pcs3 = "";
    d24 = "";
    for (k = 0; k < chatObj.length; k++) {
        pcs2 = chatObj[k].attributes[2].nodeValue;
        if (pcs2 == "Operator") {
            d24 = "Y";
            pcs2 = chatObj[k].attributes[0].nodeValue;
            for (ii = 0; ii < zb.length; ii++) {
                if (zb[ii].attributes[0].nodeValue == pcs2) {
                    pcs3 = zb[ii].getElementsByTagName("title")[0].childNodes[0].nodeValue;
                    d23 += pcs3 + ": ";
                    pcs3 = chatObj[k].childNodes[0].nodeValue;
                    d23 += "<b>" + pcs3 + "</b><br /><br />";
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
                        /* code for agent totals*/
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
                                /*code for indidvidual agents*/
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
                    d23 += "<div style='display: none;'>#NEL#Test#</div>";
                }

            }
        }
    }
    /*get skill group*/
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

    /*add data to table*/
    var t = $('#example').DataTable();
    t.row.add([
                      null, null, d1, d2, d3, d25, d5, d6, d7, d8, d9, d10, d11, d12, d13, d14, d15, d16, d17, d18, d19, d20, d21, d22, d23, d24, d4
                  ]);
}
