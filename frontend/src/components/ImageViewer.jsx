import React from 'react';

const ImageViewer = ({ src, title, description }) => {
  return (
    <div>
      <img src={src} alt={title} className="w-full" />
      <div className="p-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
        {description && (
          <p className="text-gray-600">{description}</p>
        )}
      </div>
    </div>
  );
};

export default ImageViewer;