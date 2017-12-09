function hideInputTab() {
    //check user type
    /*if (localStorage.getItem('currentUser') != undefined) {
        var currUser = JSON.parse(localStorage.getItem('currentUser'));
        var userType = currUser['type'];
        if (userType != 'Coach'){
            document.getElementsByClassName('inputTab')[0].style.display = 'none';
        }
    }*/
    var curruser;
    var db = firebase.firestore();
    firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        curruser = firebase.auth().currentUser;
        db.collection('users').where("email", "==", curruser.email).get()
        .then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                var type = doc.data().type;
                //console.log(type);
                if (type != 'Coach'){
                    document.getElementsByClassName('inputTab')[0].style.display = 'none';
                }
            });
        })
        .catch(function(error) {
            console.log("Error getting documents: ", error);
        });
        
    } else {
        // No user is signed in.
    }
    });
}