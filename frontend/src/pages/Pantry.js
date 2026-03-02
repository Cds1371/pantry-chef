import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPantryItems, addPantryItem, deletePantryItem } from '../api';
import toast from 'react-hot-toast';

const Pantry = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ ingredient_name: '', quantity: '', unit: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data } = await getPantryItems();
      setItems(data);
    } catch (err) {
      toast.error('Failed to load pantry items');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addPantryItem(form);
      toast.success('Item added!');
      setForm({ ingredient_name: '', quantity: '', unit: '' });
      fetchItems();
    } catch (err) {
      toast.error('Failed to add item');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePantryItem(id);
      toast.success('Item removed!');
      fetchItems();
    } catch (err) {
      toast.error('Failed to delete item');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Back</button>
        <h1>🥕 My Pantry</h1>
      </div>

      <div style={styles.formCard}>
        <h2 style={styles.formTitle}>Add Ingredient</h2>
        <form onSubmit={handleAdd} style={styles.form}>
          <input
            style={styles.input}
            type="text"
            placeholder="Ingredient name (e.g. Chicken)"
            value={form.ingredient_name}
            onChange={(e) => setForm({ ...form, ingredient_name: e.target.value })}
            required
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Quantity (e.g. 2)"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Unit (e.g. lbs, cups)"
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
          />
          <button style={styles.addBtn} type="submit">Add Item</button>
        </form>
      </div>

      <div style={styles.itemsGrid}>
        {items.length === 0 ? (
          <p style={styles.empty}>Your pantry is empty! Add some ingredients above.</p>
        ) : (
          items.map((item) => (
            <div key={item.id} style={styles.itemCard}>
              <div>
                <h3 style={styles.itemName}>{item.ingredient_name}</h3>
                <p style={styles.itemDetails}>{item.quantity} {item.unit}</p>
              </div>
              <button style={styles.deleteBtn} onClick={() => handleDelete(item.id)}>🗑️</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#f9f5f0', padding: '24px' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' },
  backBtn: { padding: '8px 16px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' },
  formCard: { background: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', maxWidth: '600px', marginBottom: '32px' },
  formTitle: { marginBottom: '16px', color: '#444' },
  form: { display: 'flex', flexWrap: 'wrap', gap: '12px' },
  input: { flex: '1', minWidth: '150px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' },
  addBtn: { padding: '10px 24px', background: '#ff6b35', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' },
  itemsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', maxWidth: '900px' },
  itemCard: { background: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  itemName: { fontSize: '16px', fontWeight: 'bold', marginBottom: '4px' },
  itemDetails: { fontSize: '14px', color: '#888' },
  deleteBtn: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' },
  empty: { color: '#888', fontSize: '16px' }
};

export default Pantry;