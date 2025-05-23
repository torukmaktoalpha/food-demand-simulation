import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { kmeans } from 'ml-kmeans';

const clusterCardStyles = [
  { bg: 'bg-red-700', text: 'text-red-100', border: 'border-red-500' },
  { bg: 'bg-blue-700', text: 'text-blue-100', border: 'border-blue-500' },
  { bg: 'bg-green-700', text: 'text-green-100', border: 'border-green-500' },
  { bg: 'bg-yellow-700', text: 'text-yellow-100', border: 'border-yellow-500' },
  { bg: 'bg-purple-700', text: 'text-purple-100', border: 'border-purple-500' },
  { bg: 'bg-pink-700', text: 'text-pink-100', border: 'border-pink-500' }
];

const KMeansAnalysis = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { gridData } = location.state || { gridData: [[]] };
  const highDemandCells = gridData[0] || [];
  const [clusters, setClusters] = useState([]);
  const [k, setK] = useState(3);

  const performKMeans = (numClusters) => {
    if (!highDemandCells || highDemandCells.length === 0) {
      console.error('No high demand cells for K-Means analysis');
      return;
    }
    const points = highDemandCells.map(cell => [cell.row, cell.col]);
    if (points.length === 0) {
      console.error('No valid points found for K-Means analysis');
      return;
    }
    const result = kmeans(points, numClusters, { maxIterations: 100 });
    setClusters(result.centroids.map((centroid, idx) => ({
      center: centroid,
      coordinates: [Math.round(centroid[0]), Math.round(centroid[1])],
      size: result.clusters.filter(c => c === idx).length,
      style: clusterCardStyles[idx % clusterCardStyles.length]
    })));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12">
      <div className="flex flex-col w-full max-w-4xl mx-auto px-8 py-12 bg-slate-800/80 backdrop-blur-sm text-gray-100 rounded-xl shadow border border-slate-700">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">K-Means Analysis</h1>
        <div className="mb-8 text-center text-lg text-slate-300">
          <span>
            Clustering <span className="font-bold text-sky-400">{highDemandCells.length}</span> high demand cells to suggest optimal supply store locations.
          </span>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
          <input
            type="number"
            min={1}
            max={Math.max(1, highDemandCells.length)}
            value={k}
            onChange={e => setK(Number(e.target.value))}
            className="w-24 px-3 py-2 border-2 border-sky-500 rounded-lg text-center bg-slate-700 text-sky-300 focus:ring-sky-400 focus:border-sky-400 text-lg font-semibold"
          />
          <button
            onClick={() => performKMeans(k)}
            className="px-8 py-3 bg-sky-600 text-white rounded-lg shadow-md hover:bg-sky-500 active:bg-sky-700 transition-colors duration-150 font-semibold text-base transform hover:scale-105"
          >
            Perform K-Means Analysis
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-8 py-3 bg-slate-600 text-slate-100 rounded-lg shadow-md hover:bg-slate-500 active:bg-slate-700 transition-colors duration-150 font-semibold text-base transform hover:scale-105"
          >
            Back to Simulation
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
          {clusters.length === 0 && (
            <div className="text-center text-slate-400 py-10 text-lg md:col-span-2 xl:col-span-3">No clusters yet. Perform K-Means analysis to see suggested store locations.</div>
          )}
          {clusters.map((cluster, index) => {
            const cardStyle = cluster.style; // Already contains { bg, text, border }
            return (
              <div key={index} className={`rounded-xl shadow-lg overflow-hidden flex flex-col border-2 ${cardStyle.border} transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-[1.03]`}>
                <div className={`p-4 ${cardStyle.bg} flex justify-between items-center`}>
                  <h3 className={`font-bold text-xl ${cardStyle.text}`}>Cluster {index + 1}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs uppercase font-semibold tracking-wider bg-white/20 ${cardStyle.text}`}>
                    Store Suggestion
                  </span>
                </div>
                <div className={`p-6 bg-slate-700/50 flex-grow ${cardStyle.text}`}>
                  <p className="text-slate-300 mb-2">
                    Center: Row <span className={`font-semibold text-sky-300 font-mono`}>{cluster.coordinates[0] + 1}</span>, Col <span className={`font-semibold text-sky-300 font-mono`}>{cluster.coordinates[1] + 1}</span>
                  </p>
                  <p className="text-slate-300">
                    Cluster Size: <span className={`font-semibold text-sky-300 font-mono`}>{cluster.size}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default KMeansAnalysis;
