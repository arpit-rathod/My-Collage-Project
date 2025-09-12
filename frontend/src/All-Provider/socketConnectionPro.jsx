import React from 'react'
import Cookies from 'js-cookie';
import io from 'socket.io-client'
import { useEffect } from 'react';
import toast from 'react-hot-toast';
console.log(Cookies.get('auth_token'));

// const socket = io(import.meta.env.VITE_API_URL, {
//      auth: { authToken: Cookies.get('auth_token') }
// })
const socket = io(import.meta.env.VITE_API_URL, {
     withCredentials: true
})
export const SocketContext = React.createContext();

export function SocketConnectionPro(props) {
     useEffect(() => {
          socket.on('conect', () => {
               console.log("Connected with id:", socket.id);
               //add token to socket
          })
          socket.on('joinedRooms', (roomIds) => {
               console.log(`Joined rooms: ${roomIds}`);
               // alert(`Joined rooms: ${roomIds}`);
          });
          socket.on('attendance-marked', (data) => {
               console.log(`Joined rooms: ${roomIds}`);
               // alert(`Joined rooms: ${roomIds}`);
               toast.error("Marked for subject code ", data.subCode)
          });


     }, []);
     return (
          <>
               <SocketContext.Provider value={socket}>
                    {props.children}
               </SocketContext.Provider>
          </>
     )
}
