
var express = require('express');
var router = express.Router();
var auth = require("../middlewares/auth")
const User = require("../models/users");

//get a user's profile
router.get('/:username', auth.verifyToken, async function (req, res, next) {
    var name = req.params.username;
    try {
        let isFollowing = false;
        var user = await User.findOne({ username: name });
        var loggedInUser = await User.findById(req.user.userId);
        loggedInUser.following.forEach(element => {
            if (element == user.id) {
                isFollowing = true;
            }
        });
        var profile = {
            username: user.username,
            bio: user.bio,
            image: user.image,
            following: isFollowing
        }
        return res.JSON({ profile });
    } catch (error) {
        next(error)
    }

});

//follow a user
router.post('/:username/follow', auth.verifyToken, async function (req, res, next) {
    var name = req.params.username;
    try {
        let isFollowing = true;
        var user = await User.findOne({ username: name });
        var loggedInUser = await User.findById(req.user.userId);
        var updatedUser = await User.findByIdAndUpdate(req.user.userId, { $push: { following: user.id } })
        var profile = {
            username: user.username,
            bio: user.bio,
            image: user.image,
            following: isFollowing,
        }
        return res.JSON({ profile });
    } catch (error) {
        next(error)
    }

});

//unfollow a user
router.delete('/:username/follow', auth.verifyToken, async function (req, res, next) {
    var name = req.params.username;

    try {
        let isFollowing = false;
        var user = await User.findOne({ username: name });
        var loggedInUser = await User.findById(req.user.userId);
        var updatedUser = await User.findByIdAndUpdate(req.user.userId, { $pull: { following: user.id } })
        var profile = {
            username: user.username,
            bio: user.bio,
            image: user.image,
            following: isFollowing
        }
        return res.JSON({ profile });
    } catch (error) {
        next(error)
    }

});
module.exports = router;


module.exports = router;
