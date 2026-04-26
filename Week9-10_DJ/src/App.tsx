import React from 'react';
import { InventoryProvider } from './context/InventoryContext';
import AppRouter from './router/AppRouter';

const App: React.FC = () => (
  <InventoryProvider>
    <AppRouter />
  </InventoryProvider>
);

export default App;
