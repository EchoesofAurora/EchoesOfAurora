import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../styles/timelineSlider.css';

const TimelineSlider = ({ 
  startYear, 
  endYear, 
  yearRange, 
  onRangeChange, 
  isMobile = false 
}) => {
  // Create year markers for the timeline
  const years = [];
  for (let year = startYear; year <= endYear; year += 100) {
    years.push(year);
  }
  // Ensure endYear is included if not already
  if (years[years.length - 1] !== endYear) {
    years.push(endYear);
  }

  // Create marks for the slider
  const midYear1 = Math.round(startYear + (endYear - startYear) * 0.33);
  const midYear2 = Math.round(startYear + (endYear - startYear) * 0.66);
  
  const marks = {
    [startYear]: {
      style: { 
        fontWeight: 'bold',
        fontSize: '10px',
        color: '#333'
      },
      label: startYear
    },
    [midYear1]: {
      style: { 
        fontSize: '10px',
        color: '#555'
      },
      label: midYear1
    },
    [midYear2]: {
      style: { 
        fontSize: '10px',
        color: '#555'
      },
      label: midYear2
    },
    [endYear]: {
      style: { 
        fontWeight: 'bold',
        fontSize: '10px',
        color: '#333'
      },
      label: endYear
    }
  };

  // Handle slider change
  const handleChange = (value) => {
    onRangeChange({
      startYear: value[0],
      endYear: value[1]
    });
  };

  return (
    <div className="timeline-slider-container">
      <div className="timeline-year-labels">
        <div className="timeline-year-label start">
          {yearRange.startYear}
        </div>
        <div className="timeline-year-label end">
          {yearRange.endYear}
        </div>
      </div>
      
      <Slider
        range
        min={startYear}
        max={endYear}
        defaultValue={[yearRange.startYear, yearRange.endYear]}
        value={[yearRange.startYear, yearRange.endYear]}
        onChange={handleChange}
        marks={marks}
      />
      
      <div className="timeline-year-markers">
        {years.map((year) => (
          <span key={year} className="timeline-year-marker">
            {year}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TimelineSlider;