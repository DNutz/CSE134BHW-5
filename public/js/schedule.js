function viewGame(eventId, listOrigin) {
    /*
    var numIndex = parseInt(indexStr);
    var upcomingEventList = JSON.parse(localStorage.getItem(origin + 'List'));
    var selectedGame = upcomingEventList[numIndex];
    selectedGame['listOrigin'] = origin;
    localStorage.setItem('selectedGame', JSON.stringify(selectedGame));
    location.href = 'gamestat_summary.html';
    */
    db.collection(listOrigin).doc(eventId).get().then(function (doc) {
        var selectedGame = doc.data();
        selectedGame['listOrigin'] = listOrigin;
        selectedGame['id'] = eventId;
        db.collection('editGames').doc('selectedGame').set(selectedGame).then(function() {
            console.log('Successfully set selected game');
            location.href = 'gamestat_summary.html';
        }).catch(function (error) {
            console.error('Error in setting selected game');
        });
    }).catch(function (err) {
        console.error('Error in getting game for view game');
    });
}

function updateSchedule() {
    //get today's date
    var today = new Date();
    today.setHours(0,0,0,0);
    var todayDate = Date.parse(today.toDateString());

    var upcomingRef = db.collection('upcomingEvents');
    upcomingRef.orderBy('dateVal').orderBy('time').get().then(function (querySnapshot) {
        var expiredEvents = [];
        for (var docIndex = 0; docIndex < querySnapshot.size; ++docIndex) {
            var currentDoc = querySnapshot.docs[docIndex];
            if (todayDate > Date.parse(currentDoc.data().date)) {
                expiredEvents.push(currentDoc);
            }
            else {
                break;
            }
        }
        return expiredEvents;
    }).then(function (expiredEvents) {
        console.log('Expired length: ' + expiredEvents.length);
        for (var index = 0; index < expiredEvents.length; ++index) {
            var removeId = expiredEvents[index].id;
            db.collection('previousEvents').add(expiredEvents[index].data()).then(function() {
                db.collection('upcomingEvents').doc(removeId).delete().then(function() {
                    console.log('Successfully transferred to previous');
                }).catch(function(error) {
                    console.error('Error removing document: ', error);
                });
            }).catch(function(error) {
                console.error('Error transferring to previous: ', error);
            });           
        }
    })
    /*
    //update upcoming event list
    var index = 0;
    for (index = 0; index < upcomingEventList.length; index++) {
        if (todayDate <= Date.parse(upcomingEventList[index].date)) {
            break;
        }
    }
    
    if (index == 0) {
        var previousEvents = [];
    }
    else {
        previousEvents = upcomingEventList.splice(0, index);
    }

    localStorage.setItem('upcomingList', JSON.stringify(upcomingEventList));

    //move expired events to previous list
    var previousEventList = localStorage.getItem('previousList');
    if (previousEventList == undefined) {
        previousEventList = [];
    }
    else {
        previousEventList = JSON.parse(previousEventList);
    }

    for (var pos = 0; pos < previousEvents.length; pos++) {
        previousEventList.push(previousEvents[pos]);
    }
    localStorage.setItem('previousList', JSON.stringify(previousEventList));
    */
}