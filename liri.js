require('dotenv').config();
const keys = require('./keys.js');
const axios = require('axios');
const moment = require('moment');
const fs = require('fs');
const Spotify = require('node-spotify-api');
const spotify = new Spotify(keys.spotify);

// VARIABLES
const command = process.argv[2];
const value = process.argv.slice(3).join('+');

// FUNCTIONS
const controlPanel = (cmd, val) => {

    switch (cmd) {
        case 'concert-this':
            concertThis(val);
            break;
    
        case 'movie-this':
            movieThis(val);
            break;

        case 'spotify-this-song':
            spotifySong(val);
            break;
     
        case 'do-what-it-says':
            doWhatItSays();
            break;
        default:
            console.log('That is not a recognized command.');
            break;
    }
};

const axiosCall = (queryUrl, callback) => {
    axios.get(queryUrl).then(callback).catch(error => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an object that comes back with details pertaining to the error that occurred.
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
    });
};

const concertThis = (artist) => {
    
    const bandsUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    const parseConcertResponse = (response) => {

        if (!response.data.length) {
            console.log('No results found');
        } else {
            response.data.forEach(el => {

                if (el) {
                    console.log('--------------------------');
                    console.log(`Venue Name: ${el.venue.name}`);
                    if (el.venue.region) {
                        console.log(`Location: ${el.venue.city} ${el.venue.region}, ${el.venue.country}`);
                    } else {
                        console.log(`Location: ${el.venue.city}, ${el.venue.country}`);
                    }
                    
                    
                    let date = moment(el.datetime);
                    console.log(`Date: ${date.format("MM/DD/YYYY")}`);
                }
            });
        }
    };

    axiosCall(bandsUrl, parseConcertResponse);
};

const movieThis = (movie) => {
    if (!movie) {
        movie = 'Mr. Nobody';
    }
    
    const movieUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";
    
    const parseMovieResponse = (response) => {
        console.log('--------------------------');
        console.log('Title:', response.data.Title);
        console.log('Release Year:', response.data.Year);
        console.log('IMDB Rating:', response.data.Ratings[0].Value);
        console.log('Rotten Tomatoes Rating:', response.data.Ratings[1].Value);
        console.log('Country:', response.data.Country);
        console.log('Language:', response.data.Language);
        console.log('Starring:', response.data.Actors);
        console.log('Plot:', response.data.Plot);
    };

    axiosCall(movieUrl, parseMovieResponse);
};

const spotifySong = (song) => {
    if (!song) {
            song = 'the sign ace of base';
    }

    spotify.search({ type: 'track', query: song, limit: 5 }, function(err, res) {
        if (err) {
          return console.log('Error occurred: ' + err);
        }

        const results = res.tracks.items;
        for (const item of results) {
            const artistInfo = item.album.artists;
            let artist;
            if (artistInfo.length > 1) {
                const artistArr = item.album.artists.map(el => el.name);
                artist = artistArr.join(', ');
            } else {
                artist = artistInfo[0].name;
            }
        
            console.log('--------------------------');
            console.log('Artist(s):', artist);
            console.log('Title:', item.name);
            console.log('Album:', item.album.name);
            if (item.preview_url) {
                console.log('Sample:', item.preview_url);
            } else {
                console.log('Sample not available');
            }
        }
    });
};

const doWhatItSays = () => {
    fs.readFile('random.txt', 'utf8', (err, data) => {
        if (err) throw err;

        const dataArr = data.split(",");
        controlPanel(...dataArr);
        
    });
};




// MAIN PROCESS
controlPanel(command, value);