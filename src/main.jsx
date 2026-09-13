import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { FavoritesProvider } from './context/FavoritesContext.jsx'
import { MatchQuizProvider } from './context/MatchQuizContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <FavoritesProvider>
        <MatchQuizProvider>
          <App />
        </MatchQuizProvider>
      </FavoritesProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
