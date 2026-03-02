import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecipeSuggestions, saveRecipe } from '../api';
import toast from 'react-hot-toast';

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const { data } = await getRecipeSuggestions();
      setRecipes(data);
    } catch (err) {
      toast.error('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (recipe) => {
    try {
      await saveRecipe({
        recipe_id: String(recipe.id),
        recipe_title: recipe.title,
        recipe_image: recipe.image
      });
      toast.success('Recipe saved!');
    } catch (err) {
      toast.error('Failed to save recipe');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Back</button>
        <h1>👨‍🍳 Recipe Suggestions</h1>
      </div>

      {loading ? (
        <p style={styles.loading}>Finding recipes from your pantry...</p>
      ) : recipes.length === 0 ? (
        <p style={styles.empty}>No recipes found. Try adding more ingredients to your pantry!</p>
      ) : (
        <div style={styles.grid}>
          {recipes.map((recipe) => (
            <div key={recipe.id} style={styles.card}>
              <img src={recipe.image} alt={recipe.title} style={styles.image} />
              <div style={styles.cardBody}>
                <h3 style={styles.title}>{recipe.title}</h3>
                <p style={styles.meta}>✅ Uses {recipe.usedIngredientCount} of your ingredients</p>
                <p style={styles.meta}>❌ Missing {recipe.missedIngredientCount} ingredients</p>
                <div style={styles.actions}>
                  <button style={styles.saveBtn} onClick={() => handleSave(recipe)}>❤️ Save</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#f9f5f0', padding: '24px' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' },
  backBtn: { padding: '8px 16px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' },
  loading: { textAlign: 'center', fontSize: '18px', color: '#888', marginTop: '60px' },
  empty: { textAlign: 'center', fontSize: '18px', color: '#888', marginTop: '60px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' },
  card: { background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden' },
  image: { width: '100%', height: '180px', objectFit: 'cover' },
  cardBody: { padding: '16px' },
  title: { fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' },
  meta: { fontSize: '13px', color: '#666', marginBottom: '4px' },
  actions: { marginTop: '12px', display: 'flex', gap: '8px' },
  saveBtn: { padding: '8px 16px', background: '#ff6b35', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px' },
};

export default Recipes;