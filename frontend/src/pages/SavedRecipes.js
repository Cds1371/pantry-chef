import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSavedRecipes, deleteSavedRecipe } from '../api';
import RecipeModal from '../components/RecipeModal';
import toast from 'react-hot-toast';

const SavedRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    try {
      const { data } = await getSavedRecipes();
      setRecipes(data);
    } catch (err) {
      toast.error('Failed to load saved recipes');
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteSavedRecipe(id);
      toast.success('Recipe removed!');
      fetchSaved();
    } catch (err) {
      toast.error('Failed to remove recipe');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Back</button>
        <h1>❤️ Saved Recipes</h1>
      </div>

      {recipes.length === 0 ? (
        <p style={styles.empty}>No saved recipes yet. Go find some recipes!</p>
      ) : (
        <div style={styles.grid}>
          {recipes.map((recipe) => (
            <div key={recipe.id} style={styles.card} onClick={() => setSelectedRecipeId(recipe.recipe_id)}>
              <img src={recipe.recipe_image} alt={recipe.recipe_title} style={styles.image} />
              <div style={styles.cardBody}>
                <h3 style={styles.title}>{recipe.recipe_title}</h3>
                <div style={styles.actions}>
                  <button style={styles.viewBtn} onClick={() => setSelectedRecipeId(recipe.recipe_id)}>👁️ View Recipe</button>
                  <button style={styles.deleteBtn} onClick={(e) => handleDelete(e, recipe.id)}>🗑️ Remove</button>
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
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' },
  backBtn: { padding: '8px 16px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' },
  empty: { textAlign: 'center', fontSize: '18px', color: '#888', marginTop: '60px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' },
  card: { background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden', cursor: 'pointer' },
  image: { width: '100%', height: '180px', objectFit: 'cover' },
  cardBody: { padding: '16px' },
  title: { fontSize: '16px', fontWeight: 'bold', marginBottom: '12px' },
  actions: { display: 'flex', gap: '8px' },
  viewBtn: { flex: 1, padding: '8px', background: '#f9f5f0', color: '#333', border: '1px solid #ddd', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' },
  deleteBtn: { padding: '8px 16px', background: '#ff4444', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' },
};

export default SavedRecipes;