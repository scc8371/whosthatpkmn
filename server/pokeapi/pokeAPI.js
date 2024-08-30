const { getData, makeRequest } = require("./apiReader.js")

class PokeAPI {
    numTotalPokemon = 0;
    pokemonData = null;

    async getTotalPokemon() {
        let all = await getData("pokedex/national");
        this.numTotalPokemon = all.pokemon_entries.length;
    }

    async generatePokemon(numPokemon, genTrouble = false) {

        if (this.numTotalPokemon == 0) {
            await this.getTotalPokemon();
        }

        let pokemonData = [];
        this.pokemonData = pokemonData;
        let uniqueNums = new Set();

        while (pokemonData.length < numPokemon) {
            let rand = Math.floor(Math.random() * this.numTotalPokemon) + 1;
            if (!uniqueNums.has(rand)) {
                uniqueNums.add(rand);
                let newData = { pokedex_num: rand };
                pokemonData.push(newData);
            }
        }

        for (let data of pokemonData) {
            data.special_questions = [];
            data.physical = [];
            data.evo = [];
            data.general = [];
        }

        const promises = pokemonData.map(data => this.processPokemonData(data, pokemonData));

        await Promise.all(promises);

        return pokemonData;
    }

    async processPokemonData(data, pokemonData) {
        let speciesData = await getData("pokemon-species/" + data.pokedex_num);
        let generalPokemonInfo = await getData("pokemon/" + data.pokedex_num);

        data.evo.has_mega = false;
        if (speciesData.varieties.length > 1) {
            speciesData.varieties.forEach(variant => {
                if (variant.pokemon.name.includes("mega")) data.evo.has_mega = true;
            });
        }

        data.name = speciesData.name;
        data.evo.variant = '';
        data.stats = generalPokemonInfo.stats.map(stat => stat = stat.base_stat);

        data.cry = generalPokemonInfo.cries.latest;

        let regionalData;

        let genSuccess = false;

        if (speciesData.varieties.length > 1) {
            let rand = Math.floor(Math.random() * speciesData.varieties.length);
            if (rand > 0) {
                regionalData = await getData(speciesData.varieties[rand].pokemon.url, true);
                if (this.getPokemonImage(data, regionalData)) {
                    genSuccess = true;
                    generalPokemonInfo = regionalData;
                    data.evo.variant = regionalData.name.substring(regionalData.name.lastIndexOf("-") + 1, regionalData.name.length)
                    data.evo.variant = data.evo.variant.charAt(0).toUpperCase() + data.evo.variant.substring(1);
                }
                else {
                    genSuccess = this.getPokemonImage(data, generalPokemonInfo);
                }
            }
            else {
                genSuccess = this.getPokemonImage(data, generalPokemonInfo);
            }
        }
        else {
            genSuccess = this.getPokemonImage(data, generalPokemonInfo);
        }

        if (!genSuccess) {

            let pokedexNum = Math.floor(Math.random() * this.numTotalPokemon) + 1;
            while (pokemonData.filter(pokemon => pokemon.pokedex_num == pokedexNum).length > 0) {
                pokedexNum = Math.floor(Math.random() * this.numTotalPokemon) + 1;
            }

            data.pokedex_num = pokedexNum;
            await this.processPokemonData(data, pokemonData);
            return;
        }

        let filter = speciesData.genera.filter(dat => dat.language.name == 'en');
        data.special_questions.classification = filter.length > 0 ? filter[0].genus : "No classification was found for this Pokémon";

        //abilities
        data.general.abilities = generalPokemonInfo.abilities;
        if (data.general.abilities.length > 0) data.general.abilities = data.general.abilities.map(p => p = p.ability.name);

        //colors:
        //await this.getPokemonColors(data);

        //egg groups
        data.general.egg_groups = speciesData.egg_groups;
        if (data.general.egg_groups.length > 0) data.general.egg_groups = data.general.egg_groups.map(p => p = p.name);

        if (speciesData.shape != null) data.physical.shape = speciesData.shape.name;
        else data.physical.shape = "No discernable shape.";

        //held items
        data.general.held_items = generalPokemonInfo.held_items;

        if (data.general.held_items.length > 0) data.general.held_items = data.general.held_items.map(p => p = p.item.name);
        else data.general.held_items.push("No held items.");

        data.physical.weight = (generalPokemonInfo.weight / 4.536).toFixed(2) + " lbs";
        let feetConversion = generalPokemonInfo.height / 3.048;
        let roundedFeet = Math.floor(feetConversion);
        let roundedInches =  Math.round((feetConversion - roundedFeet) * 12);
        
        if(roundedInches == 12){
            roundedInches = 0;
            roundedFeet++;
        }

        data.physical.height = roundedFeet + "ft " + roundedInches + "in";

        //generation
        data.special_questions.generation = await getData(speciesData.generation.url, true);
        data.special_questions.generation = data.special_questions.generation.id;

        //elemental typings
        data.general.types = generalPokemonInfo.types;

        for (let i = 0; i < data.general.types.length; i++) {
            data.general.types[i] = data.general.types[i].type.name;
        }

        //legendary/mythical data
        data.evo.is_legendary = speciesData.is_legendary;
        data.evo.is_mythical = speciesData.is_mythical;
        data.evo.is_baby = speciesData.is_baby;

        //pokedex entry
        filter = speciesData.flavor_text_entries.filter(dat => dat.language.name == 'en');
        data.special_questions.pokedex_info = filter.length > 0 ? filter[filter.length - 1].flavor_text : "No Pokédex Entry for this Pokémon found.";

        //stage of evolution
        let evoData = await getData(speciesData.evolution_chain.url, true);
        evoData = evoData.chain;

        let evoChain = await this.formatEvolutionData(evoData, data);
        evoChain = evoChain.split('|');
        data.evo.evolution_chain = evoChain;


        switch (evoChain.length) {
            case 1:
                data.evo.stage_of_evolution = "Only";
                break;
            case 2:
                if (evoChain[0] == data.name) data.evo.stage_of_evolution = "First";
                else data.evo.stage_of_evolution = "Last";
                break;

            case 3:
                if (evoChain[0] == data.name) data.evo.stage_of_evolution = "First";
                else if (evoChain[1] == data.name) data.evo.stage_of_evolution = "Middle";
                else data.evo.stage_of_evolution = "Last";
                break;
        }

        data.name = data.name[0].toUpperCase() + data.name.slice(1);
        data.name = data.name.replace(/\-[a-z]/g, match => match.toUpperCase());
    }

