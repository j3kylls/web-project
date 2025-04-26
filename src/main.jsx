// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

import { Provider } from 'react-redux'
import { store } from './redux/store'
import { login } from './redux/authSlice'

const token = localStorage.getItem('token')
const user = JSON.parse(localStorage.getItem('user'))

if (token && user) {
  store.dispatch(login({ token, user }))
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
)
