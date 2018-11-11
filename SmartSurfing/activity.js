'use strict';

google.charts.load('current', {packages:['corechart']});
google.charts.setOnLoadCallback(onLoad);

function setTableData(orderedSiteHits) {
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

function drawChart(orderedSiteHits) {
    console.log(orderedSiteHits);
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

function processData(data) {
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

    setTableData(orderedSiteHits);
    orderedSiteHits.unshift(['Site', 'Number of Visits']);
    drawChart(orderedSiteHits);
}

function renderData(days) {
    // On load
    var millisInADay = 6 * 60 * 60 * 1000;
    var startTime =  Date.now() - (millisInADay * days);
    chrome.history.search({text: '', startTime: startTime, maxResults: 2000}, function(data) {
        processData(data);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    var oneDay = document.getElementById('one-day');
    oneDay.addEventListener('click', function() {
        renderData(1);
    });

    var oneWeek = document.getElementById('one-week');
    oneWeek.addEventListener('click', function() {
        renderData(7);
    });

    var oneMonth = document.getElementById('one-month');
    oneMonth.addEventListener('click', function() {
        renderData(30);
    });
});

function onLoad() {
    renderData(1);
}
