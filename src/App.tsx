import { useState } from 'react'
import './App.css'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import RouterPage from './router/RouterPage';
import { Provider } from 'react-redux';
import store from './store';
function App() {

  return (
    <Provider store={store}>
      <div className="App">
        {/* 路由 */}
        <RouterPage />
      </div>
    </Provider>
  )
}

export default App
