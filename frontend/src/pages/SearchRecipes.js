import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchRecipes, saveRecipe } from '../api';
import RecipeModal from '../components/RecipeModal';
import toast from 'react-hot-toast';

const SearchRecipes = () => {
  const [query, setQuery] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const { data } = await searchRecipes(query);
      setRecipes(data);
      if (data.length === 0) toast('No recipes found, try another search!');
    } catch (err) {
      toast.error('Search failed, try again');
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
        <h1>🔍 Search Recipes</h1>
      </div>

      <form onSubmit={handleSearch} style={styles.searchForm}>
        <input
          style={styles.searchInput}
          type="text"
          placeholder="Search for any recipe (e.g. pasta, tacos, curry...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button style={styles.searchBtn} type="submit">Search</button>
      </form>

      {loading && <p style={styles.loading}>Searching recipes...</p>}

      {!loading && recipes.length > 0 && (
        <div style={styles.grid}>
          {recipes.map((recipe) => (
            <div key={recipe.id} style={styles.card} onClick={() => setSelectedRecipeId(recipe.id)}>
              <img src={recipe.image} alt={recipe.title} style={styles.image} />
              <div style={styles.cardBody}>
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
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' },
  backBtn: { padding: '8px 16px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' },
  searchForm: { display: 'flex', gap: '12px', maxWidth: '600px', marginBottom: '32px' },
  searchInput: { flex: 1, padding: '14px', borderRadius: '10px', border: '1px solid #ddd', fontSize: '16px' },
  searchBtn: { padding: '14px 28px', background: '#ff6b35', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold' },
  loading: { textAlign: 'center', fontSize: '18px', color: '#888', marginTop: '40px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' },
  card: { background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden', cursor: 'pointer' },
  image: { width: '100%', height: '180px', objectFit: 'cover' },
  cardBody: { padding: '16px' },
  title: { fontSize: '16px', fontWeight: 'bold', marginBottom: '8px' },
  meta: { display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' },
  tag: { background: '#f9f5f0', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', color: '#666' },
  actions: { display: 'flex', gap: '8px' },
  viewBtn: { flex: 1, padding: '8px', background: '#f9f5f0', color: '#333', border: '1px solid #ddd', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' },
  saveBtn: { padding: '8px 16px', background: '#ff6b35', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' },
};

export default SearchRecipes;