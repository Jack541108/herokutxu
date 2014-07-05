var _client = new (function() {
    this.init = init;

    var _socket = null,
        _current = 0,
        _numTweets = 0,
        _users = [],
        _hashtags = {},
        _reachedLimit = false,
        _tweetList = [],
        _maxTweets = 99,
        _showGlobes = false;

    function init() {
        if(io !== undefined) {
            _socket = io.connect("http://first-iker-demo.herokuapp.com:80/");
            _socket.on("new tweet", function(tweet) {
                newTweet(tweet);
            });
            _socket.on("connected", function(r) {
                $("head").find("title").html("Tracking now: " + r.tracking);
                $(".tracking").html(r.tracking);
                emitMsj("start stream");
            });
        }
        $(".btnRefresh").on("click", updateChart);
        $(".btnPeople").on("click", function() {
            $("#tweets").show();
            _showGlobes = true;
        });
        $(".btnMap").on("click", function () {
            _map.show();
        });
        $("#tweets").find(".close").on("click", function() {
            $("#tweets").hide();
            _showGlobes = false;
        });
        $("#map").find(".close").on("click", function() {
            _map.destroy();
        });
        setInterval(updateChart, 30000);
    }

    function updateChart() {
        _charts.setMinCount(getMinOccurrence());
        _charts.drawHashtags(_hashtags);
    }

    function getMinOccurrence() {
        return $.trim($("input#minOccurrence").val());
    }

    function newTweet(tweet) {
        if(_numTweets === 0) {
            $(".datetime").html(new Date().toLocaleString());
        }

        insertUser(tweet);
        insertHashtag(tweet);

        if(_showGlobes) {
            printTweetGlobes(tweet);
        }

        _numTweets++;
        $(".numTweets").html(_numTweets);
        $(".numUsers").html(_users.length);

        if(tweet.geo) {
            _map.addPoint(tweet.geo.coordinates);
        }
    }

    function insertUser(tweet) {
        if(_users.indexOf(tweet.user.screen_name) === -1) {
            _users.push(tweet.user.screen_name);
        }
    }

    function insertHashtag(tweet) {
        var hashtags = tweet.entities.hashtags;
        if(hashtags.length) {
            _.each(hashtags, function(hashtag) {
                hashtag = hashtag.text.toLowerCase();
                if(_hashtags[hashtag]) {
                    _hashtags[hashtag]++;
                }
                else {
                    _hashtags[hashtag] = 1;
                }
            });
        }
    }

    function printTweetGlobes(tweet) {
        _tweetList[_current] = tweet;
        var tweetsEle = $("#tweets").find(".list"),
            img = '<img src="' + tweet.user.profile_image_url + '" />',
            link = '<a href="https://twitter.com/' + tweet.user.screen_name +
                '" target="_blank" rel="' + _current + '">' + img + '</a>',
            elementHtml = '<div class="tweet-' + _current + '">' + link + '</div>';
        if(!_reachedLimit) {
            tweetsEle.append(elementHtml);
        }
        else {
            tweetsEle.find(".tweet-" + _current).html(link);
        }

        var tweetbox = $(".tweet-" + _current).find("a");
        tweetbox.not(".active").not(".watching").hover(function(){
            $(this).find("img").stop().animate({ opacity: 1 }, 300);
        }, function(){
            $(this).find("img").stop().animate({ opacity: 0.4 }, 300);
        });
        tweetbox.on("click", function() {
            tweetsEle.find("a").removeClass("watching");
            $(this).addClass("watching");
        });

        tweetsEle.find("a").removeClass("active");
        tweetsEle.find(".tweet-" + _current).find("a").addClass("active");
        _current++;
        if(_current > _maxTweets) {
            _current = 0;
            _reachedLimit = true;
        }
    }

    function emitMsj(signal, o) {
        if(_socket) {
            _socket.emit(signal, o);
        }
        else {
            alert("Shit! Socket.io didn't start!");
        }
    }

});