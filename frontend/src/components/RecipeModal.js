import { useState, useEffect } from 'react';
import { getRecipeDetails, saveRecipe } from '../api';
import toast from 'react-hot-toast';

const RecipeModal = ({ recipeId, onClose }) => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const { data } = await getRecipeDetails(recipeId);
        setRecipe(data);
      } catch (err) {
        toast.error('Failed to load recipe details');
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [recipeId]);

  const handleSave = async () => {
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
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={onClose}>✕</button>

        {loading ? (
          <div style={styles.loading}>
            <p style={styles.loadingText}>Loading recipe...</p>
          </div>
        ) : recipe ? (
          <div style={styles.content}>
            <img src={recipe.image} alt={recipe.title} style={styles.image} />

            <div style={styles.body}>
              <h2 style={styles.title}>{recipe.title}</h2>

              <div style={styles.metaRow}>
                {recipe.readyInMinutes && <span style={styles.tag}>⏱️ {recipe.readyInMinutes} mins</span>}
                {recipe.servings && <span style={styles.tag}>🍽️ {recipe.servings} servings</span>}
                {recipe.vegetarian && <span style={{ ...styles.tag, background: '#e8f5e9', color: '#2e7d32' }}>🌱 Vegetarian</span>}
                {recipe.vegan && <span style={{ ...styles.tag, background: '#e8f5e9', color: '#2e7d32' }}>🌿 Vegan</span>}
                {recipe.glutenFree && <span style={{ ...styles.tag, background: '#fff3e0', color: '#e65100' }}>🌾 Gluten Free</span>}
              </div>

              {recipe.summary && (
                <div
                  style={styles.summary}
                  dangerouslySetInnerHTML={{ __html: recipe.summary.split('.').slice(0, 2).join('.') + '.' }}
                />
              )}

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>🥕 Ingredients</h3>
                <div style={styles.ingredientsGrid}>
                  {recipe.extendedIngredients?.map((ing, index) => (
                    <div key={index} style={styles.ingredientItem}>
                      <span style={styles.ingredientDot}>•</span>
                      <span>{ing.original}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={styles.section}>
                <h3 style={styles.sectionTitle}>👨‍🍳 Instructions</h3>
                {recipe.analyzedInstructions?.length > 0 ? (
                  recipe.analyzedInstructions[0].steps.map((step) => (
                    <div key={step.number} style={styles.step}>
                      <div style={styles.stepNumber}>{step.number}</div>
                      <p style={styles.stepText}>{step.step}</p>
                    </div>
                  ))
                ) : (
                  <div
                    style={styles.instructions}
                    dangerouslySetInnerHTML={{ __html: recipe.instructions || 'No instructions available.' }}
                  />
                )}
              </div>

              <button style={styles.saveBtn} onClick={handleSave}>❤️ Save Recipe</button>
            </div>
          </div>
        ) : (
          <p style={styles.loadingText}>Recipe not found.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' },
  modal: { background: 'white', borderRadius: '20px', maxWidth: '750px', width: '100%', maxHeight: '90vh', overflowY: 'auto', position: 'relative' },
  closeBtn: { position: 'sticky', top: '16px', left: '100%', marginRight: '16px', marginTop: '16px', display: 'block', background: 'white', border: '1px solid #ddd', borderRadius: '50%', width: '36px', height: '36px', fontSize: '16px', cursor: 'pointer', zIndex: 10 },
  loading: { padding: '60px', textAlign: 'center' },
  loadingText: { fontSize: '18px', color: '#888' },
  content: { paddingBottom: '24px' },
  image: { width: '100%', height: '260px', objectFit: 'cover', borderRadius: '20px 20px 0 0' },
  body: { padding: '24px' },
  title: { fontSize: '24px', fontWeight: 'bold', marginBottom: '12px' },
  metaRow: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' },
  tag: { background: '#f9f5f0', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', color: '#666' },
  summary: { fontSize: '14px', color: '#666', lineHeight: '1.6', marginBottom: '20px', padding: '12px', background: '#f9f5f0', borderRadius: '10px' },
  section: { marginBottom: '24px' },
  sectionTitle: { fontSize: '18px', fontWeight: 'bold', marginBottom: '12px', color: '#333' },
  ingredientsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' },
  ingredientItem: { display: 'flex', gap: '8px', alignItems: 'flex-start', fontSize: '14px', color: '#444', background: '#f9f5f0', padding: '8px', borderRadius: '8px' },
  ingredientDot: { color: '#ff6b35', fontWeight: 'bold', flexShrink: 0 },
  step: { display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '16px' },
  stepNumber: { minWidth: '32px', height: '32px', background: '#ff6b35', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px', flexShrink: 0 },
  stepText: { fontSize: '15px', color: '#444', lineHeight: '1.6', paddingTop: '4px' },
  instructions: { fontSize: '14px', color: '#444', lineHeight: '1.8' },
  saveBtn: { width: '100%', padding: '14px', background: '#ff6b35', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
};

export default RecipeModal;