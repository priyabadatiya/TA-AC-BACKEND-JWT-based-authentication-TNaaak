var express = require('express');
var router = express.Router();
var User = require('../models/users');
var auth = require('../middlewares/auth');
var bcrypt = require('bcrypt');


//register user
router.post("/", async function (req, res, next) {
  console.log(req.body.user)
  try {
  var user = await User.create(req.body);

  var token = await user.signToken();
   return  res.status(201).json({ user: user.userJSON(token) });

} catch (error) {
  next(error);
}
});

//login a user
router.post("/login", async function (req, res, next) {

  var { email, password } = req.body.user;
  if (!email || !password) {
    return res.status(400).json({ error: 'email/password required' })
  }

  try {
    var user= await User.findOne({email});
    if(!user){
      return res.status(400).json({ error: 'no user found' })
    }
    var result = await user.verifyPassword(password);
    console.log(user ,result);
    if(!result){
      return res.status(400).json({ error: 'wrong password' })
    }
    
    var token = await user.signToken();
     res.json({user:user.userJSON(token)});
    

  } catch (error) {
    next(error)
  }
});

router.use(auth.verifyToken);

//get current user
router.get("/", auth.verifyToken, async function (req, res, next) {
  console.log("yes")
  try {
    var user= await User.findById(req.user.userId);
    console.log(1234567, user)
    res.json({user,success : true
    
    
    
    
    
    });
  } catch (error) {
    next(error)
  }
 
});

//update user
router.put("/", auth.verifyToken, async function (req, res, next) {
  try {
    var user= await User.findByIdAndUpdate(req.user.userId, req.body.user);
    res.json({user:user.userJSON(token)});
  } catch (error) {
    next(error)
  }
 
});

module.exports = router;
