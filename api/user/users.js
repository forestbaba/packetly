const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./userModel');
const secret = require('../helpers/config').secret;


router.post('/signup', async (req, res) =>{
    if(!req.body.email ||  req.body.email === ""){
        return res.status(400).json({error: true, message:"Email is required"})
    }
    if(!req.body.password ||  req.body.password === ""){
        return res.status(400).json({error: true, message:"Password is required"})
    }
    if(!req.body.phone ||  req.body.phone === ""){
        return res.status(400).json({error: true, message:"phone is required"})
    }
    if(!req.body.name ||  req.body.name === ""){
        return res.status(400).json({error: true, message:"name is required"})
    }

    const user = await User.findOne({email: req.body.email});
    if(user){
        return res.status(400).json({error: true, message:"User already exist"})
    }else{
        const newUser = new User({
            email: req.body.email,
            name: req.body.name,
            phone: req.body.phone,
        });

        bcrypt.genSalt(10, (err, salt) => {

            bcrypt.hash(req.body.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser.save().then(reguser => {
                    if (reguser) {
                        const payload = {
                            id: reguser._id,
                            email: reguser.email,
                            name: reguser.name,
                            phone: reguser.phone
                        }
                        jwt.sign(payload, secret, (err, token) => {

                            res.json({
                                success: true,
                                token: 'Bearer ' + token,
                                user: payload,
                                message: 'signup is successful'
                            })

                        });
                    }
                }).catch(err => {
                    console.log('ERR: ', err)
                    res.status(400).json({ error: true, message:"error creating user" })})
            });
        });
    }
});


router.post("/login", (req, res) => {
    if(!req.body.email ||  req.body.email === ""){
        return res.status(400).json({error: true, message:"Email is required"})
    }
    if(!req.body.password ||  req.body.password === ""){
        return res.status(400).json({error: true, message:"Password is required"})
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email })
        .then(user => {
            if (user) {
                bcrypt
                    .compare(password, user.password)
                    .then(isMatch => {

                        if (isMatch) {
                            const payload = {
                                id: user.id,
                                email: user.email,
                                name: user.name,
                                phone: user.phone
                            }
                            jwt.sign(payload, secret, (err, token) => {
                                res.json({
                                    success: true,
                                    token: 'Bearer ' + token,
                                    user: payload
                                })

                            });

                        } else {
                            return res.status(400).json({ error: true, message: 'Email or Password is incorrect"' });
                        }
                    })
                    .catch(err => console.log(err));

            } else {
                errors.email = "User not found";

                return res.status(400).json(errors)
            }
        })
        .catch(err => res.status(400).json(err))
});

router.post('/profile', async (req, res) =>{
    if(!req.body.user || req.body.user === ""){
        return res.status(400).json({error: true, message:"user is required"})
    }
    let user = await User.findOne({_id: req.body.user})
    let profile ={}
    profile.name = user.name
    profile.email = user.email
    profile.wallet_balance = user._doc.wallet_balance

    return res.status(200).json({error: false, profile})
})
router.post('/credit_user', async (req, res) =>{

    if(!req.body.user || req.body.user === ""){
        return res.status(400).json({error: true, message:"user is required"})
    }
     User.findOne({_id: req.body.user})
     .then(user =>{
        console.log(req.body.wallet_balance)
        user.wallet_balance = req.body.wallet_balance
        user.save()
        .then(w =>{
            return res.status(200).json({error: false, w})
        })
        .catch(err =>{
            console.log('ERR: ', err)
        })
     }).catch(err =>{
        return res.status(400).json({error: true, message:"Error crediting user"})
    })
})

module.exports = router;