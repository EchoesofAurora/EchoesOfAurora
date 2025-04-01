import React, { useState, useEffect, useRef } from 'react';
import { Range } from 'react-range';
import '../styles/timelineSlider.css';

const TimelineSlider = ({ years, onRangeChange, initialStartYear, initialEndYear }) => {
  // Convert years array to values needed for the range slider
  const minYear = Math.min(...years);
  const maxYear = Math.max(...years);
  
  // State for the current range values (start and end years)
  const [values, setValues] = useState([
    initialStartYear || minYear,
    initialEndYear || maxYear
  ]);
  
  // Reference to the track element for click handling
  const sliderAreaRef = useRef(null);
  
  // Update the parent component when values change
  useEffect(() => {
    if (values.length === 2) {
      onRangeChange(Math.round(values[0]), Math.round(values[1]));
    }
  }, [values, onRangeChange]);

  // Format the year label
  const formatYear = (year) => {
    return year === maxYear ? `${year}` : year;
  };
  
  // Handle clicks on the timeline track (but not on thumbs or markers)
  const handleTrackClick = (e) => {
    // Don't handle the click if it's on a thumb
    if (e.target.closest('.timeline-thumb')) {
      return;
    }
    
    // Don't handle the click if it's on a marker (they have their own handler)
    if (e.target.closest('.timeline-marker')) {
      return;
    }
    
    if (sliderAreaRef.current) {
      // Get the click position relative to the slider area
      const rect = sliderAreaRef.current.getBoundingClientRect();
      const clickPosition = (e.clientX - rect.left) / rect.width;
      
      if (clickPosition >= 0 && clickPosition <= 1) {
        // Calculate the year based on click position
        const clickedYear = Math.round(minYear + clickPosition * (maxYear - minYear));
        
        // Determine which thumb to move (closest to click)
        const distToStart = Math.abs(clickedYear - values[0]);
        const distToEnd = Math.abs(clickedYear - values[1]);
        
        if (distToStart < distToEnd) {
          // Move start thumb if clickedYear is less than end value
          if (clickedYear < values[1]) {
            setValues([clickedYear, values[1]]);
          }
        } else {
          // Move end thumb if clickedYear is greater than start value
          if (clickedYear > values[0]) {
            setValues([values[0], clickedYear]);
          }
        }
      }
    }
  };

  return (
    <div className="timeline-slider-container">
      {/* The range display at the top has been removed */}
      
      <div 
        className="timeline-slider-area"
        onClick={handleTrackClick}
        ref={sliderAreaRef}
      >
        <Range
          step={1}
          min={minYear}
          max={maxYear}
          values={values}
          onChange={(newValues) => setValues(newValues)}
          renderTrack={({ props, children }) => (
            <div
              {...props}
              className="timeline-track"
            >
              {children}
              
              {/* Selected range indicator */}
              <div 
                className="timeline-selected-range"
                style={{
                  left: `${((values[0] - minYear) / (maxYear - minYear)) * 100}%`,
                  width: `${((values[1] - values[0]) / (maxYear - minYear)) * 100}%`
                }}
              />
            </div>
          )}
          renderThumb={({ props, isDragged, index }) => (
            <div
              {...props}
              className={`timeline-thumb ${isDragged ? 'active' : ''} ${index === 0 ? 'start' : 'end'}`}
            >
              <div className="timeline-thumb-label">
                {formatYear(Math.round(values[index]))}
              </div>
            </div>
          )}
        />
        
        {/* Year markers */}
        <div className="timeline-markers">
          {years.map((year) => (
            <div 
              key={year} 
              className="timeline-marker"
              style={{ 
                left: `${((year - minYear) / (maxYear - minYear)) * 100}%` 
              }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent the track click handler from firing
                // Find which thumb is closer to click
                const distToStart = Math.abs(year - values[0]);
                const distToEnd = Math.abs(year - values[1]);
                
                if (distToStart < distToEnd) {
                  setValues([year, values[1]]);
                } else {
                  setValues([values[0], year]);
                }
              }}
            >
              <span className="timeline-marker-label">{year}</span>
            </div>
          ))}
        </div>
        
        {/* Current year ticks - show all decades */}
        <div className="timeline-year-ticks">
          {Array.from({ length: (maxYear - minYear) / 10 + 1 }, (_, i) => minYear + i * 10)
            .filter(year => !years.includes(year))
            .map((year) => (
              <div 
                key={year} 
                className="timeline-year-tick"
                style={{ 
                  left: `${((year - minYear) / (maxYear - minYear)) * 100}%` 
                }}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineSlider;