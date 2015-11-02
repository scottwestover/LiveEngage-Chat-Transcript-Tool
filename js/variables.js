/*added to keep track of order total*/
var salesTotal = 0;
/*var used to update the html tables with transcript data */
var divText = "";
/*added to track error in sales totals*/
var divText2 = "";
var loadingPannel;
var myOrderID = "";
/*visitor response time*/
var myLineChart;
/*csat totals*/
var myLineChart2;
/*csat avg*/
var myLineChart3;
/*holder for visitor response*/
var temObj = [];
var temObjT = [];
/*var holder for csat scores*/
var temObj2 = [];
/*var holder for agent response*/
var temObj3 = [];
var temObj3T = [];
/*var for average response time*/
var avgT = 0;
/*var for average csat score*/
var avgT2 = 0;
/*var for average visitor response time*/
var avgT3 = 0;
var csat = [];
/*revenue by agent code*/
var agents = [];
/*list of agents used for average response time*/
var agentList = [];
/*variable for custom CSAT question*/
var csatID = "";
/*variable for the loading modal that pops up*/
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
/*variable for list of agents and their csat scores*/
var csatAgentList = [];
