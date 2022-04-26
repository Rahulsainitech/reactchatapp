import React from 'react';
import {Routes,Route} from 'react-router-dom';
import Chat from './components/Chat';
import Home from './components/Home';
import './App.css'


const App = () => {
  return (
    <div className="app">
    <Routes >
      <Route exact path='/' element={  <Home />}/>
      <Route exact path='/chat' element={ <Chat />}/>
    </Routes>
    </div>
  )
}

export default App
