var express = require('express');
var router = express.Router();
let User = require('../models/users');
let auth = require('../middlewares/auth');

// router.use(auth.verifyToken);
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//register
router.post('/register', async (req, res, next) => {
  try {
    let user = await User.create(req.body);
    let token = await user.signToken();
    res.status(200).json({user: user.userJSON(token)});
  }catch(error) {
    next(error);
  }
});
// login
router.post('/login', async (req, res, next) => {
  let {email, password} = req.body;
  if(!email || !password) {
    return res.status(400).json({error: "Email/password required"});
  }
  try{
    let user = await User.findOne({email});
    console.log(user);
    if(!user) {
      return res.status(400).json({error: "Email is not registered"});
    }
    
    let result = await user.verifyPassword(password);
    
    if(!result) {
      return res.status(400).json({error: "Password is incorrect"});
    }
    //create token
    var token = await user.signToken();
    res.status(200).json({user: user.userJSON(token)});
  }catch(error) {
    next(error);
  }
});
//protect
router.get('/protect', auth.verifyToken, (req, res, next) => {
  console.log(req.user);
  res.status(200).json({msg: "This route is protected"});
});
module.exports = router;
