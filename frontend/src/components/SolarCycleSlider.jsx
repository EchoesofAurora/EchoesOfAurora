import React, { useState, useEffect } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../styles/SolarCycleSlider.css'; // Use the new CSS file

const SolarCycleSlider = ({ 
  onCycleChange, 
  isMobile = false,
  initialCycle = [1, 25], // Default to show all solar cycles
}) => {
  // Solar cycles data (cycle number, years, and peak sunspot numbers)
  // Source: SILSO sunspot data from the Royal Observatory of Belgium
  const solarCycles = [
    { cycle: 1, startYear: 1755, endYear: 1766, peakYear: 1761, peakValue: 86.5, description: "First documented cycle" },
    { cycle: 2, startYear: 1766, endYear: 1775, peakYear: 1769, peakValue: 115.8, description: "Higher than average" },
    { cycle: 3, startYear: 1775, endYear: 1784, peakYear: 1778, peakValue: 158.5, description: "Very strong cycle" },
    { cycle: 4, startYear: 1784, endYear: 1798, peakYear: 1788, peakValue: 141.2, description: "Long duration, strong peak" },
    { cycle: 5, startYear: 1798, endYear: 1810, peakYear: 1805, peakValue: 49.2, description: "Weak cycle" },
    { cycle: 6, startYear: 1810, endYear: 1823, peakYear: 1816, peakValue: 48.7, description: "Weak cycle" },
    { cycle: 7, startYear: 1823, endYear: 1833, peakYear: 1829, peakValue: 71.7, description: "Moderate cycle" },
    { cycle: 8, startYear: 1833, endYear: 1843, peakYear: 1837, peakValue: 146.9, description: "Strong cycle" },
    { cycle: 9, startYear: 1843, endYear: 1855, peakYear: 1848, peakValue: 131.6, description: "Strong cycle" },
    { cycle: 10, startYear: 1855, endYear: 1867, peakYear: 1860, peakValue: 97.9, description: "Moderate cycle" },
    { cycle: 11, startYear: 1867, endYear: 1878, peakYear: 1870, peakValue: 140.5, description: "Strong cycle" },
    { cycle: 12, startYear: 1878, endYear: 1890, peakYear: 1883, peakValue: 74.6, description: "Moderate cycle" },
    { cycle: 13, startYear: 1890, endYear: 1902, peakYear: 1894, peakValue: 87.9, description: "Moderate cycle" },
    { cycle: 14, startYear: 1902, endYear: 1913, peakYear: 1906, peakValue: 64.2, description: "Weak cycle" },
    { cycle: 15, startYear: 1913, endYear: 1923, peakYear: 1917, peakValue: 105.4, description: "Moderate cycle" },
    { cycle: 16, startYear: 1923, endYear: 1933, peakYear: 1928, peakValue: 78.1, description: "Moderate cycle" },
    { cycle: 17, startYear: 1933, endYear: 1944, peakYear: 1937, peakValue: 119.2, description: "Strong cycle" },
    { cycle: 18, startYear: 1944, endYear: 1954, peakYear: 1947, peakValue: 151.8, description: "Very strong cycle" },
    { cycle: 19, startYear: 1954, endYear: 1964, peakYear: 1958, peakValue: 201.3, description: "Strongest recorded cycle" },
    { cycle: 20, startYear: 1964, endYear: 1976, peakYear: 1969, peakValue: 110.6, description: "Moderate cycle" },
    { cycle: 21, startYear: 1976, endYear: 1986, peakYear: 1979, peakValue: 164.5, description: "Very strong cycle" },
    { cycle: 22, startYear: 1986, endYear: 1996, peakYear: 1989, peakValue: 158.5, description: "Very strong cycle" },
    { cycle: 23, startYear: 1996, endYear: 2008, peakYear: 2000, peakValue: 120.8, description: "Strong cycle" },
    { cycle: 24, startYear: 2008, endYear: 2019, peakYear: 2014, peakValue: 81.9, description: "Relatively weak cycle" },
    { cycle: 25, startYear: 2019, endYear: new Date().getFullYear(), peakYear: 2024, peakValue: 115.7, description: "Current cycle, predicted moderate-to-strong" } // Current cycle
  ];

  // State for the selected cycle range
  const [cycleRange, setCycleRange] = useState(initialCycle);
  // State for selected cycle details
  const [selectedCycle, setSelectedCycle] = useState(null);
  
  // Convert cycle numbers to actual year ranges when the slider changes
  useEffect(() => {
    if (onCycleChange) {
      const startCycle = solarCycles.find(cycle => cycle.cycle === cycleRange[0]);
      const endCycle = solarCycles.find(cycle => cycle.cycle === cycleRange[1]);
      
      if (startCycle && endCycle) {
        onCycleChange({
          startYear: startCycle.startYear,
          endYear: endCycle.endYear,
          startCycle: cycleRange[0],
          endCycle: cycleRange[1]
        });
      }
    }
  }, [cycleRange, onCycleChange]);

  // Create marks for the slider with each solar cycle
  const marks = {};
  solarCycles.forEach(cycle => {
    // Calculate color intensity based on peak sunspot value
    // 201.3 is the max value (cycle 19)
    const intensity = Math.min(100, Math.round((cycle.peakValue / 201.3) * 100));
    const color = `rgba(255, ${Math.max(0, 200 - intensity * 1.5)}, 0, 0.7)`;
    
    marks[cycle.cycle] = {
      style: {
        fontSize: isMobile ? '9px' : '10px',
        color: '#333',
        transform: 'rotate(-45deg)',
        transformOrigin: 'left',
        marginTop: '5px'
      },
      label: `${cycle.cycle}`,
      props: {
        'data-year-range': `${cycle.startYear}-${cycle.endYear}`,
        'data-peak': cycle.peakValue,
        'data-description': cycle.description,
        'style': {
          backgroundColor: color,
          borderRadius: '50%',
          width: '14px',
          height: '14px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }
      }
    };
  });

  // Handle slider change
  const handleChange = (value) => {
    setCycleRange(value);
  };

  // Get year range for current selection (for display purposes)
  const getYearRangeForSelectedCycles = () => {
    const startCycle = solarCycles.find(cycle => cycle.cycle === cycleRange[0]);
    const endCycle = solarCycles.find(cycle => cycle.cycle === cycleRange[1]);
    
    if (startCycle && endCycle) {
      return `${startCycle.startYear} - ${endCycle.endYear}`;
    }
    return '';
  };

  // Handle hover on a specific cycle mark
  const handleCycleDotHover = (cycleNum) => {
    const cycle = solarCycles.find(c => c.cycle === cycleNum);
    setSelectedCycle(cycle);
  };

  // Generate a small bar chart of peak sunspot activity
  const renderCycleActivityChart = () => {
    const maxPeak = Math.max(...solarCycles.map(c => c.peakValue));
    
    return (
      <div className="cycle-activity-chart">
        {solarCycles.map((cycle) => {
          const height = `${(cycle.peakValue / maxPeak) * 50}px`;
          const isInRange = cycle.cycle >= cycleRange[0] && cycle.cycle <= cycleRange[1];
          const isSelected = selectedCycle && selectedCycle.cycle === cycle.cycle;
          
          return (
            <div 
              key={cycle.cycle}
              className={`cycle-bar ${isInRange ? 'in-range' : ''} ${isSelected ? 'selected' : ''}`}
              style={{ 
                height,
                backgroundColor: isInRange 
                  ? `rgba(255, ${Math.max(0, 200 - (cycle.peakValue / maxPeak) * 150)}, 0, ${isSelected ? 1 : 0.7})` 
                  : '#ccc'
              }}
              onMouseEnter={() => handleCycleDotHover(cycle.cycle)}
              onMouseLeave={() => setSelectedCycle(null)}
              title={`Cycle ${cycle.cycle}: Peak ${cycle.peakValue} sunspots (${cycle.peakYear})`}
            >
              <span className="cycle-number">{cycle.cycle}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="solar-cycle-slider-container" id="solar-cycle-slider-container">
      <div className="timeline-header">
        <h4>Solar Cycles</h4>
        <div className="cycle-year-range">{getYearRangeForSelectedCycles()}</div>
      </div>
      
      {selectedCycle && (
        <div className="cycle-details">
          <h5>Solar Cycle {selectedCycle.cycle}</h5>
          <p>{selectedCycle.startYear} - {selectedCycle.endYear}</p>
          <p>Peak: {selectedCycle.peakValue} sunspots ({selectedCycle.peakYear})</p>
          <p>{selectedCycle.description}</p>
        </div>
      )}
      
      {renderCycleActivityChart()}
      
      <div className="timeline-year-labels">
        <div className="timeline-year-label start">
          Cycle {cycleRange[0]}
        </div>
        <div className="timeline-year-label end">
          Cycle {cycleRange[1]}
        </div>
      </div>
      
      <div className="slider-container">
        <Slider
          range
          min={1}
          max={25}  // Update this as new solar cycles occur
          defaultValue={cycleRange}
          value={cycleRange}
          onChange={handleChange}
          pushable={1}  // Minimum distance between handles
          step={1}
          included={true}
          marks={marks}
          railStyle={{ 
            background: 'linear-gradient(to right, #d9f2ff, #ffca00, #d9f2ff, #ffca00, #d9f2ff, #ffca00)',
            height: 10 
          }}
          trackStyle={[{ backgroundColor: 'rgba(45, 91, 158, 0.5)', height: 10 }]}
          handleStyle={[
            { borderColor: '#2d5b9e', height: 20, width: 20, marginTop: -5 },
            { borderColor: '#2d5b9e', height: 20, width: 20, marginTop: -5 }
          ]}
          dotStyle={{ backgroundColor: '#fff', borderColor: '#2d5b9e' }}
        />
      </div>
      
      <div className="solar-cycle-legend">
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: 'rgba(255, 50, 0, 0.7)' }}></div>
          <span>High Activity</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: 'rgba(255, 150, 0, 0.7)' }}></div>
          <span>Medium Activity</span>
        </div>
        <div className="legend-item">
          <div className="legend-color" style={{ backgroundColor: 'rgba(255, 200, 0, 0.7)' }}></div>
          <span>Low Activity</span>
        </div>
      </div>
    </div>
  );
};

export default SolarCycleSlider;