    //formats evolution data from first evolution to last evolution.
    async formatEvolutionData(chain, jsonData) {
        let evoChain = [];

        if (chain && chain.species && chain.species.name) {
            evoChain.push(chain.species.name);

            let data = await this.getSpeciesData(chain.species.url);

            data.varieties.forEach(variety => {
                if (variety.pokemon.name.includes("mega")) {
                    jsonData.evo.has_mega = true;
                }
            });


            if (chain.evolves_to && chain.evolves_to.length > 0) {
                //single evolution branch
                let activeChain = chain.evolves_to[0];

                if (chain.evolves_to.length > 1) {
                    let firstEvo = chain.evolves_to[0].species.name;



                    let foundMatch = false;

                    chain.evolves_to.forEach(pkmn => {
                        if (pkmn.species.name == jsonData.name) {
                            foundMatch = true;
                            activeChain = pkmn;
                        }
                    });


                    if (!foundMatch) {
                        chain.evolves_to[0].species.name = "";
                        for (let i = 0; i < chain.evolves_to.length; i++) {
                            let nameConcat = chain.evolves_to[i].species.name;
                            if (i == 0) nameConcat = firstEvo;

                            chain.evolves_to[0].species.name += this.capitalizeName(nameConcat);
                            if (i < chain.evolves_to.length - 1) {
                                chain.evolves_to[0].species.name += " / ";
                            }
                        }
                    }
                }
                evoChain.push(`${await this.formatEvolutionData(activeChain, jsonData)}`);
            }
        }
        return evoChain.join('|');
    }

    capitalizeName(name) {
        let firstLetter = name.charAt(0).toUpperCase();
        let restOfName = name.slice(1);

        return firstLetter + restOfName;
    }

    async getSpeciesData(url) {
        let data = await getData(url, true);
        return data;
    }

    getPokemonImage(dataList, pokemonData) {
        if (pokemonData.sprites.front_default) {
            dataList.pixel_sprite = pokemonData.sprites.front_default;
        }
        if (pokemonData.sprites.other["official-artwork"].front_default) {
            dataList.image = pokemonData.sprites.other["official-artwork"].front_default;
            return true;
        }
        else if (pokemonData.sprites.front_default) {
            dataList.image = pokemonData.sprites.front_default;
            return true;
        }

        return false;
    }


};

module.exports = { PokeAPI };