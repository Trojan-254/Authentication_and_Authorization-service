const router = require('express').Router();
const CryptoJS = require('crypto-js');
var jwt = require('jsonwebtoken');
const sendEmail = require('../utils/email');
const Token = require('../models/Token');
const { User, validate } = require('../models/User');
const crypto = require('crypto');
const mongoose = require('mongoose');

/* USER REGISTRATION */

router.post('/register', async (req, res) => {
   try{
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user)
        return res.status(400).send("User with given email already exists!");

    user = await new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SECURE).toString(),
    }).save();
    console.log("New user has been saved succesfully..!");

    let token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
  
      const message = `${process.env.BASE_URL}/verify/${user.id}/${token.token}`;
      await sendEmail(user.email, "Verify Email", message);
  
      res.send("An Email sent to your account please verify");
   } catch(err) {
    res.status(400).send("An error occured");
    console.log(err);
   }
});


/* EMAIL VERIFICATION */
  
  // router.get("/verify/:id/:token", async (req, res) => {
  //   try {
  //     const user = await User.findOne({ _id: mongoose.Types.ObjectId(req.params.id) });
  //     if (!user) return res.status(400).send("Invalid link");
  
  //     const token = await Token.findOne({
  //       userId: user._id,
  //       token: req.params.token,
  //     });
  //     if (!token) return res.status(400).send("Invalid link");
  
  //     await User.updateOne({ _id: user._id}, {verified: true });
  //     await Token.findByIdAndRemove(token._id);
  
  //     res.send("email verified sucessfully");
  //   } catch (error) {
  //     res.status(400).send("An error occured");
  //     console.log(error);
  //   }
  // });
  
  /* EMAIL VERIFICATION */
router.get("/verify/:id/:token", async (req, res) => {
  try {
    const user = await User.findOne({ _id: new mongoose.Types.ObjectId(req.params.id) });

      if (!user) {
          return res.status(400).send("Invalid link: User not found");
      }

      const token = await Token.findOne({
          userId: user._id,
          token: req.params.token,
      });

      if (!token) {
          return res.status(400).send("Invalid link: Token not found");
      }

      await User.updateOne({ _id: user._id }, { verified: true });
      await Token.findOneAndDelete({ _id: token._id });

      return res.send("Email verified successfully");
      // console.log("User email verification was succesfull")
  } catch (error) {
      console.error(error);
      return res.status(500).send("An error occurred during email verification");
  }
});





/* USER LOGIN */

router.post('/login', async (req, res) => {
    try{
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(401).json("Email not found!")
        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECURE);
        const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        originalPassword !== req.body.password && res.status(401).json("Wrong password!");
        const accessToken = jwt.sign({
            id: user.id
        }, process.env.JWT_SECURE, { expiresIn: "7d" });

        const { password, ...others } = user._doc;
        res.status(200).json({ ...others, accessToken });
        console.log("Successfull user login!");

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

/* Module export */

module.exports = router;