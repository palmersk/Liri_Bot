// js to make the app work

let apiCommand = process.argv[2]

// Input for API call
let nodeArgs = process.argv;

// Empty String searchTerm to use for searching with the API
let searchTerm = ""

// bringing in the key object from keys.js as a immutable constant since they cannot be changed
const keys = require("./keys.js")

// constant for fs since it will be used in several functions
const fs = require("fs");

// Loop to capture all the terms after the process.argv[3] and making them the term to be searched
for (let i = 3; i < nodeArgs.length; i++) {

    if (i > 3 && i < nodeArgs.length) {

        searchTerm = searchTerm + "+" + nodeArgs[i];

    } else {

        searchTerm += nodeArgs[i];

    }
}

const liriBot = {
    // Search function for Twitter

    latestTweets: () => {

        const Twitter = require("twitter")

        let twitter = new Twitter({
                consumer_key: keys.twitter.consumer_key,
                consumer_secret: keys.twitter.consumer_secret,
                access_token_key: keys.twitter.access_token_key,
                access_token_secret: keys.twitter.access_token_secret
            })
            // search paramaters
        let params = {
            screen_name: "MVPuzzled",
            count: 20,
            exclude_replies: true,
            tweet_mode: "extended"
        }
        twitter.get("statuses/user_timeline", params, function(error, tweets, response) {
            if (!error) {
                console.log(error)
            }

            // loop through tweets for the log
            for (var i = 1; i < tweets.length; i++) {
                let twitterLog = (
                        "\n* * * * * * * * * * * * * * * * * * " +
                        "\n" +
                        "\nTweeted on: " + tweets[i].created_at +
                        "\nTweet: " + tweets[i].full_text
                    )
                    // print twitterLog to the screen
                console.log(twitterLog)
                    // write twitterLog to the log file
                liriBot.writeToLog(twitterLog)
            }
        });

    },

    // Search function for Spotify

    spotifySearch: () => {
        const Spotify = require("node-spotify-api")

        let spotify = new Spotify({
            id: keys.spotify.id,
            secret: keys.spotify.secret
        })

        // if now song is given to search for search for The Sign by Ace of Base
        if (searchTerm === "") {
            searchTerm = "Queen Fat Bottomed Girls"
        }

        spotify.search({ type: "track", query: searchTerm, limit: 1 }, function(err, data) {
            if (err) {
                return console.log("Error occurred: " + err);
            }
            let track = data.tracks.items
                //console.log(track);
            for (let i = 0; i < track.length; i++) {
                let songLog = (
                        "\n* * * * * * * * * * * * * * * * * * " +
                        "\n" +
                        "\nArtists: " + track[i].artists[0].name +
                        "\nSong: " + track[i].name +
                        "\nSong Link: " + track[i].external_urls.spotify +
                        "\nAlbum: " + track[i].album.name +
                        "\n" +
                        "\n* * * * * * * * * * * * * * * * * * " +
                        "\n"
                    )
                    // print songLog to the screen
                console.log(songLog)
                    // write songLog results to log file
                liriBot.writeToLog(songLog)
            }
        });

    },

    // Search function for OMDB request

    movieSearch: () => {
        const request = require("request")

        // if no movie is given to search for search for Nothing
        if (searchTerm === "") {
            searchTerm = "Nothing"
        }

        let queryUrl = "http://www.omdbapi.com/?t=" + searchTerm + "&y=&plot=short&apikey=" + keys.omdb.apikey

        //console.log(queryUrl);

        request(queryUrl, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                //console.log(JSON.parse(body))
                let json = JSON.parse(body)
                let movieLog = (
                        "\n* * * * * * * * * * * * * * * * * * " +
                        "\n" +
                        "\nTitle: " + json.Title +
                        "\nYear Released: " + json.Year +
                        "\nIMDB Rating: " + json.imdbRating +
                        "\nRotten Tomatoes Rating: " + json.Ratings[1].Value +
                        "\nCountry: " + json.Country +
                        "\nLanguage: " + json.Language +
                        "\n" +
                        "\n* * * * * * * * * * * * * * * * * * " +
                        "\n"
                    )
                    // print movieLog to the screen
                console.log(movieLog)
                    // write movieLog results to log file
                liriBot.writeToLog(movieLog)

            }

        })

    },

    // Search function for random search

    randomSearch: () => {

        fs.readFile("random.txt", "utf8", function(error, random) {
            if (error) {
                return console.log(error);
            }

            // We will then print the contents of data
            //console.log(random);

            var randomArray = random.split(",");

            apiCommand = randomArray[0]
            searchTerm = randomArray[1]
            liriBot.spotifySearch()

        })
    },
}

// Switch Statement to switch between various search triggers
switch (apiCommand) {

    case "my-tweets":
        liriBot.latestTweets()
        break

    case "spotify-this-song":
        liriBot.spotifySearch()
        break

    case "movie-this":
        liriBot.movieSearch()
        break

    case "do-what-it-says":
        liriBot.randomSearch()
        break
}