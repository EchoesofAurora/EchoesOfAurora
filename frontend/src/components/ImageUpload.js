import React, { useState } from "react";
import "../styles/ImageUpload.css"; 

const ImageUpload = ({ onImagesChange }) => {
  const [images, setImages] = useState([]);
  const [expandedImage, setExpandedImage] = useState(null);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter((file) =>
      ["image/jpeg", "image/png"].includes(file.type)
    );

    const imagePreviews = validFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    const updatedImages = [...images, ...imagePreviews];
    setImages(updatedImages);
    onImagesChange(updatedImages); 
  };

  const removeImage = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
    onImagesChange(updatedImages); 
  };

  return (
    <div className="image-uploader-container">
      <label className="custom-file-upload">
        <input
          type="file"
          accept="image/jpeg, image/png"
          multiple
          onChange={handleImageUpload}
          hidden
        />
        Upload Images
      </label>

      <div className="image-grid">
        {images.map((image, index) => (
          <div key={index} className="image-wrapper">
            <img
              src={image.url}
              alt={`Uploaded ${index}`}
              className="image-preview"
              onClick={() => setExpandedImage(image.url)}
            />
            <button className="remove-btn" onClick={() => removeImage(index)}>
              ✕
            </button>
          </div>
        ))}
      </div>

      {expandedImage && (
        <div className="overlay" onClick={() => setExpandedImage(null)}>
          <div className="expanded-image-container">
            <img
              src={expandedImage}
              alt="Expanded"
              className="expanded-image"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on image
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;