import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getJournalEntries, addJournalEntry, deleteJournalEntry } from '../api';
import toast from 'react-hot-toast';

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ recipe_title: '', cooked_on: '', rating: 5, notes: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const { data } = await getJournalEntries();
      setEntries(data);
    } catch (err) {
      toast.error('Failed to load journal entries');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addJournalEntry({ ...form, recipe_id: Date.now().toString() });
      toast.success('Journal entry added!');
      setForm({ recipe_title: '', cooked_on: '', rating: 5, notes: '' });
      setShowForm(false);
      fetchEntries();
    } catch (err) {
      toast.error('Failed to add entry');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteJournalEntry(id);
      toast.success('Entry deleted!');
      fetchEntries();
    } catch (err) {
      toast.error('Failed to delete entry');
    }
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Back</button>
        <h1>📖 Recipe Journal</h1>
        <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Entry'}
        </button>
      </div>

      {showForm && (
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Log a Recipe</h2>
          <form onSubmit={handleAdd}>
            <input
              style={styles.input}
              type="text"
              placeholder="Recipe name"
              value={form.recipe_title}
              onChange={(e) => setForm({ ...form, recipe_title: e.target.value })}
              required
            />
            <input
              style={styles.input}
              type="date"
              value={form.cooked_on}
              onChange={(e) => setForm({ ...form, cooked_on: e.target.value })}
              required
            />
            <div style={styles.ratingContainer}>
              <label style={styles.ratingLabel}>Rating: </label>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  style={{ fontSize: '28px', cursor: 'pointer', opacity: form.rating >= star ? 1 : 0.3 }}
                  onClick={() => setForm({ ...form, rating: star })}
                >
                  ⭐
                </span>
              ))}
            </div>
            <textarea
              style={styles.textarea}
              placeholder="Notes (how did it go? any changes you made?)"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={4}
            />
            <button style={styles.submitBtn} type="submit">Save Entry</button>
          </form>
        </div>
      )}

      {entries.length === 0 ? (
        <div style={styles.emptyContainer}>
          <p style={styles.emptyIcon}>📖</p>
          <p style={styles.empty}>No journal entries yet. Start logging your cooking!</p>
          <button style={styles.addBtn} onClick={() => setShowForm(true)}>+ Add First Entry</button>
        </div>
      ) : (
        <div style={styles.grid}>
          {entries.map((entry) => (
            <div key={entry.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <h3 style={styles.recipeTitle}>{entry.recipe_title}</h3>
                <button style={styles.deleteBtn} onClick={() => handleDelete(entry.id)}>🗑️</button>
              </div>
              <p style={styles.stars}>{renderStars(entry.rating)}</p>
              <p style={styles.date}>🗓️ {new Date(entry.cooked_on).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              {entry.notes && <p style={styles.notes}>📝 {entry.notes}</p>}
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
  addBtn: { padding: '10px 20px', background: '#ff6b35', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', marginLeft: 'auto' },
  formCard: { background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', maxWidth: '600px', marginBottom: '32px' },
  formTitle: { marginBottom: '16px', color: '#444' },
  input: { width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', display: 'block' },
  ratingContainer: { display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px' },
  ratingLabel: { fontSize: '14px', color: '#666', marginRight: '8px' },
  textarea: { width: '100%', padding: '12px', marginBottom: '16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', display: 'block', resize: 'vertical' },
  submitBtn: { padding: '12px 24px', background: '#ff6b35', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' },
  emptyContainer: { textAlign: 'center', marginTop: '80px' },
  emptyIcon: { fontSize: '64px', marginBottom: '16px' },
  empty: { fontSize: '18px', color: '#888', marginBottom: '24px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' },
  card: { background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' },
  recipeTitle: { fontSize: '18px', fontWeight: 'bold', color: '#333' },
  deleteBtn: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' },
  stars: { fontSize: '20px', marginBottom: '8px' },
  date: { fontSize: '14px', color: '#888', marginBottom: '8px' },
  notes: { fontSize: '14px', color: '#555', background: '#f9f5f0', padding: '10px', borderRadius: '8px', marginTop: '8px' },
};

export default Journal;