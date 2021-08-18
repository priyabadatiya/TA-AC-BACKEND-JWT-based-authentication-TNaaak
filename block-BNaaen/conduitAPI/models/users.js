let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require("bcrypt");
let jwt = require('jsonwebtoken');
const Profile = require('./profile');

require("dotenv").config();

let userSchema = new Schema({
    username: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    bio: String,
    image: String,
    following: Boolean,
    followingList: [{type: Schema.Types.ObjectId, ref: "User"}],
    followersList: [{type: Schema.Types.ObjectId, ref: "User"}],
    
}, {timestamps: true});

userSchema.pre('save', async function(next) {
    if(this.password && this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
        let profileData = {
            username: this.username,
            bio: this.bio,
            image: this.image,
          };
          let profile = await Profile.create(profileData);
          this.profile = profile.id;
          next();
    }
    next();
});

userSchema.methods.verifyPassword = async function(password) {
    try{
        let result = await bcrypt.compare(password, this.password);
        return result;
    }catch(error) {
        return error;
    }
}

userSchema.methods.signToken = async function() {
    let payload = {userId: this.id, email: this.email, username: this.username};
    try{
        let token = await jwt.sign(payload, process.env.SECRET);
        return token;
    }catch(error) {
        return error;
    }
}

userSchema.methods.userJSON = function(token) {
    return {
        username: this.username,
        email: this.email,
        bio: this.bio,
        image: this.image,
        token: token
    }
}

userSchema.methods.displayUser = function(id = null) {
    return {
        username: this.username,
        bio: this.bio,
        image: this.image, 
        following: id ? this.followersList.includes(id) : false
    }
}


module.exports = mongoose.model("User", userSchema);