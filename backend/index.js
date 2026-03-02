const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./db');

const authRoutes = require('./routes/auth');
const pantryRoutes = require('./routes/pantry');
const recipeRoutes = require('./routes/recipes');
const journalRoutes = require('./routes/journal');
const shoppingRoutes = require('./routes/shopping');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/pantry', pantryRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/journal', journalRoutes);
app.use('/api/shopping', shoppingRoutes);

app.get('/', (req, res) => {
    res.json({ message: '🍳 PantryChef API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});