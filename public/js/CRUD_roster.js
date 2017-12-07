function initializeRoster(amount) {
    //alert('initializing roster');
    var players = [];

    /*if (amount == 0) {
        alert('Please specify the number of players you want to create');
        return 0;
    }*/

    for (var i = 0; i < amount; i++) {

        var stat = (i % 2 == 1) ? 'Starter' : 'Bench-warmer';
        var now = new Date();
        //var dob = now.getMonth() + '/' + now.getDate() + '/' + now.getFullYear();
        var img = document.createElement('img');
        img.alt = 'Player Icon';
        var stats = {
            fouls: 0,
            redCards: 0,
            yellowCards: 0,
            shotsOnGoal: 0,
            goals: 0,
            cKicks: 0,
            pKicks: 0,
            tIns: 0,
            appearances: 0
        };

        var player = {
            img: img,
            number: i,
            name: 'Player ' + i,
            status: stat,
            position: 'position ' + i,
            college: 'UCSD',
            hometown: 'San Diego',
            age: (30 - i),
            DOB: Date.now(),
            ID: ('P' + (11110 + i)),
            stats: stats,
            inactive: false
        };

        players.push(player);
    }
    localStorage.setItem('Roster', JSON.stringify(players));

    return 1;
}

function removeRoster() {
    localStorage.removeItem('Roster');
}

function getRoster() {
    return JSON.parse(localStorage.getItem('Roster'));
}

function createUniqueID() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function checkPlayer(num) {
    var roster = JSON.parse(localStorage.getItem('Roster'));
    for (var i = 0; i < roster.length; i++) {
        if (roster[i].number == num && roster[i].inactive == false) return false
    }
    return true;
}

function checkPlayerUpdate(num, pid) {
    var roster = JSON.parse(localStorage.getItem('Roster'));
    for (var i = 0; i < roster.length; i++) {
        if (roster[i].number == num && roster[i].ID != pid) return false
    }
    return true;
}

function createPlayer(img, inputName, pos, num, stat, college, home, age, dob, stats) {

    var player = {
        img: img,
        number: num,
        name: inputName,
        status: stat,
        position: pos,
        college: college,
        hometown: home,
        age: age,
        DOB: dob,
        ID: createUniqueID(),
        stats: stats,
        inactive: false
    };
    return player;
}

function createPlayerFirestore(img, inputName, pos, num, stat, college, home, age, dob, stats) {

    var uniqueID = createUniqueID();
    var db = firebase.firestore();
    var stats = {
        fouls: 0,
        redCards: 0,
        yellowCards: 0,
        shotsOnGoal: 0,
        goals: 0,
        cKicks: 0,
        pKicks: 0,
        tIns: 0,
        appearances: 0
    };
    db.collection("players").doc(uniqueID).set({
        img: img,
        number: num,
        name: inputName,
        status: stat,
        position: pos,
        college: college,
        hometown: home,
        age: age,
        DOB: dob,
        ID: uniqueID,
        stats: stats,
        inactive: false
    })
        .then(function (docRef) {
            console.log("Document written with ID: ", uniqueID);
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
        });

        var player = {
            img: img,
            number: num,
            name: inputName,
            status: stat,
            position: pos,
            college: college,
            hometown: home,
            age: age,
            DOB: dob,
            ID: uniqueID,
            stats: stats,
            inactive: false
        };
        return player;
}


function updatePlayerFirestore(img, inputName, pos, num, stat, college, home, age, dob, pid) {

    console.log("PID: " + pid);
    var db = firebase.firestore();
    var player = db.collection('players').doc(pid).set({
        //img: img,
        number: num,
        name: inputName,
        status: stat,
        position: pos,
        college: college,
        hometown: home,
        age: age,
        DOB: dob
        
    }, {merge: true})
    .then(function() {
        console.log("Document successfully updated!");
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        console.error("Error updating document: ", error);
    });

    //localStorage.setItem('Roster', JSON.stringify(backRoster));
    var player = {
        img: img,
        number: num,
        name: inputName,
        status: stat,
        position: pos,
        college: college,
        hometown: home,
        age: age,
        DOB: dob,
        inactive: false
    };
    return player;
}

