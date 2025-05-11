import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const SanFranciscoFoodDemandSimulation = () => {
  const nw = [37.812, -122.524];
  const ne = [37.812, -122.356];
  const sw = [37.703, -122.524];
  const se = [37.703, -122.356];

  const latMin = Math.min(sw[0], se[0]);
  const latMax = Math.max(nw[0], ne[0]);
  const lonMin = Math.min(nw[1], sw[1]);
  const lonMax = Math.max(ne[1], se[1]);

  const nDivisions = 20;
  const [gridData, setGridData] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(20);
  const [neighborhoodNames, setNeighborhoodNames] = useState([]);
  const animationRef = useRef(null);
  const simulationEndTimeRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const neighborhoods = [
      { name: "Marina/Presidio", row: 1, col: 5, influence: 5 },
      { name: "North Beach", row: 2, col: 8, influence: 4 },
      { name: "Financial District", row: 4, col: 9, influence: 6 },
      { name: "Mission", row: 8, col: 10, influence: 7 },
      { name: "SoMa", row: 6, col: 8, influence: 8 },
      { name: "Richmond", row: 3, col: 3, influence: 4 },
      { name: "Sunset", row: 7, col: 2, influence: 3 },
      { name: "Castro", row: 7, col: 7, influence: 5 },
      { name: "Haight-Ashbury", row: 5, col: 5, influence: 6 }
    ];
    setNeighborhoodNames(neighborhoods);
  }, []);

  useEffect(() => {
    initializeGrid();
  }, [neighborhoodNames]);

  const initializeGrid = () => {
    const newGrid = Array(nDivisions - 1).fill().map(() => 
      Array(nDivisions - 1).fill().map(() => ({
        demand: 0.1 + Math.random() * 0.2,
        maxDemand: 0.5 + Math.random() * 0.5,
        growthRate: 0.05 + Math.random() * 0.15,
        decayRate: 0.03 + Math.random() * 0.07,
      }))
    );
    
    neighborhoodNames.forEach(hood => {
      for (let i = 0; i < nDivisions - 1; i++) {
        for (let j = 0; j < nDivisions - 1; j++) {
          const distance = Math.sqrt(Math.pow(i - hood.row, 2) + Math.pow(j - hood.col, 2));
          if (distance < hood.influence) {
            const factor = 1 - (distance / hood.influence);
            newGrid[i][j].demand += factor * 0.3;
            newGrid[i][j].maxDemand += factor * 0.4;
            newGrid[i][j].growthRate += factor * 0.1;
          }
        }
      }
    });
    
    setGridData(newGrid);
  };

  const updateGrid = () => {
    if (!isRunning) return;
    
    setGridData(currentGrid => {
      const newGrid = JSON.parse(JSON.stringify(currentGrid));
      
      const currentTime = Date.now();
      const simulationProgress = 1 - (simulationEndTimeRef.current - currentTime) / (20 * 1000);
      const timeOfDay = (simulationProgress * 2) % 1.0; 
      
      const breakfastPeak = Math.max(0, 1 - Math.abs(timeOfDay - 0.25) * 10);
      const lunchPeak = Math.max(0, 1 - Math.abs(timeOfDay - 0.5) * 10);
      const dinnerPeak = Math.max(0, 1 - Math.abs(timeOfDay - 0.75) * 10);
      const mealTimeFactor = Math.max(breakfastPeak, lunchPeak, dinnerPeak) * 0.5;
      
      for (let i = 0; i < nDivisions - 1; i++) {
        for (let j = 0; j < nDivisions - 1; j++) {
          const cell = newGrid[i][j];
          
          if (Math.random() < 0.3) {
            const randomFactor = Math.random() * 0.2 - 0.1;
            cell.demand += randomFactor;
          }
          
          cell.demand += cell.growthRate * mealTimeFactor;
          
          if (Math.random() < 0.5) {
            cell.demand += cell.growthRate * 0.2;
          } else {
            cell.demand -= cell.decayRate;
          }
          
          const neighbors = getNeighbors(i, j, newGrid);
          const avgNeighborDemand = neighbors.reduce((sum, n) => sum + n.demand, 0) / Math.max(1, neighbors.length);
          if (avgNeighborDemand > cell.demand) {
            cell.demand += cell.growthRate * 0.1;
          }
          
          cell.demand = Math.max(0.1, Math.min(cell.maxDemand, cell.demand));
        }
      }
      
      return newGrid;
    });
  };

  const getNeighbors = (row, col, grid) => {
    const neighbors = [];
    const directions = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
    
    directions.forEach(([dx, dy]) => {
      const newRow = row + dx;
      const newCol = col + dy;
      if (newRow >= 0 && newRow < nDivisions - 1 && newCol >= 0 && newCol < nDivisions - 1) {
        neighbors.push(grid[newRow][newCol]);
      }
    });
    
    return neighbors;
  };

  const toggleSimulation = () => {
    if (isRunning) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      setIsRunning(false);
    } else {
      setTimeRemaining(20);
      simulationEndTimeRef.current = Date.now() + 20 * 1000;
      setIsRunning(true);
    }
  };

  const handleAnalyzeData = () => {
    if (gridData.length === 0) {
      alert('Please run the simulation first to generate data');
      return;
    }
    const highDemand = [];
    const lowDemand = [];
    gridData.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell.demand >= 0.7) {
          highDemand.push({ row: i, col: j, demand: cell.demand });
        } else if (cell.demand <= 0.3) {
          lowDemand.push({ row: i, col: j, demand: cell.demand });
        }
      });
    });
    navigate('/results', { state: { highDemand, lowDemand, gridData } });
  };

  useEffect(() => {
    if (!isRunning) return;

    let lastUpdate = 0;
    const fps = 10;
    const interval = 1000 / fps;

    const animate = (timestamp) => {
      if (!isRunning) return;

      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((simulationEndTimeRef.current - now) / 1000));
      
      setTimeRemaining(remaining);
      
      if (remaining <= 0) {
        setIsRunning(false);
        return;
      }

      if (!lastUpdate || timestamp - lastUpdate >= interval) {
        updateGrid();
        lastUpdate = timestamp;
      }
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning]);

  const getDemandColor = (value) => {
    if (value < 0.2) return '#313695';
    if (value < 0.4) return '#4575b4';
    if (value < 0.6) return '#74add1';
    if (value < 0.8) return '#fdae61';
    if (value < 1.0) return '#f46d43';
    return '#a50026';
  };

  return (
    <div>
      <header>
        <h2>San Francisco Food Order Demand Simulation</h2>
      </header>
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1rem" }}>
        <div className="flex" style={{ gap: 32 }}>
          <div style={{ flex: 1 }}>
            <div className="card" style={{ aspectRatio: '4/3' }}>
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `repeat(${nDivisions - 1}, 1fr)`,
                  gridTemplateRows: `repeat(${nDivisions - 1}, 1fr)`,
                  width: '100%',
                  height: '100%',
                  transform: 'scale(0.85)',
                  transformOrigin: 'center'
                }}
              >
                {gridData.map((row, i) =>
                  row.map((cell, j) => (
                    <div
                      key={`${i}-${j}`}
                      style={{
                        background: getDemandColor(cell.demand),
                        border: '1px solid #444',
                        width: '100%',
                        height: '100%',
                        position: 'relative'
                      }}
                      className="rounded"
                    >
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          opacity: 0,
                          background: 'rgba(0,0,0,0.6)',
                          color: '#fff',
                          fontSize: 12,
                          borderRadius: '0.5rem',
                          transition: 'opacity 0.2s'
                        }}
                        className="cell-tooltip"
                      >
                        {cell.demand.toFixed(2)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 16, marginBottom: 16 }}>
              <button onClick={toggleSimulation} className="button">
                {isRunning ? 'Stop Simulation' : 'Start Simulation'}
              </button>
              <div style={{ fontWeight: 600 }}>
                Time Remaining: <span style={{ fontFamily: 'monospace' }}>{timeRemaining}s</span>
              </div>
              {!isRunning && gridData.length > 0 && (
                <button onClick={handleAnalyzeData} className="button">
                  Analyze Demand Patterns (K-Means)
                </button>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
              <div style={{ width: 32, height: 16, background: 'linear-gradient(to right, #313695, #4575b4)' }} className="rounded"></div>
              <div style={{ width: 32, height: 16, background: 'linear-gradient(to right, #4575b4, #74add1)' }} className="rounded"></div>
              <div style={{ width: 32, height: 16, background: 'linear-gradient(to right, #74add1, #fdae61)' }} className="rounded"></div>
              <div style={{ width: 32, height: 16, background: 'linear-gradient(to right, #fdae61, #f46d43)' }} className="rounded"></div>
              <div style={{ width: 32, height: 16, background: 'linear-gradient(to right, #f46d43, #a50026)' }} className="rounded"></div>
              <span style={{ marginLeft: 8, fontSize: 12, color: '#ccc' }}>Low → High Demand</span>
            </div>
          </div>
          <aside style={{ width: 300 }}>
            <div className="card" style={{ background: "#232526" }}>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>Neighborhoods:</div>
              <div>
                {neighborhoodNames.map((hood, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        marginRight: 8,
                        background: getDemandColor(0.5 + (hood.influence / 10))
                      }}
                    ></div>
                    <span>{hood.name}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 14, color: '#bbb', marginTop: 16 }}>
                <p>This simulation shows food delivery demand across San Francisco neighborhoods.</p>
                <p>Factors affecting demand:</p>
                <ul style={{ marginLeft: 16 }}>
                  <li>Time of day (meal peaks)</li>
                  <li>Neighborhood characteristics</li>
                  <li>Random events</li>
                  <li>Neighboring area influence</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default SanFranciscoFoodDemandSimulation;