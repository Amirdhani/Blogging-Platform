import React from 'react';
import { ClipLoader } from 'react-spinners';

const Loader = ({ size = 'medium', color = '#3B82F6' }) => {
  const sizeMap = {
    small: 20,
    medium: 40,
    large: 60,
  };

  return (
    <div className="flex justify-center items-center">
      <ClipLoader
        color={color}
        size={sizeMap[size]}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loader;