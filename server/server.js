require('dotenv').config();

const express = require('express');
const { Database, aql } = require('arangojs');
const { schedule, scheduleJob, RecurrenceRule } = require("node-schedule");
const { PokeAPI } = require("./pokeapi/pokeAPI.js");

const app = express();

const pkmnAPI = new PokeAPI();

async function getActivePokemon() {
    const db = await new Database({
        url: process.env.ARANGO_URL,
        databaseName: process.env.ARANGO_DB,
        auth: { username: process.env.ARANGO_USER, password: process.env.ARANGO_PASS }
    });


    try {
        const cursor = await db.query(aql`for p in pkmn 
                                        filter p.date == ${getDate()}
                                        return p`);
        let entries = cursor.all();
        return entries;

    }
    catch (error) {
        console.error("Error getting collections from pokemon database! : ", error);
    }

}

async function updatePkmnOfDay() {

    const db = await new Database({
        url: process.env.ARANGO_URL,
        databaseName: process.env.ARANGO_DB,
        auth: { username: process.env.ARANGO_USER, password: process.env.ARANGO_PASS }
    });


    try {
        let pokemon = (await pkmnAPI.generatePokemon(1)).at(0);

        await db.query(aql`
            insert {
                pokedexNum: ${pokemon.pokedex_num},
                name: ${pokemon.name},
                height: ${pokemon.physical.height},
                weight: ${pokemon.physical.weight},
                class: ${pokemon.special_questions.classification},
                cry: ${pokemon.cry},
                sprite: ${pokemon.image},
                types: ${pokemon.general.types},
                pokedexEntry: ${pokemon.special_questions.pokedex_info},
                date: ${getDate()}   
            } into pkmn
            `).then(console.log(`[SERVER] updating pokemon of the day to ${pokemon.name}!`));
    }
    catch (error) {
        console.error("Error updating pokemon of the day! : ", error);
    }
}



app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-Width, Content-Type, Accept");
    next();
});

let pkmnData = undefined;
app.get("/api", (req, res) => {
    //gets pokemon data from arangoDB, logs it.
    getActivePokemon().then(dat => {
        pkmnData = dat;
        res.json(pkmnData);
    });
});

app.get("/audio/:id", (req, res) => {

});

app.listen(process.env.PORT, () => {

    console.log(`SERVER STARTED ON PORT ${process.env.PORT}`)
});

const rule = new RecurrenceRule();
rule.minute = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
rule.tz = "America/New_York";

scheduleJob(rule, async () => {
    if(await pokemonOfDayExists() == false) updatePkmnOfDay();
});

function getDate(){
    return new Date().toLocaleDateString("en-US", { timeZone: "America/New_York" });
}

async function pokemonOfDayExists(){
    let pkmnList = await getActivePokemon();
    return pkmnList.length > 0;
}

