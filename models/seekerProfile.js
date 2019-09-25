const mongoose = require('mongoose');
const SeekerSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },
    address: {
        type: String
    },
    interest: {
        type: String,
    },
    aboutMe: {
        type: String,
        default: String
    },
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = Seeker = mongoose.model('seeker_profile', SeekerSchema)