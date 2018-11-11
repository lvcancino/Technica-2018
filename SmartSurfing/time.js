chrome.history.search({text: '', startTime: startTime, maxResults: 2000}, function(data) {
    totalTimes = new Object();
    urls = data.map(function(entry) {
        return entry.url;
    });

    for(var i = 0; i < urls.length; i++) {
        chrome.history.getVisits(urls[i], function(visits) {

        });
    }
});