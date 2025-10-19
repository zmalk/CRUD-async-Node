// const userDB = {
//   user: require("../model/user.json"),
//   setUser: function (data) {
//     this.user = data;
//   },
// };

// const fsP = require("fs").promises;
// const path = require("path");
// const bcrypt = require("bcrypt");

// const handleNewUser = async (req, res) => {
//   const { user, pwd } = req.body;
//   if (!user || !pwd)
//     return res
//       .status(400)
//       .json({ message: "Username and password are required." });
//   //check for duplicate usernames in the db
//   const duplicate = userDB.user.find((person) => person.username === user);
//   if (duplicate) return res.sendStatus(409); //conflict
//   try {
//     //encrypt the password
//     const hashedPwd = await bcrypt.hash(pwd, 10);
//     //store the new user
//     const newUser = {
//       username: user,
//       roles: {
//         User: 2001,
//       },
//       password: hashedPwd,
//     };
//     userDB.setUser([...userDB.user, newUser]);
//     await fsP.writeFile(
//       path.join(__dirname, "..", "model", "user.json"),
//       JSON.stringify(userDB.user)
//     );
//     console.log(userDB.user);
//     res.status(201).json({ success: `New user ${user} created!` });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// module.exports = { handleNewUser };


/// v.s use mongoose and mongoDB

const User = require("../model/User");

const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });
  //check for duplicate usernames in the db
  const duplicate = await User.findOne({ username: user }).exec();

  if (duplicate) return res.sendStatus(409); //conflict
  try {
    //encrypt the password
    const hashedPwd = await bcrypt.hash(pwd, 10);
    //store and create the new user
    const result = await User.create({
      username: user,
      password: hashedPwd,
    });

    console.log(result);
   
    res.status(201).json({ success: `New user ${user} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
