var _charts = new (function() {

    this.drawHashtags = drawHashtags;
    this.setMinCount = setMinCount;

    var MIN_COUNT = 100;

    function drawHashtags(hashtags) {
        var series = [];
        _.each(hashtags, function(count, hashtag) {
            if(count > MIN_COUNT) {
                series.push({
                    name: hashtag,
                    data: [count]
                });
            }
        });
        $("#chart").find(".hashchart").highcharts({
            chart: {
                type: "column"
            },
            title: {
                text: "Hashtags used"
            },
            xAxis: {
                categories: ["Hashtag"]
            },
            yAxis: {
                min: 0,
                title: {
                    text: "Tweet count"
                }
            },
            series: series
        });
    }

    function setMinCount (count) {
        MIN_COUNT = parseInt(count, 10) || MIN_COUNT;
    }
});