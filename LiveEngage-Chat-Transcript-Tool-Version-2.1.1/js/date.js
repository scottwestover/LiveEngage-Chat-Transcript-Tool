/*todays date*/
var todayDate = getTodayDate();
/*gets todays date*/
function getTodayDate() {
    var todayDate = new Date();
    var dd = todayDate.getDate();
    var mm = todayDate.getMonth() + 1; //January is 0!
    var yyyy = todayDate.getFullYear();
    if (dd < 10) {
        dd = '0' + dd
    }
    if (mm < 10) {
        mm = '0' + mm
    }
    todayDate = mm + '-' + dd + '-' + yyyy;
    return todayDate;
}
