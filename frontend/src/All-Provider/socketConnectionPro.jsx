import React from 'react'
import Cookies from 'js-cookie';
import io from 'socket.io-client'
console.log(Cookies.get('auth_token'));

const socket = io(import.meta.env.VITE_API_URL, {
     auth: { authToken: Cookies.get('auth_token') }
})
export const SocketContext = React.createContext();

export function SocketConnectionPro(props) {
     socket.on('conect', () => {
          console.log("Connected with id:", socket.id);
          //add token to socket
     })
     socket.on('joinedRooms', (roomIds) => {
          console.log(`Joined rooms: ${roomIds}`);
          alert(`Joined rooms: ${roomIds}`);
     });
     return (
          <>
               <SocketContext.Provider value={socket}>
                    {props.children}
               </SocketContext.Provider>
          </>
     )
}
