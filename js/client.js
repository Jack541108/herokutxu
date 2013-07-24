var _socket = null,
	maxTweets = 1000,
	current = 0,
	reachedLimit = false,
	tweetList = [];
$(function() {
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
});

function newTweet(tweet) {
	tweetList[current] = tweet;

	var tweetsEle = $(".tweets"),
		elementHtml = '<a class="tweet-' + current +
			'" href="javascript:void(0)" rel="' + current + '"><img src="' +
			tweet.user.profile_image_url + '" /></a>';
	if(!reachedLimit) {
		tweetsEle.append(elementHtml);
		var tweetbox = $(".tweet-" + current);
		tweetbox.not(".active").not(".watching").hover(function(){
			$(this).find("img").stop().animate({ opacity: 1 }, 300);
		}, function(){
			$(this).find("img").stop().animate({ opacity: 0.4 }, 300);
		});
		tweetbox.on("click", function() {
			showTweet(tweetList[$(this).attr("rel")]);
			tweetsEle.find("a").removeClass("watching");
			$(this).addClass("watching");
		});
	}
	else {
		tweetsEle.find(".tweet-" + current).html('<img src="' +
			tweet.user.profile_image_url + '" />');
	}
	tweetsEle.find("a").removeClass("active");
	tweetsEle.find(".tweet-" + current).addClass("active");
	current++;
	if(current > maxTweets) {
		current = 0;
		reachedLimit = true;
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
