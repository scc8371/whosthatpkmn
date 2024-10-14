import React, { useEffect, useMemo, useState } from 'react'

import "../../styles/Menu.css"
import Button from "./Button"

import { convertMsToTime } from '../utils'
import axios from 'axios'

interface Props {
  onStart: () => void
}




const Menu: React.FC<Props> = ({ onStart }) => {
  const [time, setTime] = useState(0.0)

  async function fetchTimeInfo() {
    const res = await axios.get('https://games.samichamberlain.com/pokemon-wordle/time', {
      headers: { "Content-Type": "application/json" }
    });

    setTime(Math.floor(res.data));
  }

  useEffect(() => {
    fetchTimeInfo();
  }, []);

  //memoize the interval function so it only updates once
  //at the beginning of the render.
  useMemo(() => {
    setInterval(() => {
      setTime(prevTime => Math.max(prevTime - 1000, 0));
    }, 1000);
  }, [])


  return (
    <>
      <div className="panel" id="menu">
        <div className="title">
          <h1 className="title-text">Pokemon Wordle Prototype</h1>
          <h2 className="title-subtext">Created by Sami Chamberlain</h2>
        </div>

        <Button link="" onclick={() => { onStart(); }}>Start</Button>
        <h3 className='menu-footer'>Time to next Pokemon: {convertMsToTime(time)}</h3>
      </div>

    </>

  )
}

export default Menu