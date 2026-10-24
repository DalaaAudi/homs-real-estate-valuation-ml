import React from 'react';
import PricePredictor from './pages/PricePredictor';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <PricePredictor />
      <Toaster position="top-right" />
    </div>
  );
}

export default App;