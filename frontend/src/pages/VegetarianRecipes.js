import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getVegetarianRecipes, saveRecipe } from '../api';
import RecipeModal from '../components/RecipeModal';
import toast from 'react-hot-toast';

const VegetarianRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const { data } = await getVegetarianRecipes();
      setRecipes(data);
    } catch (err) {
      toast.error('Failed to load vegetarian recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e, recipe) => {
    e.stopPropagation();
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
        <h1>🌱 Vegetarian Recipes</h1>
      </div>

      <div style={styles.banner}>
        <p style={styles.bannerText}>🥦 Showing vegetarian recipes based on your pantry ingredients!</p>
      </div>

      {loading ? (
        <p style={styles.loading}>Finding vegetarian recipes...</p>
      ) : recipes.length === 0 ? (
        <p style={styles.empty}>No vegetarian recipes found. Try adding more ingredients to your pantry!</p>
      ) : (
        <div style={styles.grid}>
          {recipes.map((recipe) => (
            <div key={recipe.id} style={styles.card} onClick={() => setSelectedRecipeId(recipe.id)}>
              <img src={recipe.image} alt={recipe.title} style={styles.image} />
              <div style={styles.cardBody}>
                <div style={styles.badges}>
                  <span style={styles.vegBadge}>🌱 Vegetarian</span>
                  {recipe.vegan && <span style={styles.veganBadge}>🌿 Vegan</span>}
                  {recipe.glutenFree && <span style={styles.gfBadge}>🌾 GF</span>}
                </div>
                <h3 style={styles.title}>{recipe.title}</h3>
                <div style={styles.meta}>
                  {recipe.readyInMinutes && <span style={styles.tag}>⏱️ {recipe.readyInMinutes} mins</span>}
                  {recipe.servings && <span style={styles.tag}>🍽️ {recipe.servings} servings</span>}
                </div>
                <div style={styles.actions}>
                  <button style={styles.viewBtn} onClick={() => setSelectedRecipeId(recipe.id)}>👁️ View Recipe</button>
                  <button style={styles.saveBtn} onClick={(e) => handleSave(e, recipe)}>❤️ Save</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedRecipeId && (
        <RecipeModal
          recipeId={selectedRecipeId}
          onClose={() => setSelectedRecipeId(null)}
        />
      )}
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#f9f5f0', padding: '24px' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  backBtn: { padding: '8px 16px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' },
  banner: { background: 'linear-gradient(135deg, #e8f5e9, #c8e6c9)', padding: '16px 20px', borderRadius: '12px', marginBottom: '28px', maxWidth: '600px' },
  bannerText: { color: '#2e7d32', fontSize: '15px', fontWeight: '500' },
  loading: { textAlign: 'center', fontSize: '18px', color: '#888', marginTop: '60px' },
  empty: { textAlign: 'center', fontSize: '18px', color: '#888', marginTop: '60px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' },
  card: { background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden', cursor: 'pointer' },
  image: { width: '100%', height: '180px', objectFit: 'cover' },
  cardBody: { padding: '16px' },
  badges: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' },
  vegBadge: { background: '#e8f5e9', color: '#2e7d32', padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
  veganBadge: { background: '#f1f8e9', color: '#558b2f', padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
  gfBadge: { background: '#fff3e0', color: '#e65100', padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: '600' },
  title: { fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' },
  meta: { display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' },
  tag: { background: '#f9f5f0', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', color: '#666' },
  actions: { display: 'flex', gap: '8px' },
  viewBtn: { flex: 1, padding: '8px', background: '#e8f5e9', color: '#2e7d32', border: '1px solid #c8e6c9', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' },
  saveBtn: { padding: '8px 16px', background: '#ff6b35', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' },
};

export default VegetarianRecipes;