import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { highDemand = [], lowDemand = [], gridData = [] } = location.state || {};

  const handleKMeans = () => {
    navigate('/analysis', { state: { gridData: [highDemand] } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8">
      <div className="max-w-3xl mx-auto p-6 bg-gray-800/90 rounded-xl shadow">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-100">Demand Analysis Results</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-700 rounded-xl shadow p-5 border border-red-600">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg text-red-400">High Demand Cells</h3>
              <span className="bg-red-600 text-red-200 px-2 py-1 rounded text-xs font-bold">
                {highDemand.length}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto">
              {highDemand.length === 0 && <span className="text-gray-400">No high demand cells.</span>}
              {highDemand.map((cell, idx) => (
                <div key={idx} className="p-2 bg-red-50 rounded text-sm">
                  Row: <span className="font-mono">{cell.row + 1}</span>, Col: <span className="font-mono">{cell.col + 1}</span>, Demand: <span className="font-mono">{cell.demand.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-700 rounded-xl shadow p-5 border border-blue-600">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg text-blue-400">Low Demand Cells</h3>
              <span className="bg-blue-600 text-blue-200 px-2 py-1 rounded text-xs font-bold">
                {lowDemand.length}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto">
              {lowDemand.length === 0 && <span className="text-gray-400">No low demand cells.</span>}
              {lowDemand.map((cell, idx) => (
                <div key={idx} className="p-2 bg-blue-50 rounded text-sm">
                  Row: <span className="font-mono">{cell.row + 1}</span>, Col: <span className="font-mono">{cell.col + 1}</span>, Demand: <span className="font-mono">{cell.demand.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleKMeans}
            className={`px-6 py-3 rounded-lg font-semibold shadow transition 
              ${highDemand.length === 0 
                ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                : 'bg-blue-700 hover:bg-blue-800 text-white'}`}
            disabled={highDemand.length === 0}
          >
            {highDemand.length === 0 ? 'No High Demand to Analyze' : 'Perform K-Means on High Demand Cells'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
