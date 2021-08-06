const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Rider = require('./riderModel');

router.post('/signup', async (req, res) =>{
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
        const newRider = new Rider({
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
                }).catch(err => res.status(400).json({ error: err }))
            });
        });
    }
});


router.post("/login", (req, res) => {
    if(!req.body.phone ||  req.body.phone === ""){
        return res.status(400).json({error: true, message:"phone is required"})
    }
    if(!req.body.password ||  req.body.password === ""){
        return res.status(400).json({error: true, message:"Password is required"})
    }

    const phone = req.body.phone;
    const password = req.body.password;

    Rider.findOne({ phone: phone })
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
                errors.email = "Rider not found";

                return res.status(400).json(errors)
            }
        })
        .catch(err => res.status(400).json(err))
});

module.exports = router;