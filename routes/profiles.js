const express = require('express');
const passport = require('passport');
const router = express.Router();

const SeekerProfile = require('../models/seekerProfile');
const ConsultantProfile = require('../models/consultantProfile');

router.post('/add_seeker', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (req.user.role === 'Seeker') {
            const checkIfExists = await SeekerProfile.find({ _userId: req.user.id });
            console.log(checkIfExists)
            if (!checkIfExists[0]) {
                const combinedData = {};
                combinedData.req = req.body;
                combinedData.req._userId = req.user.id;
                const profileData = await new SeekerProfile(combinedData.req).save();
                res.json(profileData)
            } else {
                res.json('Edit your profile')
            }
        } else {
            res.json('You should be registered as Seeker to complete this profile')
        }
    }
    catch (e) {
        throw e
    }
})

router.delete('/delete_seeker', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (req.user.role === 'Seeker') {
            const test = await SeekerProfile.deleteOne({ _userId: req.user.id });
            res.json(test)
        }
        else {
            res.json('You should be registered as Seeker to delete this profile')
        }
    }
    catch (e) {
        throw e
    }
})

router.patch('/edit_seeker', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (req.user.role === 'Seeker') {
            await SeekerProfile.updateOne({ _userId: req.user.id }, { $set: req.body });
            const result = await SeekerProfile.find({ _userId: req.user.id });
            res.json(result)
        }
        else {
            res.json('You should be registered as Seeker to edit this profile')
        }
    }
    catch (e) {
        throw e
    }
})

router.get('/get_seeker', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (req.user.role === 'Seeker') {
            const getData = await SeekerProfile.find({ _userId: req.user.id });
            res.json(getData)
        }
        else {
            res.json('You should be registered as Seeker to get this profile')
        }
    }
    catch (e) {
        throw e
    }
})

/**
 * Consultant Profile
**/

router.post('/add_consultant', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (req.user.role === 'Consultant') {
            const checkIfExists = await ConsultantProfile.find({ _userId: req.user.id });
            if (!checkIfExists[0]) {
                const combinedData = {};
                console.log(req.body)
                combinedData.req = req.body;
                combinedData.req._userId = req.user.id;
                const links = [];
                links.push({
                    name: req.body.name,
                    url: req.body.url
                })
                combinedData.req.links = links;
                const profileData = await new ConsultantProfile(combinedData.req).save();
                res.json(profileData)
            } else {
                res.json('Edit your profile')
            }
        }
        else {
            res.json('You should be registered as Consultant to add this profile')
        }
    }
    catch (e) {
        throw e
    }
})

router.delete('/delete_consultant', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (req.user.role === 'Consultant') {
            const test = await ConsultantProfile.deleteOne({ _userId: req.user.id });
            res.json(test)
        }
        else {
            res.json('You should be registered as Consultant to delete this profile')
        }
    }
    catch (e) {
        throw e
    }
})

router.patch('/edit_consultant', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (req.user.role === 'Consultant') {
            await ConsultantProfile.updateOne({ _userId: req.user.id }, { $set: req.body });
            const result = await ConsultantProfile.find({ _userId: req.user.id });
            res.json(result)
        }
        else {
            res.json('You should be registered as Consultant to edit this profile')
        }
    }
    catch (e) {
        throw e
    }
})

router.get('/get_consultant', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        if (req.user.role === 'Consultant') {
            const getData = await ConsultantProfile.find({ _userId: req.user.id });
            res.json(getData)
        }
        else {
            res.json('You should be registered as Consultant to get this profile')
        }
    }
    catch (e) {
        throw e
    }
})

module.exports = router