import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ProfileDataProvider } from './All-Provider/profileDataProvider.jsx';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <ProfileDataProvider>
    <App />
  </ProfileDataProvider>
  // </StrictMode>,
)
