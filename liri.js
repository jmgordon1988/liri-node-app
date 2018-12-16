require("dotenv").config();

var request = require("request");
var moment = require("moment")
var keys = require("./keys.js")
var fs = require("fs");
var Spotify = require("node-spotify-api");
var spotify = new Spotify({
    id: keys.spotify.id,
    secret: keys.spotify.secret
});

var search = process.argv[2];
var input = process.argv.slice(3).join("+");
var logInput = process.argv.slice(3).join(" ");


function appendInfo() {
    fs.appendFile("log.txt", search + ", " + logInput + '\r\n', function (error, data) {
        if (error) {
            console.log(error);
        } else {
            console.log("Content added to log.txt file");
            console.log("----------------------------------------")
        }
    })
};

console.log("----------------------------------------")

if (search === "concert-this") {
    concertThis(input);
    appendInfo();

} else if (search === "movie-this") {
    movieThis(input);
    appendInfo();

} else if (search === "spotify-this-song") {
    spotifyThis(input);
    appendInfo();

} else if (search === "do-what-it-says") {
    doWhatItSays();
}


function concertThis(band) {
    var concertURL = "https://rest.bandsintown.com/artists/" + input + "/events?app_id=codingbootcamp"
    request(concertURL, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            var bandArray = JSON.parse(body)
            bandArray.forEach(function (event) {
                console.log("Venue name: ", event.venue.name)
                console.log("Venue city: ", event.venue.city)
                console.log("Concert date: ", moment(event.datetime).format('l'))
                console.log("----------------------------------------")
            })
        }
    });
}
function movieThis(movie) {
    var movieUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&r=json&tomatoes=true&apikey=trilogy";
    request(movieUrl, function (error, response, body) {
        if (error) {
            return console.log("Something went wrong: " + error);
        }
        else if (!error && response.statusCode === 200) {
            var movie = JSON.parse(body);
            console.log("Movie Title: " + movie.Title);
            console.log("Year: " + JSON.parse(body).Year);
            console.log("IMDB rating: " + JSON.parse(body).imdbRating);
            for (var i = 0; i < movie.Ratings.length; i++) {
                if (movie.Ratings[i].Source === "Rotten Tomatoes") {
                    console.log("Rotten Tomatoes Rating: ", movie.Ratings[i].Value);
                    break;
                }}
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Language: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
            console.log("----------------------------------------")
        }
    })
}

function spotifyThis(song) {
    spotify.search({ type: "track", query: song, limit: 1 }, function (error, data) {
        if (error) {
            return console.log("Something went wrong: " + error);
        }

        var response = data.tracks.items;
        response.forEach(song => {
            console.log("Song Name: " + song.name),
                console.log("Artist Name: " + song.artists[0].name),
                console.log("Album Name: " + song.album.name),
                console.log("Link: " + song.href)
            console.log("----------------------------------------")
        })
    });
}
function doWhatItSays() {
    fs.readFile('random.txt', "utf8", function (error, data) {
        var txt = data.split(',');
        var input = txt[1];
        if (txt[0] === "spotify-this-song") {
            spotifyThis(input);
        }
        else if (txt[0] === "movie-this") {
            movieThis(input);
        }
        else {
            concertThis(input);
        }
    });
}
