const express = require("express");
const router = express.Router();
const path = require("path");


router.get(/^\/$|\/index(.html)?/, (req, res) => {
  // res.send("hello world");
  res.sendFile(path.join(__dirname,"..", "views","index.html"));
});

router.get(/^\/new-page(.html)?$/, (req, res) => {
  // res.send("hello world");
  res.sendFile(path.join(__dirname,".." ,"views", "new-page.html"));
});

router.get(/^\/old-page(.html)?$/, (req, res) => {
  // res.send("hello world");
  // res.redirect(path.join(__dirname, "views", "new-page.html"));//302 by default
  res.redirect(301, "/new-page.html"); //301 more better
});

module.exports = router;