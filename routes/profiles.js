const express = require('express');
const passport = require('passport');
const router = express.Router();

const SeekerProfile = require('../models/seekerProfile');

router.post('/add_seeker', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const checkIfExists = await SeekerProfile.find({ _userId: req.user.id });
        if (!checkIfExists[0]) {
            const combinedData = {};
            combinedData.req = req.body;
            combinedData.req._userId = req.user.id;
            const profileData = await new SeekerProfile(combinedData.req).save();
            res.json(profileData)
        } else {
            res.json('Edit your profile')
        }
    }
    catch (e) {
        throw e
    }
})

router.delete('/delete_seeker', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const test = await SeekerProfile.deleteOne({ _userId: req.user.id });
        res.json(test)
    }
    catch (e) {
        throw e
    }
})

router.patch('/edit_seeker', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        await SeekerProfile.updateOne({ _userId: req.user.id }, { $set: req.body });
        const result = await SeekerProfile.find({ _userId: req.user.id });
        res.json(result)
    }
    catch (e) {
        throw e
    }
})

router.get('/get_seeker', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const getData = await SeekerProfile.find({ _userId: req.user.id });
        res.json(getData)
    }
    catch (e) {
        throw e
    }
})
module.exports = router