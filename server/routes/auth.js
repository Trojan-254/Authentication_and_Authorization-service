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


/* Module export */

module.exports = router;