"use strict"

const createRouter = require("@arangodb/foxx/router");
const db = require("@arangodb").db;

const pkmn = db._collection("pkmn");
const router = createRouter();

module.context.use(router);

router.get("/pkmn", (req, res) => {
    try{
        res.send(pkmn.all());
    }
    catch(e){
        res.send(e.toString());
    }
});