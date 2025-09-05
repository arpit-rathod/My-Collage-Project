let userSockets = {};

// function to store socket id for a user id;

const addUserSocket = async (userId, socketId) => {
     console.log("add user socket run => ", userSockets[userId]);
     if (!userSockets[userId]) {
          userSockets[userId] = [];
     }
     userSockets[userId].push(socketId)
     console.log("all socket id of user => ", userSockets[userId]);

}

const removeUserSocket = async (userId, socketId) => {
     console.log("remove User Socket run")
     if (userSockets[userId]) {
          userSockets[userId] = userSockets[userId].filter((id) => id != socketId);
          if (userSockets[userId].length === 0) {
               delete userSockets[userId];
          }
     }
}

const getUserSockets = async (userId) => {
     console.log(userId, " get user sockets run => ", userSockets[userId]);

     return userSockets[userId] || [];
}

export { addUserSocket, removeUserSocket, getUserSockets };
