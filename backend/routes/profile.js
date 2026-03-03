const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getProfile, getPersonalizedRecipes } = require('../controllers/profileController');

router.get('/', authMiddleware, getProfile);
router.get('/personalized', authMiddleware, getPersonalizedRecipes);

module.exports = router;