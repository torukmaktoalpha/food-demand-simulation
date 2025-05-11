import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const StoreAnalysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Expecting store recommendations to be passed via location.state, else show a prompt
  const { storeRecommendations = [] } = location.state || {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8">
      <header className="sticky top-0 z-10 bg-gray-800/90 backdrop-blur shadow-md py-4 mb-6">
        <h1 className="text-3xl font-extrabold text-center text-white tracking-tight">Supply Store Analysis</h1>
      </header>
      <main className="max-w-4xl mx-auto p-6 bg-gray-800/90 rounded-xl shadow">
        {storeRecommendations.length === 0 ? (
          <div className="text-center text-gray-400">
            No store recommendations available. Run an analysis first!
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {storeRecommendations.map((store, idx) => (
              <div
                key={idx}
                className="p-4 bg-green-900 rounded-lg shadow flex justify-between items-center"
              >
                <div>
                  <p className="font-bold text-white">Store {idx + 1}</p>
                  <p className="text-gray-300">
                    Location: Row <span className="font-mono">{store.row + 1}</span>, Col{' '}
                    <span className="font-mono">{store.col + 1}</span>
                  </p>
                  <p className="text-gray-300">
                    Demand Score: <span className="font-mono">{store.score.toFixed(2)}</span>
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-green-700 text-green-300 font-bold text-xs uppercase">
                  Recommended
                </span>
              </div>
            ))}
          </div>
        )}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg shadow font-semibold"
          >
            Back to Simulation
          </button>
        </div>
      </main>
    </div>
  );
};

export default StoreAnalysis;
