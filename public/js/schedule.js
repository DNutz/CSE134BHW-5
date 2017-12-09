function viewGame(eventId, listOrigin) {
    db.collection(listOrigin).doc(eventId).get().then(function (doc) {
        var selectedGame = {};
        selectedGame['listOrigin'] = listOrigin;
        selectedGame['id'] = eventId;
        localStorage.setItem('selectedGame', JSON.stringify(selectedGame));
        location.href = 'gamestat_summary.html';
    }).catch(function (err) {
        console.error('Error in getting game for view game');
    });
}

function updateSchedule() {
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
}