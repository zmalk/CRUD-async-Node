const User = require("../model/User");


const handleLogout = async (req, res) => {
  // delete also the ACCESSTOKEN FROM THE CLIENT

  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // NO CONTENT
  const refreshToken = cookies.jwt;
  // IS REFRESS TOKEN IN DB
  const foundUser =await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204);
  } //NO CONTENT

  //delete the refresh token in db
foundUser.refreshToken = "";
const result = await foundUser.save();
console.log(result);
  // const otherUser = userDB.user.filter(
  //   (p) => p.refreshToken !== foundUser.refreshToken
  // );
  // const currentUser = { ...foundUser, refreshToken: "" };
  // userDB.setUser([...otherUser, currentUser]);

  // await fsPromise.writeFile(
  //   path.join(__dirname, "..", "model", "users.json"),
  //   JSON.stringify(userDB.user)
  // );

  res.clearCookie("jwt", { httpOnly: true}); // secure : true only servers on https
 return res.sendStatus(204);

};

module.exports = {
  handleLogout,
};
