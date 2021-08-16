var express = require("express");
var router = express.Router();

const User = require("../models/users");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/register", async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    const token = await user.signToken();
    console.log(token);
    res.json({ user: user.userJson(token) });
  } catch (e) {
    next(e);
  }
});

router.post("/login", async (req, res, next) => {
  var { password, email } = req.body;
  if (!password && !email) {
    return res.status(400).json({ error: "Email/Password required" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Email is not registered" });
    }
    const result = user.verifyPassword(password);
    if (!result) {
      return res.status(400).json({ error: "Incorrect Password" });
    }
    const token = await user.signToken();
    res.json({ token });
  } catch (e) {
    next(e);
  }
});

module.exports = router;