function deletePlayerFirestore(pid) {
    db = firebase.firestore();
    db.collection('players').doc(pid).set({
        inactive: true
    }, {merge:true}) 
    .then(function() {
        console.log("Document successfully deleted!");
        location.href = 'roster_vanilla.html';        
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
}

function setInactiveByIndex(index) {
    var backRoster = JSON.parse(localStorage.getItem('Roster'));
    backRoster[index].inactive = true;
    localStorage.setItem('Roster', JSON.stringify(backRoster));
}

function deletePlayerByIndex(index) {

    var backRoster = JSON.parse(localStorage.getItem('Roster'));
    backRoster.splice(index, 1);
    localStorage.setItem('Roster', JSON.stringify(backRoster));

}

function deletePlayerByNumber(num) {

    var backRoster = JSON.parse(localStorage.getItem('Roster'));
    var index = -1;

    for (var i = 0; i < backRoster.length; i++) {

        if (backRoster[i].number == num) {

            index = i;
            break;
        }
    }
    if (index == -1) alert('The player with number ' + num + ' cannot be found');
    else deletePlayerByIndex(index);
}

function deletePlayerById(inputId) {

    var backRoster = JSON.parse(localStorage.getItem('Roster'));
    var index = -1;

    for (var i = 0; i < backRoster.length; i++) {

        if (backRoster[i].ID == inputId && backRoster[i].inactive == false) {

            index = i;
            break;
        }
    }
    if (index == -1) alert('The player with ID ' + inputId + ' cannot be found');
    else setInactiveByIndex(index);
}

function initializeInputStats() {
    //alert('Initializing input stats');
    var inputRoster = JSON.parse(localStorage.getItem('Roster'));
    //console.log(inputRoster);
    for (var i = 0; i < inputRoster.length; ++i) {
        if (inputRoster[i].inactive == false) {
            var id = inputRoster[i].ID;
            var name = inputRoster[i].name;
            var number = inputRoster[i].number;
            var position = inputRoster[i].position;
            var template = document.getElementById('playerTemplate').content;
            //console.log(template);
            //template.querySelector('#tempName').innerText = name;
            //console.log(template.childNodes[1].childNodes[1].childNodes[1].childNodes[1].childNodes[3].childNodes[1]);
            template.childNodes[1].childNodes[1].childNodes[1].childNodes[1].childNodes[3].childNodes[1].innerText = name;
            //template.firstChild.firstChild.firstChild.firstChild.childNodes[1].firstChild.innerText = name;
            //template.querySelector('#tempPos').innerText = position;
            template.childNodes[1].childNodes[1].childNodes[1].childNodes[1].childNodes[3].childNodes[3].innerText = position;
            //template.querySelector('#tempNum').innerText = number;
            template.childNodes[1].childNodes[1].childNodes[1].childNodes[1].childNodes[1].childNodes[3].innerText = number;
            //console.log(template.querySelector('#playerDiv'));
            //var f = ('show_modal('+name+')');
            //template.querySelector('#playerDiv').setAttribute('onClick',f);
            //template.querySelector('#playerDiv').setAttribute('onClick','show_modal('+name+')');
            //template.querySelector('#playerDiv').setAttribute('onClick','show_modal("'+name+'")');
            template.childNodes[1].childNodes[1].setAttribute('onClick', 'show_modal("' + id + '")');
            //console.log(template.childNodes[1].childNodes[1]);
            //template.querySelector('#playerDiv').setAttribute('onclick',function f(){show_modal(name)});
            //template.querySelector('#playerDiv').onclick = function f(){show_modal(name)};
            //console.log(template.querySelector('#playerDiv'));
            var toAdd = document.getElementById('playerTemplate').content.cloneNode(true);
            //console.log(toAdd);
            document.getElementById('IStbody').appendChild(toAdd);
        }
    }
    return 1;
}

function viewStats(id) {
    var inputRoster = JSON.parse(localStorage.getItem('Roster'));
    for (var i = 0; i < inputRoster.length; ++i) {
        var player = inputRoster[i];
        if (player.ID == id) {
            document.getElementById('fouls').innerText = player.stats.fouls;
            document.getElementById('redCards').innerText = player.stats.redCards;
            document.getElementById('yellowCards').innerText = player.stats.yellowCards;
            document.getElementById('shotsOnGoal').innerText = player.stats.shotsOnGoal;
            document.getElementById('goals').innerText = player.stats.goals;
            document.getElementById('cKicks').innerText = player.stats.cKicks;
            document.getElementById('pKicks').innerText = player.stats.pKicks;
            document.getElementById('tIns').innerText = player.stats.tIns;
            document.getElementById('appearances').innerText = player.stats.appearances;
            document.getElementById('update_btn').setAttribute('onClick', 'updateStats("' + id + '")');
            break;
        }
    }
}

function updateStats(id) {
    var inputRoster = JSON.parse(localStorage.getItem('Roster'));
    for (var i = 0; i < inputRoster.length; ++i) {
        var player = inputRoster[i];
        if (inputRoster[i].ID == id) {
            player.stats.fouls = document.getElementById('fouls').innerText;
            player.stats.redCards = document.getElementById('redCards').innerText;
            player.stats.yellowCards = document.getElementById('yellowCards').innerText;
            player.stats.shotsOnGoal = document.getElementById('shotsOnGoal').innerText;
            player.stats.goals = document.getElementById('goals').innerText;
            player.stats.cKicks = document.getElementById('cKicks').innerText;
            player.stats.pKicks = document.getElementById('pKicks').innerText;
            player.stats.tIns = document.getElementById('tIns').innerText;
            player.stats.appearances = document.getElementById('appearances').innerText;
            //inputRoster[i] = player;
            //console.log(inputRoster);
            localStorage.setItem('Roster', JSON.stringify(inputRoster));
            break;
        }
    }
    close_modal();
}