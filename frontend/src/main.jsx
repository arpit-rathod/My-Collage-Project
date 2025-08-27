import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ProfileDataProvider } from './All-Provider/profileDataProvider.jsx';
import { SocketConnectionPro } from './All-Provider/socketConnectionPro.jsx';

createRoot(document.getElementById('root')).render(
   // <StrictMode>
   <ProfileDataProvider>
      <SocketConnectionPro>
         <App />
      </SocketConnectionPro>
   </ProfileDataProvider>
   // </StrictMode>,
)
// import React, { StrictMode } from 'react' 
//   </ProfileDataProvider >
//   // </StrictMode>,
// )
