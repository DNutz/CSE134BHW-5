function viewGame(indexStr, origin) {
    var numIndex = parseInt(indexStr);
    var upcomingEventList = JSON.parse(localStorage.getItem(origin + 'List'));
    var selectedGame = upcomingEventList[numIndex];
    selectedGame['listOrigin'] = origin;
    localStorage.setItem('selectedGame', JSON.stringify(selectedGame));
    location.href = 'gamestat_summary.html';
}

function updateSchedule(upcomingEventList) {
    //get today's date
    var today = new Date();
    today.setHours(0,0,0,0);
    var todayDate = Date.parse(today.toDateString());

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
}