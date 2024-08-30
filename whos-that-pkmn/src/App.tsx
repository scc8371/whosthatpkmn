import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

interface BackendDataItem{
  name: string
}

function App() {

  const [backendData, setBackendData] = useState<BackendDataItem[]>([]);

  async function fetch() {
    const res = await axios.get('http://localhost:5000/api', {
      headers: { "Content-Type": "application/json" }
    });
    setBackendData(res.data);
  }

  useEffect(() => {
    fetch();
  }, []);

  return (
    <>
      <div>
        {
          backendData.length === 0 ? (
            <p>Loading...</p>
          ) : (
            backendData.map((item, index) => (
              <div key={index}>
                <h2>{item.name}</h2>
              </div>
            ))
          )}
      </div>
    </>
  )
}

export default App
