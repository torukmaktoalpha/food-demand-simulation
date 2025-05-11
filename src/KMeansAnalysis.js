import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { kmeans } from 'ml-kmeans';

const clusterColors = [
  'bg-red-800 text-red-200',
  'bg-blue-800 text-blue-200',
  'bg-green-800 text-green-200',
  'bg-yellow-800 text-yellow-200',
  'bg-purple-800 text-purple-200',
  'bg-pink-800 text-pink-200'
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
      color: clusterColors[idx % clusterColors.length]
    })));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8">
      <div className="flex flex-col w-full max-w-4xl mx-auto px-6 py-8 bg-gray-800/90 text-gray-100 rounded-xl shadow">
        <h1 className="text-3xl font-extrabold mb-4 text-center">K-Means Analysis</h1>
        <div className="mb-4 text-center">
          <span>
            Clustering <b>{highDemandCells.length}</b> high demand cells to suggest optimal supply store locations.
          </span>
        </div>
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
          <input
            type="number"
            min={1}
            max={Math.max(1, highDemandCells.length)}
            value={k}
            onChange={e => setK(Number(e.target.value))}
            className="w-20 px-2 py-1 border rounded text-center bg-gray-700 text-gray-100"
          />
          <button
            onClick={() => performKMeans(k)}
            className="px-6 py-2 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 font-semibold"
          >
            Perform K-Means Analysis
          </button>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-500 font-semibold"
          >
            Back to Simulation
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {clusters.length === 0 && (
            <div className="text-center text-gray-400">No clusters yet. Run K-Means to see results.</div>
          )}
          {clusters.map((cluster, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg shadow flex justify-between items-center ${cluster.color}`}
            >
              <div>
                <p className="font-bold">Cluster {index + 1}</p>
                <p>Center: Row <span className="font-mono">{cluster.coordinates[0] + 1}</span>, Col <span className="font-mono">{cluster.coordinates[1] + 1}</span></p>
                <p>Cluster Size: <span className="font-mono">{cluster.size}</span></p>
              </div>
              <span className={`px-3 py-1 rounded-full font-bold text-xs uppercase ${cluster.color}`}>
                Store Suggestion
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KMeansAnalysis;
