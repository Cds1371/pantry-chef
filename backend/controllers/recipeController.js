const getVegetarianRecipes = async (req, res) => {
  try {
    const pantryItems = await pool.query(
      'SELECT ingredient_name FROM pantry_items WHERE user_id = $1',
      [req.user.id]
    );

    const ingredients = pantryItems.rows.length > 0
      ? pantryItems.rows.map(item => item.ingredient_name).join(',')
      : 'vegetables';

    const response = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
      params: {
        query: ingredients,
        diet: 'vegetarian',
        number: 12,
        addRecipeInformation: true,
        apiKey: process.env.SPOONACULAR_API_KEY
      }
    });

    res.json(response.data.results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};