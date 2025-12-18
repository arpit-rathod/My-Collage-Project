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
// src /
//  ├── pages /
//  │    ├── student /
//  │    │     ├── Dashboard.jsx
//  │    │     ├── Attendance.jsx
//  │    │     └── Results.jsx
//  │    ├── teacher /
//  │    │     ├── Dashboard.jsx
//  │    │     ├── ClassList.jsx
//  │    │     └── Performance.jsx
//  │    ├── admin /
//  │    │     ├── Dashboard.jsx
//  │    │     ├── ManageUsers.jsx
//  │    │     └── Reports.jsx
//  │    └── principal /
//  │          ├── Dashboard.jsx
//  │          ├── Analytics.jsx
//  │          └── Approvals.jsx
//  ├── components /
//  ├── routes /
//  │    ├── ProtectedRoutes.jsx
//  │    └── RoleBasedRoutes.jsx
//  └── context /
//       └── AuthContext.jsx
