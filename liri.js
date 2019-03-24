require("dotenv").config();
const axios = require('axios');
const moment = require('moment');
const keys = require("./keys.js");
//const spotify = new Spotify(keys.spotify);

const command = process.argv[2];
const value = process.argv[3];

const concertThis = () => {
    var artist = process.argv.slice(3).join('+');
    const queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";
    console.log(queryUrl);
    axios.get(queryUrl).then(response => console.log(response.data.forEach(el => {
        console.log('--------------------------');
        console.log(`Venue Name: ${el.venue.name}`);
        console.log(`Location: ${el.venue.city} ${el.venue.region}, ${el.venue.country}`);
        
        let date = moment(el.datetime);
        console.log(`Date: ${date.format("MM/DD/YYYY")}`);
    })));
};

switch (command) {
    case 'concert-this':
        concertThis();
        break;

    case 'spotify-this-song':
        break;

    case 'movie-this':

        break;
    
    case 'do-what-it-says':

        break;
    default:
        break;
}