const mongoose = require('mongoose')

const surveySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    question: {
        type: String,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,  // Reference to User model
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    acceptedCount: {
        type: Number,
        default: 0
    },
    notAcceptedCount: {
        type: Number,
        default: 0
    },
    responses: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            accepted: Boolean
        }
    ],
    
});

module.exports = mongoose.model("Survey", surveySchema);
