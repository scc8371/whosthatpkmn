const endpoint = "https://pokeapi.co/api/v2/";

const axios = require("axios");

async function getData(endpointString, fullstring = false) {

    try {
        const data = await makeRequest(endpointString, fullstring);
        return data;
    }
    catch (error) {
        console.log(error);
        throw new Error("Failed to fetch data for endpoint " + endpoint + "" + endpointString);
    }
}

async function makeRequest(endpointString, fullstring) {
    let url;

    switch (fullstring) {
        case true:
            url = endpointString;
            break;

        case false:
            url = endpoint + endpointString;
            break;
    }

    try {
        const response = await axios.get(url);
        return response.data;
    }
    catch(error){
        throw error;
    }
}

module.exports = { getData, makeRequest };