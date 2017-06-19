/**
 * Stravasicht
 *
 * A simple (but configurable) widget to display Strava data.
 *
 * Getting Started:
 * 1. You will need a Strava API access token to allow the widget
 *    to pull data from the Strava API.
 *    1.1 Simply go to: https://www.strava.com/settings/api
 *    1.2 Create an application and insert the access token below
 *
 * 2. You should be good to go! Feel free to muck around with configuration :)
 *
 * Author: Dragan Marjanovic - marjanovic.io
 */


// User configuration and Global Variables
// Set your access token here
accessToken: "3913a6f3213d9243dc162f4a8f49d8cf3292356f",


color: 'FFFFFF', // The hex color code for the desired graph color

// Options: distance, elapsed_time, max_speed
metric: "distance", // The metric to track and display


dataFreq: (1000 * 60 * 30), // Data refresh interval (Strava API)
refreshFrequency: 20000,

pinged: 0, // Time of the last data update
data: null, // The data from the last update

httpGet: function(url) {
    var xmlHttp = new XMLHttpRequest(); // Create the request object
    xmlHttp.open("GET", url, false); // Make the request
    xmlHttp.send(null);
    return xmlHttp.responseText; //Return the response
},

getData: function () {
    var baseURL = "https://www.strava.com/api/v3/athlete/activities";
    var requestURL = baseURL + "?access_token=" + this.accessToken;
    return this.httpGet(requestURL);
},

getDayCount: function(now) {
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now - start;
    var oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
},

command: function (callback) {
    var now = new Date();
    // Has been more than 15 minutes since last fetch
    if (now - this.pinged >= this.dataFreq ) {
        this.data = this.getData();
        this.pinged = now; // Update the last request date
    }
    // Feed the data back to the renderer for processing
    callback(0, this.data);
},

render: function (output) {
    // Initialise the Chart library and canvas container
    content = "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.4.0/Chart.bundle.min.js\"></script>"
    content += '<canvas id="myChart"></canvas>'
    return content;
},

afterRender: function(domEl) {
    var ctx = document.getElementById('myChart');

    activityData = JSON.parse(this.getData());

    var trackedMetricData = [];
    var labelData = [];

    var day = this.getDayCount(new Date());

    for (var i = 0; i < day; i++) {
        labelData.push("");
        trackedMetricData.push(0.001);
    }

    for (var i=0; i < activityData.length; i++) {
        var activity = activityData[i];
        var dayBin;

        // activityDate = new Date(activity.start_date_local);
        activityDate = new Date(activity.start_date);
        if (activityDate.getFullYear() >= new Date().getFullYear()) {
            var sdLocal = activity.start_date_local;
            var date = sdLocal.substring(0, sdLocal.indexOf("T"));
            dayBin = this.getDayCount(new Date(date)) - 1;
            switch (this.metric) {
                case "elapsed_time":
                    trackedMetricData[dayBin] += activity.elapsed_time/60;
                    break;
                case "max_speed": // The max speed for that day
                    maxKph = activity.max_speed * 60 * 60 / 1000;
                    if (maxKph > trackedMetricData[dayBin]) {
                        trackedMetricData[dayBin] = maxKph;
                    }
                case "distance":
                default: // Default should be distance
                    trackedMetricData[dayBin] += activity.distance/1000;
                    break;
            }
        }
    }


    var dataz = {
        labels: labelData,
        datasets: [{
            data: trackedMetricData,
            backgroundColor: this.color
        }]
    }

    config = {
        responsive: true,
        maintainAspectRatio: false,
        barThickness: 5,
        scales: {
            xAxes: [{ display: false }],
            yAxes: [{
                display: true,
                ticks: {
                    beginAtZero: true,
                    fontColor: this.color,
                    fontSize: 11,
                    fontStyle: "bold"
                },
                gridLines: {
                    color: "rgba(0, 0, 0, 0)",
                    display: false
                }
            }]
        },
        legend: { display: false }
    }

    var myChart = new Chart(ctx, {
        type: 'bar',
        data: dataz,
        options: config
    });
    // Increase the refresh frequency now that everything is ready
    this.refreshFrequency = this.dataFreq;
},

style: "            \n\
  bottom: .25%      \n\
  left: 0.25%       \n\
  height: 50px     \n\
  width: 99%        \n\
"
