function hideInputTab() {
    //check user type
    if (localStorage.getItem('currentUser') != undefined) {
        var currUser = JSON.parse(localStorage.getItem('currentUser'));
        var userType = currUser['type'];
        if (userType != 'Coach'){
            document.getElementsByClassName('inputTab')[0].style.display = 'none';
        }
    }
}