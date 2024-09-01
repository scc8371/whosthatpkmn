import React from 'react'

import "../../styles/Menu.css"
import Button from "./Button"

interface Props {
  onStart:() => void
}

const Menu : React.FC<Props> = ({ onStart }) => {
  return (
    <>
      <div className="panel" id="menu">
        <div className="title">
          <h1 className="title-text">Pokemon Wordle Prototype</h1>
          <h2 className="title-subtext">Created by Sami Chamberlain</h2>
        </div>

        <Button link="" onclick={() => { onStart(); }}>Start</Button>
        <h3 className='menu-footer'>Time to next Game: XX:XX</h3>
      </div>

    </>

  )
}

export default Menu