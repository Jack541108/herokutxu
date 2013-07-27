var _charts = new (function() {

    this.drawHashtags = drawHashtags;

    function drawHashtags(hashtags) {
        var series = [];
        _.each(hashtags, function(count, hashtag) {
            if(count > 5) {
                series.push({
                    name: hashtag,
                    data: [count]
                });
            }
        });
        $("#container").find(".hashchart").highcharts({
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
});