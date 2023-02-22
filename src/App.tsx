import { useState } from 'react'
import './App.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import RouterPage from './router/RouterPage';
function App() {

  return (
    <div className="App">
      {/* 路由 */}
      <RouterPage/>
    </div>
  )
}

export default App
