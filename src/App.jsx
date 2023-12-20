import './App.css'
import Login from './components/login'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Scan from './components/scan'
import { useEffect, useState } from 'react';
//import QRCodeScanner from './components/QRCodeScanner'

function App() {

  const [firstTimeUser,setFirstTimeUser] = useState(false);
  const updateState = (state) =>{
    setFirstTimeUser(state)
  }
  useEffect(()=>{
    const user = localStorage.getItem('user');
    if(user){
      updateState(true);
    }
  })
  
  return (
    <div className="App">
      {
        firstTimeUser ? <Scan updateState={updateState}/> : <Login updateState={updateState}/>
      }
    </div>
  );
}
export default App
