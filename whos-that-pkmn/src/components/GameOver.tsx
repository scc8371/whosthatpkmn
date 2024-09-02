import React from 'react'
import { BackendDataItem } from '../utils';
import { normalizeString, capitalize } from '../utils';
import Button from './Button';

interface Props {
  won: boolean;
  active: BackendDataItem;
  onReturnMenu: () => void;
}

const GameOver: React.FC<Props> = ({ won, active, onReturnMenu }) => {

  const winText = won ? "Nice one!" : "Maybe next time...";
  const pkmnText = `The Pokemon was ${capitalize(normalizeString(active.name.trim()))}`;

  return (
    <>
      <div className="panel" id="game">
        <div className="title">

          <h1 className="title-text">{winText}</h1>
          <h1 className="subtitle-text">{pkmnText}</h1>
          <h2></h2>
        </div>

        <img src={active.sprite} className="pkmn-img"></img>

        <Button link='' onclick={onReturnMenu}>Return to Menu</Button>

      </div>
    </>

  )
}

export default GameOver