const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters'],
  },
  admin: {
    type: Boolean,
    required: true,
    default: false
  },
  voted: {
    type: String,
    required: true,
    default: false
  }

});


// fire a function before doc saved to db

userSchema.pre('save', async function(next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// static method to login user
userSchema.statics.login = async function(email, password) {
  console.log(email,password)
  const user = await this.findOne({ email: email });
  console.log( user )
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  } else if(!user){
    throw Error('incorrect email');
  }
};

const User = mongoose.model('user', userSchema);

module.exports = User;