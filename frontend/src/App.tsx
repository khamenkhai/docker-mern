import { useState, useEffect } from 'react';
import './App.css';

const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/items`;

function App() {
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState('');

  // Fetch all items on load
  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setItems(data);
  };

  const addItem = async () => {
    if (!newItemName) return;
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newItemName }),
    });
    setNewItemName('');
    fetchItems();
  };

  const deleteItem = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchItems();
  };

  const updateItem = async (id) => {
    const newName = prompt("Enter new name:");
    if (!newName) return;
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    });
    fetchItems();
  };

  return (
    <div className="App">
      <h1>🚀 MERN Docker CRUD 2</h1>
      
      <div className="card">
        <input 
          value={newItemName} 
          onChange={(e) => setNewItemName(e.target.value)} 
          placeholder="Enter item name..."
        />
        <button onClick={addItem}>Add Item</button>
      </div>

      <ul>
        {items.map(item => (
          <li key={item._id} style={{ margin: '10px' }}>
            <strong>{item.name}</strong>
            <button onClick={() => updateItem(item._id)} style={{ marginLeft: '10px' }}>Edit</button>
            <button onClick={() => deleteItem(item._id)} style={{ marginLeft: '5px', color: 'red' }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;