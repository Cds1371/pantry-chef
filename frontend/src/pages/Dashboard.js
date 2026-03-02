import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.logo}>🍳 PantryChef</h1>
        <div style={styles.userInfo}>
          <span>👋 Hi, {user?.username}!</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div style={styles.grid}>
        <div style={styles.card} onClick={() => navigate('/pantry')}>
          <div style={styles.cardIcon}>🥕</div>
          <h2>My Pantry</h2>
          <p>Manage your ingredients</p>
        </div>
        <div style={styles.card} onClick={() => navigate('/recipes')}>
          <div style={styles.cardIcon}>👨‍🍳</div>
          <h2>Recipe Suggestions</h2>
          <p>Find recipes from your pantry</p>
        </div>
        <div style={styles.card} onClick={() => navigate('/saved')}>
          <div style={styles.cardIcon}>❤️</div>
          <h2>Saved Recipes</h2>
          <p>Your favourite recipes</p>
        </div>
        <div style={styles.card} onClick={() => navigate('/journal')}>
            <div style={styles.cardIcon}>📖</div>
            <h2>Recipe Journal</h2>
            <p>Log your cooking history</p>
        </div>
        <div style={styles.card} onClick={() => navigate('/search')}>
            <div style={styles.cardIcon}>🔍</div>
            <h2>Search Recipes</h2>
            <p>Find any recipe by name</p>
        </div>
        <div style={styles.card} onClick={() => navigate('/shopping')}>
            <div style={styles.cardIcon}>🛒</div>
            <h2>Shopping List</h2>
            <p>Auto-generate missing ingredients</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#f9f5f0', padding: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' },
  logo: { fontSize: '28px' },
  userInfo: { display: 'flex', alignItems: 'center', gap: '16px', fontSize: '16px' },
  logoutBtn: { padding: '8px 16px', background: '#ff6b35', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', maxWidth: '900px', margin: '0 auto' },
  card: { background: 'white', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', cursor: 'pointer', textAlign: 'center', transition: 'transform 0.2s' },
  cardIcon: { fontSize: '48px', marginBottom: '16px' },
};

export default Dashboard;