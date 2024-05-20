"use strict";

const axios = require('axios')


/** Related functions for Songs. */

class Explore {

/** There is a limit to this api at this point. In the future the UUID of the artist will be customizable */


static async getSimilarArtists(){
const options = {
    method: 'GET',
    url: `https:customer.api.soundcharts.com/api/v2/artist/11e81bcc-9c1c-ce38-b96b-a0369fe50396/related?offset=0&limit=5`,
    headers: {
    'x-app-id:': 'soundcharts',
    'x-api-key': 'soundcharts'
    }
};

console.log(options, "Options structre")

try {
	const response = await axios.request(options);
	return response
} catch (error) {
	console.error(error);

}

}

}
module.exports = Explore;