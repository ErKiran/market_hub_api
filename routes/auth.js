const express = require('express')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const passport = require('passport');
const nodemailer = require('nodemailer');
const SendGridTransport = require('nodemailer-sendgrid-transport');


const User = require('../models/user');
const VerifyMe = require('../models/tokenverification');
const { validateUserInfo } = require('../validations/user');

const transporter = nodemailer.createTransport(SendGridTransport({
    auth: {
        api_key: process.env.sendGrid
    }
}));



const router = express.Router();



router.post('/register', async (req, res) => {
    try {
        const { errors, isValid } = validateUserInfo(req.body);
        if (!isValid) {
            return res.status(400).json(errors);
        }
        const user = await User.findOne({ email: req.body.email });
        if (user === null) {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                role: req.body.role,
                'admin.is_admin': req.body.isadmin,
                'admin.is_techinical': req.body.istechinical
            })
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(newUser.password, salt);
            try {
                newUser.password = hash;
                const result = await newUser.save();
                const token = new VerifyMe({
                    _userId: result._id,
                    token: crypto.randomBytes(16).toString('hex'),
                    for: 'Activate Email'
                });
                const token_dum = await token.save()
                if (result) {
                    const mail = await transporter.sendMail({
                        to: req.body.email,
                        from: 'admin@konsult101.com',
                        subject: 'Welcome to Konsult! Confirm Your Email',
                        html: `<h1>You Sucessfully Signed Up! 
                    Click this link to activate your account 
                    <a href ="${req.header('host')}/auth/api/user/activate-email/${token_dum.token}">Link</a>`
                    });
                    if (mail.message === 'success') {
                        res.json({
                            msg: `Activation Key has been sent to your mail ${req.body.email}`,
                            user: result
                        })
                    }
                }
            }
            catch (e) {
                throw e
            }
        }
        else {
            res.json(`The email ${req.body.email} has already been used.`)
        }
    }
    catch (e) {
        throw e
    }
})

router.get('/api/user/activate-email/:token', async (req, res, next) => {
    const test_token = await VerifyMe.find({ token: req.params.token });
    if (test_token === null) {
        res.json('We are unable to find User by this token');
    }
    const user = await User.find({ _id: test_token[0]._userId });
    if (user === null) {
        res.json('The user and token are not associated');
    }
    const update = await User.updateOne({ _id: test_token[0]._userId, }, { $set: { isactive: true } });
    if (update) {
        res.redirect('http://testing.konsult101.com/login', 301)
        next();
    }
    else {
        res.json("Error while validating Info");
    }
})

router.post('/forget-password', async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user === null) {
        // Do nothing or send mail to user
    }

    const token = new VerifyMe({
        _userId: user._id,
        token: crypto.randomBytes(16).toString('hex'),
        for: 'Reset Password'
    });

    const token_dum = await token.save();
    await transporter.sendMail({
        to: req.body.email,
        from: 'admin@konsult101.com',
        subject: 'Forget password',
        html: `<h1>You are receiving this mail because you have ask for password Reset! 
    Click this link to reset your account password 
    <a href ="${req.header('host')}/auth/api/user/reset-password/${token_dum.token}">Link</a>
    <p>Click this  to set a new password</p></h1>`
    });
    await User.updateOne({ email: req.body.email }, { $set: { passwordResetToken: true } })
    res.json(user)
    //send-mail to user with token 
})

router.post('/user/reset-password/:token', async (req, res) => {
    const test_token = await VerifyMe.find({ token: req.params.token, for: 'Reset Password' });
    if (test_token === null) {
        res.json('We are unable to find User by this token');
    }
    const user = await User.find({ _id: test_token[0]._userId, email: req.body.email })
    console.log(user)
    if (user === null) {
        res.json('The user and token are not associated');
    }
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);
    await User.updateOne({ _id: test_token[0]._userId }, { $set: { password: hash, passwordResetToken: false } })
    res.json(user);
})

router.post('/login', async (req, res) => {
    try {
        const user = await User.find({ email: req.body.email });
        if (user === null || user.length === 0) {
            res.status(404).json('Please Check the credentials')
        }
        else {
            const test = await bcrypt.compare(req.body.password, user[0].password);
            if (user[0].isactive === true) {
                if (test === true) {
                    const payload = { id: user[0].id, name: user[0].name, isadmin: user[0].admin.isadmin, istechinical: user[0].admin.istechinical };
                    const token = jwt.sign(payload, process.env.secretOrKey, { expiresIn: 3600 });
                    res.json({
                        sucess: "true",
                        token: `${token}`
                    })
                }
                else {
                    res.status(404).json('Please Check the credentials')
                }
            } else {
                res.status(401).json('Activate your account before you can log in')
            }
        }
    }
    catch (e) {
        console.warn(e)
    }
})

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    })
})

module.exports = router