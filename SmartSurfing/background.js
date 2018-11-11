// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// fake db for site time tracking
var siteTimes = new Object();
var currentTabs = new Object();

////////
// generate some fake data
siteTimes["https://www.facebook.com/"] = {
    duration: 1937400,
    endTime: 1541935707888,
    startTime: 1541933770488
};
siteTimes["https://www.google.com/"] = {
    duration: 5119300,
    endTime: 1541935700764,
    startTime: 1541934110764
};
siteTimes["https://www.youtube.com/"] = {
    duration: 5219300,
    endTime: 1541935700764,
    startTime: 1541839400764
};
siteTimes["https://www.stackoverflow.com/"] = {
    duration: 5210000,
    endTime: (Date.now() - 100000),
    startTime: (Date.now() - 100000)
};
siteTimes["https://www.technica.slack.com/"] = {
    duration: 911300,
    endTime: Date.now() - 100000,
    startTime: Date.now() - 100000
};
siteTimes["https://www.github.com/"] = {
    duration: 529000,
    endTime: Date.now() - 100000,
    startTime: Date.now() - 100000
};

chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.create({'url': chrome.extension.getURL('activity.html')}, function(tab) {
    // Tab opened.
   });
});

chrome.tabs.onUpdated.addListener(function(id, changes, tab) {
    //chrome.storage.local.get(['currentTabs'], function(result) {
        //chrome.storage.local.get(['siteTimes'], function(times) {
            //currentTabs = result.currentTabs;
            //siteTimes = times.siteTimes;
            if(changes.url && currentTabs[id] && siteTimes) {
                var endTime = Date.now();
                if(currentTabs[id]) {
                    var link = document.createElement("a");
                    link.href = changes.url;

                    var hostname = link.hostname;
                    // Don't include the chrome extension site
                    if(hostname !== 'ibmlgogdggpaemlifbkhljggmimabcgi') {
                        if(currentTabs[id].url) {
                            siteTimes[changes.url] = {
                                duration: endTime - currentTabs[id].startTime,
                                endTime: endTime,
                                startTime: currentTabs[id].startTime
                            }
                        }
                    }
                }
            }
            if(tab.url && tab.active) {
                var startTime = Date.now();
                var link = document.createElement("a");
                link.href = tab.url;

                var hostname = link.hostname;
                // Don't include the chrome extension site
                if(hostname !== 'ibmlgogdggpaemlifbkhljggmimabcgi') {
                    if(!currentTabs[tab.id]) {
                        currentTabs[tab.id] = {
                            startTime: startTime,
                            url: tab.url
                        }
                    }
                }
            }
            // chrome.storage.local.set({'currentTabs': currentTabs}, function() {
            //     console.log("Changed to: " + currentTabs);
            // });
            // chrome.storage.local.set({'siteTimes': siteTimes}, function() {
            //     console.log("Changed to: " + siteTimes);
            // });
        });
    //});

//});

chrome.tabs.onRemoved.addListener(function(id) {
    //chrome.storage.local.get(['currentTabs'], function(result) {
        //chrome.storage.local.get(['siteTimes'], function(times) {
          //  currentTabs = result.currentTabs;
            //siteTimes = times.siteTimes;
            var endTime = Date.now();
            if(currentTabs[id]) {
                var link = document.createElement("a")
                link.href = currentTabs[id].url;

                var hostname = link.hostname;
                // Don't include the chrome extension site
                if(hostname !== 'ibmlgogdggpaemlifbkhljggmimabcgi') {
                    if(currentTabs[id].url) {
                        siteTimes[currentTabs[id].url] = {
                            duration: endTime - currentTabs[id].startTime,
                            endTime: endTime,
                            startTime: currentTabs[id].startTime
                        }
                        delete currentTabs[id];
                    }
                }
            }
            //console.log(siteTimes);
            //chrome.storage.local.set({'currentTabs': currentTabs}, function() {
              //  console.log("Changed to " + currentTabs);
            //});
            //chrome.storage.local.set({'siteTimes': siteTimes}, function() {
              //  console.log("Changed to " + siteTimes);
            //});
});
