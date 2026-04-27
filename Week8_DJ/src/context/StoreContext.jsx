import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { categoryApi, productApi } from '../utils/api.js';


const initialState = {
  categories: [],
  products: [],
  loading: {
    categories: false,
    products: false,
    action: false,
  },
  errors: {},
  notifications: [],
};


function reducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: { ...state.loading, [action.key]: action.value } };

    case 'SET_ERROR':
      return { ...state, errors: { ...state.errors, [action.key]: action.message } };

    case 'CLEAR_ERROR':
      const { [action.key]: _, ...rest } = state.errors;
      return { ...state, errors: rest };

    case 'SET_CATEGORIES':
      return { ...state, categories: action.data };

    case 'SET_PRODUCTS':
      return { ...state, products: action.data };

    case 'ADD_CATEGORY':
      return { ...state, categories: [...state.categories, action.data] };

    case 'UPDATE_CATEGORY':
      return { ...state, categories: state.categories.map(c => c.id === action.data.id ? action.data : c) };

    case 'DELETE_CATEGORY':
      return { ...state, categories: state.categories.filter(c => c.id !== action.id) };

    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.data] };

    case 'UPDATE_PRODUCT':
      return { ...state, products: state.products.map(p => p.id === action.data.id ? action.data : p) };

    case 'DELETE_PRODUCT':
      return { ...state, products: state.products.filter(p => p.id !== action.id) };

    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [...state.notifications, { id: Date.now(), ...action.data }] };

    case 'REMOVE_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.id) };

    default:
      return state;
  }
}


const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const notify = useCallback((message, type = 'success') => {
    const id = Date.now();
    dispatch({ type: 'ADD_NOTIFICATION', data: { id, message, type } });
    setTimeout(() => dispatch({ type: 'REMOVE_NOTIFICATION', id }), 4000);
  }, []);


  const fetchCategories = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', key: 'categories', value: true });
    dispatch({ type: 'CLEAR_ERROR', key: 'categories' });
    try {
      const data = await categoryApi.list();
      dispatch({ type: 'SET_CATEGORIES', data });
    } catch (e) {
      dispatch({ type: 'SET_ERROR', key: 'categories', message: e.message });
    } finally {
      dispatch({ type: 'SET_LOADING', key: 'categories', value: false });
    }
  }, []);

  const createCategory = useCallback(async (data) => {
    dispatch({ type: 'SET_LOADING', key: 'action', value: true });
    dispatch({ type: 'CLEAR_ERROR', key: 'action' });
    try {
      const cat = await categoryApi.create(data);
      dispatch({ type: 'ADD_CATEGORY', data: cat });
      notify(`Category "${cat.name}" created`);
      return cat;
    } catch (e) {
      dispatch({ type: 'SET_ERROR', key: 'action', message: e.message });
      throw e;
    } finally {
      dispatch({ type: 'SET_LOADING', key: 'action', value: false });
    }
  }, [notify]);

  const updateCategory = useCallback(async (id, data) => {
    dispatch({ type: 'SET_LOADING', key: 'action', value: true });
    dispatch({ type: 'CLEAR_ERROR', key: 'action' });
    try {
      const cat = await categoryApi.update(id, data);
      dispatch({ type: 'UPDATE_CATEGORY', data: cat });
      notify(`Category "${cat.name}" updated`);
      return cat;
    } catch (e) {
      dispatch({ type: 'SET_ERROR', key: 'action', message: e.message });
      throw e;
    } finally {
      dispatch({ type: 'SET_LOADING', key: 'action', value: false });
    }
  }, [notify]);

  const deleteCategory = useCallback(async (id) => {
    dispatch({ type: 'SET_LOADING', key: 'action', value: true });
    dispatch({ type: 'CLEAR_ERROR', key: 'action' });
    try {
      await categoryApi.delete(id);
      dispatch({ type: 'DELETE_CATEGORY', id });
      notify('Category deleted', 'success');
    } catch (e) {
      dispatch({ type: 'SET_ERROR', key: 'action', message: e.message });
      throw e;
    } finally {
      dispatch({ type: 'SET_LOADING', key: 'action', value: false });
    }
  }, [notify]);


  const fetchProducts = useCallback(async (categoryId) => {
    dispatch({ type: 'SET_LOADING', key: 'products', value: true });
    dispatch({ type: 'CLEAR_ERROR', key: 'products' });
    try {
      const data = await productApi.list(categoryId);
      dispatch({ type: 'SET_PRODUCTS', data });
    } catch (e) {
      dispatch({ type: 'SET_ERROR', key: 'products', message: e.message });
    } finally {
      dispatch({ type: 'SET_LOADING', key: 'products', value: false });
    }
  }, []);

  const createProduct = useCallback(async (data) => {
    dispatch({ type: 'SET_LOADING', key: 'action', value: true });
    dispatch({ type: 'CLEAR_ERROR', key: 'action' });
    try {
      const prod = await productApi.create(data);
      dispatch({ type: 'ADD_PRODUCT', data: prod });
      notify(`Product "${prod.name}" created`);
      return prod;
    } catch (e) {
      dispatch({ type: 'SET_ERROR', key: 'action', message: e.message });
      throw e;
    } finally {
      dispatch({ type: 'SET_LOADING', key: 'action', value: false });
    }
  }, [notify]);

  const updateProduct = useCallback(async (id, data) => {
    dispatch({ type: 'SET_LOADING', key: 'action', value: true });
    dispatch({ type: 'CLEAR_ERROR', key: 'action' });
    try {
      const prod = await productApi.update(id, data);
      dispatch({ type: 'UPDATE_PRODUCT', data: prod });
      notify(`Product "${prod.name}" updated`);
      return prod;
    } catch (e) {
      dispatch({ type: 'SET_ERROR', key: 'action', message: e.message });
      throw e;
    } finally {
      dispatch({ type: 'SET_LOADING', key: 'action', value: false });
    }
  }, [notify]);

  const deleteProduct = useCallback(async (id) => {
    dispatch({ type: 'SET_LOADING', key: 'action', value: true });
    dispatch({ type: 'CLEAR_ERROR', key: 'action' });
    try {
      await productApi.delete(id);
      dispatch({ type: 'DELETE_PRODUCT', id });
      notify('Product deleted', 'success');
    } catch (e) {
      dispatch({ type: 'SET_ERROR', key: 'action', message: e.message });
      throw e;
    } finally {
      dispatch({ type: 'SET_LOADING', key: 'action', value: false });
    }
  }, [notify]);

  const moveProduct = useCallback(async (id, newCategoryId) => {
    dispatch({ type: 'SET_LOADING', key: 'action', value: true });
    dispatch({ type: 'CLEAR_ERROR', key: 'action' });
    try {
      const prod = await productApi.moveCategory(id, newCategoryId);
      dispatch({ type: 'UPDATE_PRODUCT', data: prod });
      notify(`Product moved successfully`);
      return prod;
    } catch (e) {
      dispatch({ type: 'SET_ERROR', key: 'action', message: e.message });
      throw e;
    } finally {
      dispatch({ type: 'SET_LOADING', key: 'action', value: false });
    }
  }, [notify]);

  const clearError = useCallback((key) => {
    dispatch({ type: 'CLEAR_ERROR', key });
  }, []);

  return (
    <StoreContext.Provider value={{
      ...state,
      fetchCategories, createCategory, updateCategory, deleteCategory,
      fetchProducts, createProduct, updateProduct, deleteProduct, moveProduct,
      clearError, notify,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
};
