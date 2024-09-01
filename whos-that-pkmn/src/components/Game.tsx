import React, { useEffect, useRef, useState } from 'react'
import Button from "./Button"

import "../../styles/Game.css"
import { BackendDataItem } from '../utils'


interface Props {
  active: BackendDataItem;
}


const Game: React.FC<Props> = ({ active }) => {
  const [hintsLeft, setHintsLeft] = useState(5);
  const [currHint, setCurrHint] = useState(1);

  const hintRef = useRef<HTMLDivElement>(null);
  const responseRef = useRef<HTMLInputElement>(null);

  const pkmnImageRef = useRef<HTMLImageElement>(null);

  function normalizeString(str: string) {
    return str
      .toLowerCase() // Convert to lower case
      .replace(/[-_\s]+/g, ''); // Remove hyphens, underscores, and spaces
  }

  function censorPortionOfString(text: string, censorRegex: string){
    let regex = new RegExp(censorRegex, 'gi');

    return text.replace(regex, '[REDACTED]');
  }

  useEffect(() => {

    if (!hintRef.current) return;

    switch (currHint) {
      case 1:
        hintRef.current.innerHTML = "";
        hintRef.current.innerHTML += `<audio controls autoplay title='Pokemon Cry'><source src=${active.cry} type="audio/ogg"></audio>`
        break;
      case 2:
        let audio = hintRef.current.querySelector("audio");
        if(audio) audio.autoplay = false;

        hintRef.current.innerHTML += `<p>The ${active.class}</p>`
      break;
      case 3:
        hintRef.current.innerHTML += `<p>Pokedex Number: ${active.pokedexNum}</p>`
      break;
      case 4:
        hintRef.current.innerHTML += censorPortionOfString(active.pokedexEntry, active.name);
      break;
      case 5:
        hintRef.current.innerHTML += `<img src=${active.sprite} ref=${{pkmnImageRef}} class='pkmn-img img-hidden'></img>`
      break;
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
                    
                }
                else {
                  responseRef.current.value = "";
                  setCurrHint(currHint + 1);
                  setHintsLeft(hintsLeft - 1);

                  if(hintsLeft <= 0){
                    //player did not win.
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