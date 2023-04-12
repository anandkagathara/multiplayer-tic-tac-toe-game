const Users = require("../models/Users");

const createUser = async (socket) => {
    console.log("function------------",socket);
  let addUser = new Users({
    // username: username,
    playersocketid: socket
    
  });
  addUser = await addUser.save();
  return addUser;
}

module.exports = createUser;
