const mongoose = require('mongoose');
const TokenVerification = new mongoose.Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    token: {
        type: String,
        required: true
    },
    for: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 43200
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }

})

module.exports = VerifyMe = mongoose.model('verification', TokenVerification)