import { useEffect, useState, useTransition } from 'react'
import axios from 'axios'
import './App.css'
import Menu from "./components/Menu"
import Game from "./components/Game"
import GameOver from "./components/GameOver"
import { BackendDataItem, State } from './utils'

function App() {

  const [backendData, setBackendData] = useState<BackendDataItem[]>([]);
  const [state, setState] = useState<State>(State.MENU);

  const [isLoaded, setIsLoaded] = useState(false);

  const goToGame = () => setState(State.GAME);

  const goToMenu = () => {
    setState(State.MENU);
    setWon(false);
  }

  const onGameOver = (win: boolean) => {
    setState(State.OVER);
    setWon(win);
  }

  const [won, setWon] = useState(false);


  async function fetchPkmnInfo() {
    const res = await axios.get('http://3.21.156.202:5000/api', {
      headers: { "Content-Type": "application/json" }
    });
    setBackendData(res.data);
    setIsLoaded(true);
  }

  useEffect(() => {
    fetchPkmnInfo();

  }, []);

  return (
    <>
      {!isLoaded ?
        <p>Loading....</p>
        :
        <div>
          {state === State.MENU && <Menu onStart={goToGame}></Menu>}
          {state === State.GAME && <Game active={backendData[0]} onGameOver={onGameOver}></Game>}
          {state === State.OVER && <GameOver won={won} active={backendData[0]} onReturnMenu={goToMenu}></GameOver>}
        </div>
      }
    </>
  )
}

export default App
