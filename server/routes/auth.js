const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
var jwt = require('jsonwebtoken');

/* USER REGISTRATION */

router.post('/register', async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SECURE).toString(),
    });

    try{
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
        const savedUserName = savedUser.email
        console.log(`${savedUserName} has registered succesfully`);
    } catch (err) {
        res.status(500).json({ message: "Error registering user", err})
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