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
    fs.appendFileSync("log.txt",'\n' + ' ' + '\n' + cmd + ' ' + val.replace(/\+/g, ' '));

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

const writeArrToTxtFile = (arr) => {
    arr.forEach(el => {
        fs.appendFileSync("log.txt", '\n' + el);
    });
};

const logArrToConsole = (arr) => {
    arr.forEach(el => {
        console.log(el);
    });
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
            fs.appendFileSync("log.txt", '\n' + 'No results found');
        } else {
            for (let i = 0; i < 5; i++) {
                const el = response.data[i];
                if (el) {
                    const concertInfoArr = [
                        '--------------------------',
                        `Venue Name: ${el.venue.name}`
                    ];
                    if (el.venue.region) {
                        concertInfoArr.push(`Location: ${el.venue.city} ${el.venue.region}, ${el.venue.country}`);
                    } else {
                        concertInfoArr.push(`Location: ${el.venue.city}, ${el.venue.country}`);
                    }
                    const date = moment(el.datetime);
                    concertInfoArr.push(`Date: ${date.format("MM/DD/YYYY")}`);
                    
                    logArrToConsole(concertInfoArr);
                    writeArrToTxtFile(concertInfoArr);
                }
            }
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
        const movieInfoArr = [
            '--------------------------',
            'Title: ' + response.data.Title,
            'Release Year: ' + response.data.Year,
            'IMDB Rating: ' + response.data.Ratings[0].Value,
            'Rotten Tomatoes Rating: ' + response.data.Ratings[1].Value,
            'Country: ' + response.data.Country,
            'Language: ' + response.data.Language,
            'Starring: ' + response.data.Actors,
            'Plot: ' + response.data.Plot
        ];
        logArrToConsole(movieInfoArr);
        writeArrToTxtFile(movieInfoArr);
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

            const songInfoArr = [
                '--------------------------',
                'Artist(s): ' + artist,
                'Title: ' + item.name,
                'Album: ' + item.album.name
            ];
            if (item.preview_url) {
                songInfoArr.push('Sample: ' + item.preview_url);
            } else {
                songInfoArr.push('Sample not available');
            }

            logArrToConsole(songInfoArr);
            writeArrToTxtFile(songInfoArr);
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