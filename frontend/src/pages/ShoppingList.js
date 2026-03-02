import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getShoppingList, addShoppingItem, toggleShoppingItem, deleteShoppingItem, clearCheckedItems, generateShoppingList } from '../api';
import toast from 'react-hot-toast';

const ShoppingList = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ ingredient_name: '', amount: '', unit: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data } = await getShoppingList();
      setItems(data);
    } catch (err) {
      toast.error('Failed to load shopping list');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await addShoppingItem(form);
      toast.success('Item added!');
      setForm({ ingredient_name: '', amount: '', unit: '' });
      fetchItems();
    } catch (err) {
      toast.error('Failed to add item');
    }
  };

  const handleToggle = async (id) => {
    try {
      await toggleShoppingItem(id);
      fetchItems();
    } catch (err) {
      toast.error('Failed to update item');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteShoppingItem(id);
      toast.success('Item removed!');
      fetchItems();
    } catch (err) {
      toast.error('Failed to delete item');
    }
  };

  const handleClearChecked = async () => {
    try {
      await clearCheckedItems();
      toast.success('Checked items cleared!');
      fetchItems();
    } catch (err) {
      toast.error('Failed to clear items');
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const { data } = await generateShoppingList();
      toast.success(data.message);
      fetchItems();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate list');
    } finally {
      setLoading(false);
    }
  };

  const uncheckedItems = items.filter(i => !i.is_checked);
  const checkedItems = items.filter(i => i.is_checked);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>← Back</button>
        <h1>🛒 Shopping List</h1>
      </div>

      <div style={styles.topActions}>
        <button style={styles.generateBtn} onClick={handleGenerate} disabled={loading}>
          {loading ? 'Generating...' : '✨ Auto-generate from Pantry'}
        </button>
        {checkedItems.length > 0 && (
          <button style={styles.clearBtn} onClick={handleClearChecked}>
            🗑️ Clear Checked ({checkedItems.length})
          </button>
        )}
      </div>

      <div style={styles.formCard}>
        <h2 style={styles.formTitle}>Add Item Manually</h2>
        <form onSubmit={handleAdd} style={styles.form}>
          <input
            style={styles.input}
            type="text"
            placeholder="Ingredient name"
            value={form.ingredient_name}
            onChange={(e) => setForm({ ...form, ingredient_name: e.target.value })}
            required
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Amount (e.g. 2)"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Unit (e.g. cups)"
            value={form.unit}
            onChange={(e) => setForm({ ...form, unit: e.target.value })}
          />
          <button style={styles.addBtn} type="submit">+ Add</button>
        </form>
      </div>

      {items.length === 0 ? (
        <div style={styles.emptyContainer}>
          <p style={styles.emptyIcon}>🛒</p>
          <p style={styles.empty}>Your shopping list is empty!</p>
          <p style={styles.emptySub}>Click "Auto-generate from Pantry" to add missing ingredients automatically.</p>
        </div>
      ) : (
        <div style={styles.listContainer}>
          {uncheckedItems.length > 0 && (
            <div>
              <h3 style={styles.sectionTitle}>To Buy ({uncheckedItems.length})</h3>
              {uncheckedItems.map((item) => (
                <div key={item.id} style={styles.item}>
                  <input
                    type="checkbox"
                    style={styles.checkbox}
                    checked={false}
                    onChange={() => handleToggle(item.id)}
                  />
                  <span style={styles.itemName}>{item.ingredient_name}</span>
                  {item.amount && <span style={styles.itemAmount}>{item.amount} {item.unit}</span>}
                  <button style={styles.deleteBtn} onClick={() => handleDelete(item.id)}>🗑️</button>
                </div>
              ))}
            </div>
          )}

          {checkedItems.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <h3 style={styles.sectionTitle}>Done ({checkedItems.length})</h3>
              {checkedItems.map((item) => (
                <div key={item.id} style={{ ...styles.item, opacity: 0.5 }}>
                  <input
                    type="checkbox"
                    style={styles.checkbox}
                    checked={true}
                    onChange={() => handleToggle(item.id)}
                  />
                  <span style={{ ...styles.itemName, textDecoration: 'line-through' }}>{item.ingredient_name}</span>
                  {item.amount && <span style={styles.itemAmount}>{item.amount} {item.unit}</span>}
                  <button style={styles.deleteBtn} onClick={() => handleDelete(item.id)}>🗑️</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { minHeight: '100vh', background: '#f9f5f0', padding: '24px' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' },
  backBtn: { padding: '8px 16px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' },
  topActions: { display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' },
  generateBtn: { padding: '12px 24px', background: '#6c63ff', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' },
  clearBtn: { padding: '12px 24px', background: '#ff4444', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' },
  formCard: { background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', maxWidth: '700px', marginBottom: '32px' },
  formTitle: { marginBottom: '16px', color: '#444', fontSize: '16px' },
  form: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  input: { flex: '1', minWidth: '120px', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' },
  addBtn: { padding: '10px 20px', background: '#ff6b35', color: 'white', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' },
  listContainer: { maxWidth: '700px' },
  sectionTitle: { fontSize: '16px', color: '#666', marginBottom: '12px', fontWeight: '600' },
  item: { background: 'white', padding: '14px 16px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' },
  checkbox: { width: '18px', height: '18px', cursor: 'pointer' },
  itemName: { flex: 1, fontSize: '16px', fontWeight: '500' },
  itemAmount: { fontSize: '14px', color: '#888' },
  deleteBtn: { background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer' },
  emptyContainer: { textAlign: 'center', marginTop: '80px' },
  emptyIcon: { fontSize: '64px', marginBottom: '16px' },
  empty: { fontSize: '18px', color: '#888', marginBottom: '8px' },
  emptySub: { fontSize: '14px', color: '#aaa' },
};

export default ShoppingList;