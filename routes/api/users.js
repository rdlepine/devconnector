const express = require('express')
const router = express.Router()
const User = require('../../models/User')
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const jwt = require("jsonwebtoken")
const keys = require('../../config/keys')
const passport = require('passport')


router.post('/register', (req, res) => {
    const {name, email, password} = req.body

    User.findOne({
        email: email
    }).then(user => {
        if(user) {
            return res.status(400).json({email: "Email Already Exists"})
        } else {
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm',
            })
            const newUser = new User({
                name: name,
                email: email,
                password: password,
                avatar: avatar,
            })
           
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(password, salt, (err, hash)=> {
                    if(err) throw err
                    newUser.password = hash
                    newUser.save()
                           .then(user => res.json(user))
                           .catch(err => console.log(err))
                })
            })
        }
    })

})

//@route GET api/users/login
//@desc Login User / Returning token
//@access Public

router.post('/login', (req, res) => {
    const {email, password} = req.body

    //Find user by email
    User.findOne({email: email})
        .then((user) => {
            if(!user) {
                return res.status(404).json({email: 'User Not Found'})
            }
            //Check Password
            bcrypt.compare(password, user.password)
                  .then((isMatch) => {
                      if(isMatch) {
                        //userMatched
                        //Sign token
                        const payload = {
                            id: user._id,
                            name: user.name,
                            avatar: user.avatar
                        }
                        console.log(keys)
                        jwt.sign(payload, keys.secretOrKey, {expiresIn: 3600}, (err, token) => {
                            if(err) {
                                return res.status(400).json({err:err})
                            }
                            res.json({
                                sucess:true,
                                token: 'Bearer ' + token
                            })
                        })
                      } else {
                        return res.status(400).json({password:'Invalid Email and or Password'})
                      }
                  })
        })
        .catch((err) => {
            console.log(err)
        })

})

// @route GET api/users/current
// @desc return current user
// @access private

router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json({message: 'Success'})
})

module.exports = router