'use strict';

google.charts.load('current', {packages:['corechart']});
google.charts.setOnLoadCallback(onLoad);

function setVisitTableData(orderedSiteHits) {
    var tbody = document.getElementById('siteVisits');
    tbody.innerHTML = '';

    for (var i = orderedSiteHits.length - 1; i > orderedSiteHits.length - 11; i-- ) {
        var tr = "<tr>";

        /* Must not forget the $ sign */
        tr += "<td>" + orderedSiteHits[i][0] + "</td>" + "<td>" + orderedSiteHits[i][1] + "</td></tr>";

        /* We add the table row to the table body */
        tbody.innerHTML += tr;
    }
}

function drawVisitChart(orderedSiteHits) {
    var dataTable = google.visualization.arrayToDataTable(orderedSiteHits);

    var options = {
        title: 'Your Web Browsing Activity',
        titleTextStyle: {
            color: '#5d545f',
            fontName: 'Cutive Mono',
            fontSize: 20
        },
        chartArea: {
            left: 10,
            top:0,
            width:'90%',
            height:'90%'
        },
        pieHole: 0.4,
        sliceVisibilityThreshold: .005,
        backgroundColor: '#e9ecef',
        tooltip: {
            trigger: 'focus',
            textStyle: {
                color: '#5d545f',
                fontName: 'Cutive Mono',
                fontSize: 16
            }
        },
        legend: {
            position: 'none'
        }
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart'));
    chart.draw(dataTable, options);
}

function processVisitData(data) {
    var siteHits = new Object();
    for(var hit in data) {
        var link = document.createElement("a")
        link.href = data[hit].url

        var hostname = link.hostname;
        // Don't include the chrome extension site
        if(hostname !== 'ibmlgogdggpaemlifbkhljggmimabcgi') {
            if(siteHits[hostname]) {
                siteHits[hostname] += data[hit].visitCount;
            } else {
                siteHits[hostname] = data[hit].visitCount;
            }
        }
    }

    var orderedSiteHits = [];
    for (var hit in siteHits) {
        if(hit) {
            orderedSiteHits.push([hit, siteHits[hit]]);
        }
    }
    orderedSiteHits.sort(function(a, b) {
        return a[1] - b[1];
    });

    setVisitTableData(orderedSiteHits);
    orderedSiteHits.unshift(['Site', 'Number of Visits']);
    drawVisitChart(orderedSiteHits);
}

function renderVisitData(days) {
    // On load
    var millisInADay = 6 * 60 * 60 * 1000;
    var startTime =  Date.now() - (millisInADay * days);
    chrome.history.search({text: '', startTime: startTime, maxResults: 2000}, function(data) {
        processVisitData(data);
    });
<<<<<<< HEAD
}

/////////////////////////////////////////////////////////////////////////

function setTimeTableData(orderedSiteTimes) {
    console.log(orderedSiteTimes);
    var tbody = document.getElementById('siteTimes');
    tbody.innerHTML = '';

    for (var i = orderedSiteTimes.length - 1; i >= 0; i-- ) {
        var tr = "<tr>";
        var minutes = Math.round((orderedSiteTimes[i][1]) / (1000*60));

        /* Must not forget the $ sign */
        tr += "<td>" + orderedSiteTimes[i][0] + "</td>" + "<td>" + minutes + "</td></tr>";

        /* We add the table row to the table body */
        tbody.innerHTML += tr;
    }
}

function drawTimeChart(orderedSiteTimes) {
    var dataTable = google.visualization.arrayToDataTable(orderedSiteTimes);

    var options = {
        title: 'Your Web Browsing Activity',
        titleTextStyle: {
            color: '#5d545f',
            fontName: 'Cutive Mono',
            fontSize: 20
        },
        chartArea: {
            left: 10,
            top:0,
            width:'90%',
            height:'90%'
        },
        pieHole: 0.4,
        sliceVisibilityThreshold: .005,
        backgroundColor: '#e9ecef',
        tooltip: {
            trigger: 'focus',
            textStyle: {
                color: '#5d545f',
                fontName: 'Cutive Mono',
                fontSize: 16
            }
        },
        legend: {
            position: 'none'
        }
    };

    var chart = new google.visualization.PieChart(document.getElementById('piecharttime'));
    chart.draw(dataTable, options);
}


function renderTimeData(days) {
    //chrome.storage.local.get(['siteTimes'], function(result) {
        // console.log(result);
        //var siteTimes = result.siteTimes;
        var aggregatedSiteTimes = new Object();
        var millisInADay = 24 * 60 * 60 * 1000;
        var startTime =  Date.now() - (millisInADay * days);
        for(var site in siteTimes) {
            if(siteTimes[site].startTime >= startTime) {
                var link = document.createElement("a");
                link.href = site;
                var hostname = link.hostname;
                // Don't include the chrome extension site
                if(hostname !== 'ibmlgogdggpaemlifbkhljggmimabcgi') {
                    if(aggregatedSiteTimes[hostname]) {
                        aggregatedSiteTimes[hostname] += siteTimes[site].duration;
                    } else {
                        aggregatedSiteTimes[hostname] = siteTimes[site].duration;
                    }
                }
            }
        }

        var orderedSiteTimes = [];
        for (var time in aggregatedSiteTimes) {
            if(time) {
                orderedSiteTimes.push([time, aggregatedSiteTimes[time]]);
            }
        }
        orderedSiteTimes.sort(function(a, b) {
            return a[1] - b[1];
        });

        setTimeTableData(orderedSiteTimes);
        orderedSiteTimes.unshift(['Site', 'Time Spent (Minutes)']);
        drawTimeChart(orderedSiteTimes);
    // });
}

/////////////////////////////////////////////////////////////////////////

document.addEventListener('DOMContentLoaded', function() {
    var oneDay = document.getElementById('one-day');
    oneDay.addEventListener('click', function() {
        renderVisitData(1);
        renderTimeData(1);
    });

    var oneWeek = document.getElementById('one-week');
    oneWeek.addEventListener('click', function() {
        renderVisitData(7);
        renderTimeData(7);
    });

    var oneMonth = document.getElementById('one-month');
    oneMonth.addEventListener('click', function() {
        renderVisitData(30);
        renderTimeData(30);
    });
});

function onLoad() {
    renderVisitData(1);
    renderTimeData(1);
}
=======
};


>>>>>>> fixing bugs
