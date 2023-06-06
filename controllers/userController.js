const mongoose = require('mongoose');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const url = 'mongodb+srv://XFusional:cc1ss7abc@blogcluster.dvlp2.mongodb.net/Posts?retryWrites=true&w=majority';

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.log(err);
});

const maxAge = 3 * 24 * 60 * 60; // 3 days in seconds

const createToken = (id) => {
  return jwt.sign({ id }, 'secret', {
    expiresIn: maxAge
  });
};

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // Incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
  }

  // Incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
  }

  // Duplicate email error
  if (err.code === 11000) {
    errors.email = 'That email is already registered';
    return errors;
  }

  // Validation errors
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const login_post = async (req, res) => {
    const { email, password } = req.body;
    const stay = req.query.stay;
  
    try {
      const user = await User.login(email, password);
      const token = createToken(user._id);
  
      const maxAge = stay === 'true' ? 259200 : 7200; // maxAge is set to 3 days if stay is true, otherwise 1 hour
      res.cookie('jwt', token, { httpOnly: false, maxAge: maxAge * 1000 });
  
      res.status(200).json({ user: user._id, cookie: req.cookies.jwt });
    } catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
  }
  

  const signup_post = async (req, res) => {
    const { email, password, admin, voted } = req.body;
  
    try {
      const user = await User.create({ email, password, admin, voted });
      const token = createToken(user._id);
  
      const maxAge = req.query.stay === 'true' ? 259200000 : 3600000; // 3 days or 1 hour
  
      res.cookie('jwt', token, {
        httpOnly: false,
        maxAge: maxAge
      });
  
      res.status(201).json({ user: user._id, admin: user.admin });
    } catch (err) {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    }
  }
  


const logout_post = async (req,res) => {
    res.cookie('jwt', '', { maxAge: 1})
    res.status(200).json(req.cookies.jwt)
    console.log('RIP Cookie')
}

const users_get = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
}


const userGetOne = async (req, res) => {
  try {
    if (mongoose.isValidObjectId(req.params.id)) {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    } else {
      res.status(400).json({ error: 'Invalid user ID' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const users_delete = async (req, res) => {
  try {
    if (ObjectId.isValid(req.params.id)) {
      const user = await User.deleteOne({ _id: req.params.id });
      res.status(200).json(user);
    } else {
      res.status(400).json({ error: 'Not a Valid Doc Id' });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};


const auth_status = async(req,res) => {
    console.log(req.cookies)
    res.json(req.cookies.jwt) 
}

const admin_user = async (req, res) => {
  const changeTo = req.query.changeTo;

  try {
    const user = await User.updateOne(
      { _id: req.params.id },
      { $set: { admin: changeTo } }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};


const vote_user = async (req, res) => {
  const changeTo = req.query.changeTo;

  try {
    const user = await User.updateOne(
      { _id: req.params.id },
      { $set: { voted: changeTo } }
    );

    res.json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports ={
  admin_user,
  users_delete,
  users_get,
  userGetOne,
  login_post,
  logout_post,
  signup_post,
  auth_status,
  vote_user
}