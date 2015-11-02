/*sets the cookies for the custom variables*/
function setCookie() {
    if (typeof (Storage) !== "undefined") {
        // Store
        var myOrderVar = document.getElementById("orderIDVar").value;
        var myCSATVar = document.getElementById("CSATIDVar").value;
        localStorage.setItem("lastname", myOrderVar);
        localStorage.setItem("csatName", myCSATVar);
    } else {
        console.log("Sorry, your browser does not support Web Storage...");
    }
}
/*checks to see if the cookies have already been set*/
function checkCookie() {
    if (typeof (Storage) !== "undefined") {
        //console.log(localStorage.getItem("lastname"));
        //console.log(localStorage.getItem("csatName"));
        if (localStorage.getItem("lastname") == null) {
            //console.log("Not set yet");
        } else {
            document.getElementById("orderIDVar").value = localStorage.getItem("lastname");
        }
        if (localStorage.getItem("csatName") == null) {
            //console.log("Not set yet");
        } else {
            document.getElementById("CSATIDVar").value = localStorage.getItem("csatName");
        }
    } else {
        console.log("Sorry, your browser does not support Web Storage...");
    }
}
