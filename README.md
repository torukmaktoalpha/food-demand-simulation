# San Francisco Food Demand Simulation

## Project Goal

The goal of this project is to simulate food delivery demand across San Francisco neighborhoods, analyze spatial demand patterns, and suggest optimal supply store (or delivery hub) placements using data-driven clustering techniques.

## Features

- **Dynamic Demand Simulation:**  
  Simulates food order demand across a grid representing San Francisco, with realistic neighborhood effects, time-of-day meal peaks, and random events.

- **Interactive Visualization:**  
  Visualizes demand intensity on a grid, with color gradients indicating low to high demand.

- **Demand Analysis:**  
  Identifies and lists high-demand and low-demand grid cells after simulation.

- **K-Means Clustering:**  
  Performs K-Means clustering on high-demand cells to suggest optimal locations for supply stores or delivery hubs.

- **Modern UI:**  
  Clean, responsive interface with dark mode and gradient backgrounds.

## Usage

1. **Run the Simulation:**  
   Start and stop the simulation to generate demand data.

2. **Analyze Demand:**  
   After simulation, analyze demand patterns to see high and low demand areas.

3. **Cluster Analysis:**  
   Use K-Means clustering to find optimal supply store locations based on high-demand clusters.

## Technologies

- React
- Custom CSS (no Tailwind)
- K-Means clustering (`ml-kmeans`)
- React Router

## How to Run

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the development server:
   ```sh
   npm start
   ```
3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/App.js` - Main simulation and visualization
- `src/ResultsPage.js` - Demand analysis results
- `src/KMeansAnalysis.js` - K-Means clustering and store suggestions
- `src/StoreAnalysis.js` - (Optional) Store recommendation summary
- `src/index.css` - Custom CSS styles

## License

MIT
