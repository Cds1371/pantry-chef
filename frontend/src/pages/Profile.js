import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, getPersonalizedRecipes } from '../api';
import RecipeModal from '../components/RecipeModal';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [personalized, setPersonalized] = useState({ pantryBased: [], historyBased: [] });
  const [loading, setLoading] = useState(true);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, recipeRes] = await Promise.all([
        getProfile(),
        getPersonalizedRecipes()
      ]);
      setProfile(profileRes.data);
      setPersonalized(recipeRes.data);
    } catch (err) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const renderStars = (rating) => '⭐'.repeat(rating);

  if (loading) return <div style={styles.loadingContainer}><p>Loading your profile...</p></div>;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Back</button>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      {/* Profile Card */}
      <div style={styles.profileCard}>
        <div style={styles.avatar}>
          {profile?.user?.username?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 style={styles.username}>{profile?.user?.username}</h1>
          <p style={styles.email}>{profile?.user?.email}</p>
          <p style={styles.joined}>Member since {new Date(profile?.user?.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <p style={styles.statNumber}>{profile?.stats?.pantryCount}</p>
          <p style={styles.statLabel}>🥕 Pantry Items</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statNumber}>{profile?.stats?.savedCount}</p>
          <p style={styles.statLabel}>❤️ Saved Recipes</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statNumber}>{profile?.stats?.journalCount}</p>
          <p style={styles.statLabel}>📖 Recipes Cooked</p>
        </div>
      </div>

      {/* Personalized Recommendations based on pantry */}
      {personalized?.pantryBased?.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🎯 Recommended For You</h2>
          <p style={styles.sectionSubtitle}>Based on your pantry ingredients</p>
          <div style={styles.grid}>
            {personalized.pantryBased.map((recipe) => (
              <div key={recipe.id} style={styles.recipeCard} onClick={() => setSelectedRecipeId(recipe.id)}>
                <img src={recipe.image} alt={recipe.title} style={styles.recipeImage} />
                <div style={styles.recipeBody}>
                  <h3 style={styles.recipeTitle}>{recipe.title}</h3>
                  <p style={styles.recipeMeta}>✅ Uses {recipe.usedIngredientCount} of your ingredients</p>
                  <button style={styles.viewBtn}>👁️ View Recipe</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History based recommendations */}
      {personalized?.historyBased?.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>🕐 Based On Your Cooking History</h2>
          <p style={styles.sectionSubtitle}>Similar to recipes you've cooked before</p>
          <div style={styles.grid}>
            {personalized.historyBased.map((recipe) => (
              <div key={recipe.id} style={styles.recipeCard} onClick={() => setSelectedRecipeId(recipe.id)}>
                <img src={recipe.image} alt={recipe.title} style={styles.recipeImage} />
                <div style={styles.recipeBody}>
                  <h3 style={styles.recipeTitle}>{recipe.title}</h3>
                  <div style={styles.recipeTags}>
                    {recipe.readyInMinutes && <span style={styles.tag}>⏱️ {recipe.readyInMinutes} mins</span>}
                    {recipe.servings && <span style={styles.tag}>🍽️ {recipe.servings} servings</span>}
                  </div>
                  <button style={styles.viewBtn}>👁️ View Recipe</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Journal Entries */}
      {profile?.recentJournal?.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>📖 Recently Cooked</h2>
          <div style={styles.journalList}>
            {profile.recentJournal.map((entry) => (
              <div key={entry.id} style={styles.journalItem}>
                <div>
                  <h3 style={styles.journalTitle}>{entry.recipe_title}</h3>
                  <p style={styles.journalDate}>🗓️ {new Date(entry.cooked_on).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
                <div style={styles.journalRight}>
                  <p style={styles.journalStars}>{renderStars(entry.rating)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Saved Recipes */}
      {profile?.recentSaved?.length > 0 && (
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>❤️ Recently Saved</h2>
          <div style={styles.savedList}>
            {profile.recentSaved.map((recipe) => (
              <div key={recipe.id} style={styles.savedItem} onClick={() => setSelectedRecipeId(recipe.recipe_id)}>
                <img src={recipe.recipe_image} alt={recipe.recipe_title} style={styles.savedImage} />
                <p style={styles.savedTitle}>{recipe.recipe_title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {personalized?.pantryBased?.length === 0 && personalized?.historyBased?.length === 0 && profile?.recentJournal?.length === 0 && (
        <div style={styles.emptyContainer}>
          <p style={styles.emptyIcon}>👨‍🍳</p>
          <p style={styles.empty}>Start cooking to get personalized recommendations!</p>
          <button style={styles.startBtn} onClick={() => navigate('/pantry')}>Add Ingredients to Pantry</button>
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
  loadingContainer: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  backBtn: { padding: '8px 16px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' },
  logoutBtn: { padding: '8px 16px', background: '#ff4444', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px' },
  profileCard: { background: 'white', padding: '28px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '24px' },
  avatar: { width: '80px', height: '80px', background: 'linear-gradient(135deg, #ff6b35, #6c63ff)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold', color: 'white', flexShrink: 0 },
  username: { fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' },
  email: { fontSize: '14px', color: '#888', marginBottom: '4px' },
  joined: { fontSize: '13px', color: '#aaa' },
  statsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' },
  statCard: { background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', textAlign: 'center' },
  statNumber: { fontSize: '32px', fontWeight: 'bold', color: '#ff6b35', marginBottom: '4px' },
  statLabel: { fontSize: '14px', color: '#666' },
  section: { marginBottom: '40px' },
  sectionTitle: { fontSize: '20px', fontWeight: 'bold', marginBottom: '4px', color: '#333' },
  sectionSubtitle: { fontSize: '14px', color: '#888', marginBottom: '16px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '20px' },
  recipeCard: { background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', overflow: 'hidden', cursor: 'pointer' },
  recipeImage: { width: '100%', height: '150px', objectFit: 'cover' },
  recipeBody: { padding: '14px' },
  recipeTitle: { fontSize: '14px', fontWeight: 'bold', marginBottom: '6px' },
  recipeMeta: { fontSize: '12px', color: '#666', marginBottom: '8px' },
  recipeTags: { display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' },
  tag: { background: '#f9f5f0', padding: '3px 8px', borderRadius: '20px', fontSize: '11px', color: '#666' },
  viewBtn: { width: '100%', padding: '8px', background: '#ff6b35', color: 'white', border: 'none', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' },
  journalList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  journalItem: { background: 'white', padding: '16px 20px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  journalTitle: { fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' },
  journalDate: { fontSize: '13px', color: '#888' },
  journalRight: { textAlign: 'right' },
  journalStars: { fontSize: '16px' },
  savedList: { display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' },
  savedItem: { flexShrink: 0, width: '150px', cursor: 'pointer' },
  savedImage: { width: '150px', height: '100px', objectFit: 'cover', borderRadius: '10px', marginBottom: '6px' },
  savedTitle: { fontSize: '12px', color: '#444', textAlign: 'center' },
  emptyContainer: { textAlign: 'center', marginTop: '60px' },
  emptyIcon: { fontSize: '64px', marginBottom: '16px' },
  empty: { fontSize: '18px', color: '#888', marginBottom: '24px' },
  startBtn: { padding: '12px 24px', background: '#ff6b35', color: 'white', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' },
};

export default Profile;