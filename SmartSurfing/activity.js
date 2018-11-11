'use strict';

var siteHits = new Object();

chrome.history.search({text: ''}, function(data) {
    for(var hit in data) {
        var link = document.createElement("a")
        link.href = data[hit].url

        var hostname = link.hostname;
        if(siteHits[hostname]) {
            siteHits[hostname] += data[hit].visitCount;
        } else {
            siteHits[hostname] = data[hit].visitCount;
        }
    }

    var orderedSiteHits = [];
    for (var hit in siteHits) {
        if(hit) {
            orderedSiteHits.push([hit, siteHits[hit]]);
        }
    }
    console.log(orderedSiteHits);
    orderedSiteHits.sort(function(a, b) {
        return a[1] - b[1];
    });
    console.log(orderedSiteHits);
    var tbody = document.getElementById('siteVisits');

    for (var i = orderedSiteHits.length - 1; i >= orderedSiteHits.length - 11; i-- ) {
        var tr = "<tr>";

        /* Must not forget the $ sign */
        tr += "<td>" + orderedSiteHits[i][0] + "</td>" + "<td>" + orderedSiteHits[i][1] + "</td></tr>";

        /* We add the table row to the table body */
        tbody.innerHTML += tr;
    }
});