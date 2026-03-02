import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) req.headers.Authorization = `Bearer ${token}`;
    return req;
});

export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);

export const getPantryItems = () => API.get('/pantry');
export const addPantryItem = (data) => API.post('/pantry', data);
export const deletePantryItem = (id) => API.delete(`/pantry/${id}`);

export const getRecipeSuggestions = () => API.get('/recipes/suggestions');
export const getRecipeDetails = (id) => API.get(`/recipes/${id}`);
export const saveRecipe = (data) => API.post('/recipes/save', data);
export const getSavedRecipes = () => API.get('/recipes/saved/all');
export const deleteSavedRecipe = (id) => API.delete(`/recipes/saved/${id}`);
export const getJournalEntries = () => API.get('/journal');
export const addJournalEntry = (data) => API.post('/journal', data);
export const deleteJournalEntry = (id) => API.delete(`/journal/${id}`);
export const searchRecipes = (query) => API.get(`/recipes/search?query=${query}`);

export const getShoppingList = () => API.get('/shopping');
export const addShoppingItem = (data) => API.post('/shopping', data);
export const toggleShoppingItem = (id) => API.put(`/shopping/${id}/toggle`);
export const deleteShoppingItem = (id) => API.delete(`/shopping/${id}`);
export const clearCheckedItems = () => API.delete('/shopping/clear');
export const generateShoppingList = () => API.post('/shopping/generate');
export const generateAIRecipe = (data) => API.post('/ai/generate-recipe', data);