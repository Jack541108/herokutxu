var _client = new (function() {
    this.init = init;

    var _socket = null,
        _maxTweets = 500,
        _current = 0,
        _numTweets = 0,
        _users = [],
        _reachedLimit = false,
        _tweetList = [];

    function init() {
        if(io !== undefined) {
            _socket = io.connect("http://first-iker-demo.herokuapp.com/");
            _socket.on("new tweet", function(tweet) {
                newTweet(tweet);
            });
            _socket.on("connected", function(r) {
                $("head").find("title").html("Tracking now: " + r.tracking);
                $(".tracking").html(r.tracking);
                emitMsj("start stream");
            });
        }
    }

    function newTweet(tweet) {
        _tweetList[_current] = tweet;

        if(_users.indexOf(tweet.user.screen_name) === -1) {
            _users.push(tweet.user.screen_name);
        }

        var tweetsEle = $(".tweets"),
            elementHtml = '<a class="tweet-' + _current +
                '" href="javascript:void(0)" rel="' + _current + '"><img src="' +
                tweet.user.profile_image_url + '" /></a>';
        if(!_reachedLimit) {
            tweetsEle.append(elementHtml);
            var tweetbox = $(".tweet-" + _current);
            tweetbox.not(".active").not(".watching").hover(function(){
                $(this).find("img").stop().animate({ opacity: 1 }, 300);
            }, function(){
                $(this).find("img").stop().animate({ opacity: 0.4 }, 300);
            });
            tweetbox.on("click", function() {
                showTweet(_tweetList[$(this).attr("rel")]);
                tweetsEle.find("a").removeClass("watching");
                $(this).addClass("watching");
            });
        }
        else {
            tweetsEle.find(".tweet-" + _current).html('<img src="' +
                tweet.user.profile_image_url + '" />');
        }
        tweetsEle.find("a").removeClass("active");
        tweetsEle.find(".tweet-" + _current).addClass("active");
        _current++;
        _numTweets++;
        $(".numTweets").html(_numTweets);
        $(".numUsers").html(_users.length);
        if(_current > _maxTweets) {
            _current = 0;
            _reachedLimit = true;
        }
    }

    function showTweet(tweet) {
        $(".screen_name").html(tweet.user.screen_name);
        $(".link_account").attr("href", "http://twitter.com/" + tweet.user.screen_name);
        $(".text").html(tweet.text);
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