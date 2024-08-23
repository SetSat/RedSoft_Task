const express = require('express');
const router = express.Router();
const Survey = require('../models/surveySchema');
const authMiddleware = require('../middleware/authreq');

// Create Survey
router.post('/create', authMiddleware, async (req, res) => {
    const { title, question } = req.body;

    try {
        const createdBy = req.user.user.id;
        const newSurvey = new Survey({
            title,
            question,
            createdBy
        });

        await newSurvey.save();
        res.status(201).json({ message: 'Survey created successfully', survey: newSurvey });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get All Surveys
router.get('/', authMiddleware, async (req, res) => {
    try {
        const surveys = await Survey.find().populate('createdBy', 'username');
        res.status(200).json(surveys);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get a Single Survey
router.get('/:id', authMiddleware, async (req, res) => {
    const surveyId = req.params.id;

    try {
        const survey = await Survey.findById(surveyId).populate('createdBy', 'username');
        if (!survey) {
            return res.status(404).json({ message: 'Survey not found' });
        }

        res.status(200).json(survey);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// Answer Survey
router.post('/answer/:id', authMiddleware, async (req, res) => {
    const surveyId = req.params.id;
    const { accepted } = req.body;

    try {
        const survey = await Survey.findById(surveyId);
        if (!survey) {
            return res.status(404).json({ message: 'Survey not found' });
        }


        const hasResponded = survey.responses.find(response => response.userId.equals(req.user.user.id));
        if (hasResponded) {
            return res.status(400).json({ message: 'You have already responded to this survey' });
        }


        if (accepted === true) {
            survey.acceptedCount += 1;
        } else {
            survey.notAcceptedCount += 1;
        }

        survey.responses.push({
            userId: req.user.user.id,
            accepted
        });

        await survey.save();
        res.status(200).json({ message: 'Survey answered successfully', survey });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }


});

router.post('/answers/all', authMiddleware, async (req, res) => {
    const { answers } = req.body;
    const userId = req.user.user.id;

    try {

        const responseResults = [];

        for (const answer of answers) {
            const { surveyId, accepted } = answer;
            const survey = await Survey.findById(surveyId);

            if (!survey) {
                responseResults.push({ surveyId, message: 'Survey not found' });
                continue;
            }

            const hasUserResponded = survey.responses.some(response => response.userId.toString() === userId);

            if (hasUserResponded) {
                responseResults.push({ surveyId, message: 'User has already responded' });
                continue;
            }

            const userResponse = {
                userId: userId,
                accepted: accepted
            };
            survey.responses.push(userResponse);

            survey.acceptedCount = survey.responses.filter(response => response.accepted).length;
            survey.notAcceptedCount = survey.responses.filter(response => !response.accepted).length;

            await survey.save();

            responseResults.push({ surveyId, message: 'Survey answered successfully' });
        }

        res.status(200).json({ message: 'All surveys answered', results: responseResults });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
