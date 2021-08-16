var express = require('express');
var router = express.Router();
var User = require('../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.status(200).json({msg: "User Page"});
});

//register user
router.post('/register', async (req, res, next) => {
  try {
    var user = await User.create(req.body);
    let token = await user.signToken();
    res.status(200).json({user: user.userJSON(token)});
  } catch(error) {
    next(error);
  }
});

//login user
router.post('/login', async (req, res, next) => {
  let {email, password} = req.body;
  if(!email || !password) {
    return res.status(400).json({error: "Email/Password required"});
  }
  try {
    let user = await User.findOne({email});
    if(!user) {
      return res.status(400).json({error: "Email is not registered"});
    }
    let result = await user.verifyPassword(password);
    if(!result) {
      return res.status(400).json({error: "Password is Incorrect"});
    }
    //token created
    let token = await user.signToken();
     // Passing to token and some user info to the logged in user
    res.status(200).json({user: user.userJSON(token)});
  }catch(error) {
    next(error);
  }
})

module.exports = router;
