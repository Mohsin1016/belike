
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const jwt_secret = process.env.JWT_SECRET;

// const login = async (req, res) => {
//     const { name , password } = req.body;
//     const foundUser = await User.findOne({ name });
//     console.log(req.body);
//     console.log(foundUser);
//     if (foundUser) {
//         console.log(foundUser.password);
//         console.log(bcrypt.compareSync(password, foundUser.password));
//       const passOk = bcrypt.compareSync(password, foundUser.password);
//       console.log(passOk);
//       if (passOk) {
//         jwt.sign(
//           { userId: foundUser._id, name },
//           jwt_secret,
//           {},
//           (err, token) => {
//             if (err) throw err;
//             res
//               .cookie("token", token, { sameSite: "none", secure: true })
//               .json({ id: foundUser._id });
//           }
//         );
//       }
//     }
//   };
  
const login = async (req, res) => {
    const { name, password } = req.body;
  
    try {
      // Log request body for debugging
      console.log('Login request:', req.body);
  
      // Find user by name
      const foundUser = await User.findOne({ name });
      console.log('Found user:', foundUser);
  
      // If user not found, return error
      if (!foundUser) {
        return res.status(400).json({ error: 'Invalid login credentials' });
      }
  
      // Compare passwords
      const passOk = bcrypt.compareSync(password, foundUser.password);
      console.log('Password match:', passOk);
  
      // If password does not match, return error
      if (!passOk) {
        return res.status(400).json({ error: 'Invalid login credentials' });
      }
  
      // Generate JWT token
      jwt.sign(
        { userId: foundUser._id, name },
        jwt_secret,
        { expiresIn: '1h' },
        (err, token) => {
          if (err) {
            console.error('JWT sign error:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
          }
  
          // Send token in cookie
          res
            .cookie('token', token, { sameSite: 'none', secure: true })
            .json({ id: foundUser._id });
        }
      );
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const signUp = async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const hashedPassword = bcrypt.hashSync(password, 10); // Generate salt and hash password
      const userCreated = await User.create({
          name,
          email,
          password: hashedPassword,
        });
        console.log(hashedPassword);
      jwt.sign(
        { userId: userCreated._id, name },
        jwt_secret,
        {},
        (err, token) => {
          if (err) throw err;
          res
            .cookie("token", token, { sameSite: "none", secure: true })
            .status(201)
            .json({ id: userCreated._id });
        }
      );
    } catch (err) {
      if (err.code === 11000 && err.keyPattern && err.keyValue) {
        res.status(400).json({ message: "Username already exists" });
      } else {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  };
  

module.exports = {
  signUp,
  login,
};
