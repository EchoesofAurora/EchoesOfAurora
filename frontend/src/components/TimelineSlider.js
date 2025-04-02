import React, { useMemo } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import '../styles/timelineSlider.css';

const TimelineSlider = ({ 
  startYear, 
  endYear, 
  yearRange, 
  onRangeChange, 
  isMobile = false,
  // storiesData prop no longer needed
}) => {
  // Create marks for the slider at century intervals
  const marks = {};
  for (let year = Math.ceil(startYear / 100) * 100; year <= endYear; year += 100) {
    if (year >= startYear) {
      marks[year] = {
        style: { 
          fontSize: isMobile ? '9px' : '10px',
          color: '#555'
        },
        label: year
      };
    }
  }
  
  // Always include start and end years as marks
  marks[startYear] = {
    style: { 
      fontWeight: 'bold',
      fontSize: isMobile ? '9px' : '10px',
      color: '#333'
    },
    label: startYear
  };
  
  marks[endYear] = {
    style: { 
      fontWeight: 'bold',
      fontSize: isMobile ? '9px' : '10px',
      color: '#333'
    },
    label: endYear
  };
  
  // Handle slider change
  const handleChange = (value) => {
    onRangeChange({
      startYear: value[0],
      endYear: value[1]
    });
  };
  
  // Handle arrow button clicks
  const handleShiftTimeline = (direction) => {
    const step = 50;
    if (direction === 'left') {
      const newStart = Math.max(startYear, yearRange.startYear - step);
      const newEnd = Math.min(endYear, newStart + (yearRange.endYear - yearRange.startYear));
      onRangeChange({
        startYear: newStart,
        endYear: newEnd
      });
    } else {
      const newEnd = Math.min(endYear, yearRange.endYear + step);
      const newStart = Math.max(startYear, newEnd - (yearRange.endYear - yearRange.startYear));
      onRangeChange({
        startYear: newStart,
        endYear: newEnd
      });
    }
  };
  
  // Log current state for debugging
  console.log('Rendering TimelineSlider with:', { yearRange, startYear, endYear });
  
  return (
    <div className="timeline-slider-container" id="timeline-slider-container">
      <div className="timeline-year-labels">
        <div className="timeline-year-label start">
          {yearRange.startYear}
        </div>
        <div className="timeline-year-label end">
          {yearRange.endYear}
        </div>
      </div>
      
      <div className="slider-container">
        <Slider
          range
          min={startYear}
          max={endYear}
          defaultValue={[yearRange.startYear, yearRange.endYear]}
          value={[yearRange.startYear, yearRange.endYear]}
          onChange={handleChange}
          pushable={50}
          step={1}
          included={true}
          marks={marks}
        />
      </div>
    </div>
  );
};

export default TimelineSlider;