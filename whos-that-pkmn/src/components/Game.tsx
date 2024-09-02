// Created by Sami Chamberlain
//Purpose: Logic for the 'Pokemon Wordle' demo. 

import React, { useEffect, useRef, useState } from 'react'
import Button from "./Button"

import "../../styles/Game.css"
import { BackendDataItem, normalizeString, censorPortionOfString } from '../utils'


interface Props {
  active: BackendDataItem;
  onGameOver: (win: boolean) => void;
}


const Game: React.FC<Props> = ({ active, onGameOver }) => {
  const [hintsLeft, setHintsLeft] = useState(5);
  const [currHint, setCurrHint] = useState(1);

  const hintRef = useRef<HTMLDivElement>(null);
  const responseRef = useRef<HTMLInputElement>(null);

  const pkmnImageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {

    if (!hintRef.current) return;

    switch (currHint) {
      //displays pokemon cry
      case 1:
        hintRef.current.innerHTML = "";
        hintRef.current.innerHTML += `<audio controls autoplay title='Pokemon Cry'><source src=${active.cry} type="audio/ogg"></audio>`
        break;
      //displays pokemon classification
      case 2:
        let audio = hintRef.current.querySelector("audio");
        if (audio) audio.autoplay = false; // makes it so the audio doesn't autoplay constantly.

        hintRef.current.innerHTML += `<p>The ${active.class}</p>`
        break;
      //shows the pokedex number of the pokemon
      case 3:
        hintRef.current.innerHTML += `<p>Pokedex Number: ${active.pokedexNum}</p>`
        break;
      //shwos the pokedex entry of the pokemon.
      case 4:
        hintRef.current.innerHTML += `<p>${censorPortionOfString(active.pokedexEntry, active.name)}</p>`
        break;

      //shows a blackened image of the pokemon
      case 5:
        hintRef.current.innerHTML += `<img src=${active.sprite} ref=${{ pkmnImageRef }} class='pkmn-img img-hidden'></img>`
        break;

      //reveals the full image of the pokemon.
      case 6:
        let pkmnImg = hintRef.current.querySelector(".pkmn-img");
        pkmnImg?.classList.remove('img-hidden');
        break;
      default:
        hintRef.current.innerHTML = '';
    }
    //change hint state based on hints num.

  }, [currHint]);

  return (
    <>
      <div className="panel" id="game">
        <div className="title">
          <h1 className="title-text">Guess that Pokemon</h1>
          <h2 id="hint-notif">Hint #{currHint}</h2>
        </div>



        <div id="hint-area">

          <div id="hint" ref={hintRef}>

          </div>
        </div>

        <div id="game-footer">
          <input name="pokemonInput" id="pokemonInput" maxLength={35} ref={responseRef}>
          </input>
          <div id="next-button">
            <Button link="" onclick={() => {
              if (responseRef.current) {

                let guess = normalizeString(responseRef.current.value.trim());

                let pkmnName = normalizeString(active.name.trim());

                if (guess === pkmnName) {
                  //win!
                  onGameOver(true);
                }
                else {
                  responseRef.current.value = "";
                  setCurrHint(currHint + 1);
                  setHintsLeft(hintsLeft - 1);

                  if (hintsLeft <= 0) {
                    //player did not win.
                    onGameOver(false);
                  }
                }
              }
            }}>&gt;</Button>
          </div>



          <p id="guesses">Hints Left: {hintsLeft}</p>
        </div>

      </div>
    </>
  )
}

export default Game