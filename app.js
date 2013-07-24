var fs = require("fs"),
	app = require("http").createServer(handler), // handler defined below
	io = require("socket.io").listen(app, { log: false }),
	theport = process.env.PORT || 2000,
	twitter = require("ntwitter");

app.listen(theport);
console.log ("http server on port: " + theport);

function handler (req, res) {
	fs.readFile(__dirname + "/index.html",
		function (err, data) {
			if (err) {
				res.writeHead(500);
				return res.end("Error loading index.html");
			}
			res.writeHead(200);
			res.end(data);
		});
}

var tw = new twitter({
		consumer_key: "YOUR_CONSUMER_KEY",
		consumer_secret: "YOUR_CONSUMER_SECRET",
		access_token_key: "USER_ACCESS_TOKEN",
		access_token_secret: "USER_ACCESS_TOKEN_SECRET"
	}),
	stream = null,
	track = "venezuela,simon bolivar",
	users = [];

io.sockets.on("connection", function(socket) {
	if(users.indexOf(socket.id) === -1) {
		users.push(socket.id);
	}
	logConnectedUsers();
	socket.on("start stream", function() {
		if(stream === null) {
			tw.stream("statuses/filter", {
				track: track
			}, function(s) {
				stream = s;
				stream.on("data", function(data) {
					// only broadcast when users are online
					if(users.length > 0) {
						socket.broadcast.emit("new tweet", data);
						socket.emit("new tweet", data);
					}
					else {
						stream.destroy();
						stream = null;
					}
				});
			});
		}
	});

	socket.on("disconnect", function(o) {
		var index = users.indexOf(socket.id);
		if(index != -1) {
			users.splice(index, 1);
		}
		logConnectedUsers();
	});

	socket.emit("connected", {
		tracking: track
	});
});

function logConnectedUsers() {
	console.log("============= CONNECTED USERS ==============");
	console.log("==  ::  " + users.length);
	console.log("============================================");
}