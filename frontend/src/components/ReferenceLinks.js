import React, { useState } from "react";
import "../styles/ReferenceLinks.css";

const ReferenceLinks = ({ initialLinks = "", onChange }) => {
  // Parse initial links from comma-separated string or use empty array
  const [links, setLinks] = useState(() => {
    if (!initialLinks) return [{ value: "" }];
    return initialLinks.split(",").map(link => ({ value: link.trim() }));
  });

  // Add a new empty link field
  const addLinkField = () => {
    setLinks([...links, { value: "" }]);
  };

  // Remove a link field at specified index
  const removeLinkField = (index) => {
    if (links.length === 1) {
      // If it's the last field, just clear it instead of removing
      const updatedLinks = [...links];
      updatedLinks[0].value = "";
      setLinks(updatedLinks);
    } else {
      const updatedLinks = links.filter((_, i) => i !== index);
      setLinks(updatedLinks);
      
      // Update parent component with new links
      const linkString = updatedLinks.map(link => link.value).filter(Boolean).join(", ");
      onChange(linkString);
    }
  };

  // Handle input change for a specific field
  const handleInputChange = (index, event) => {
    const { value } = event.target;
    const updatedLinks = [...links];
    updatedLinks[index].value = value;
    setLinks(updatedLinks);
    
    // Update parent component with new links
    const linkString = updatedLinks.map(link => link.value).filter(Boolean).join(", ");
    onChange(linkString);
  };

  return (
    <div className="reference-links-container">
      {links.map((link, index) => (
        <div key={index} className="reference-link-field">
          <input
            type="text"
            value={link.value}
            onChange={(e) => handleInputChange(index, e)}
            placeholder="Enter reference link"
            className="reference-link-input"
          />
          <button
            type="button"
            onClick={() => removeLinkField(index)}
            className="reference-link-button remove"
            aria-label="Remove reference link"
          >
            -
          </button>
          {index === links.length - 1 && (
            <button
              type="button"
              onClick={addLinkField}
              className="reference-link-button add"
              aria-label="Add reference link"
            >
              +
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReferenceLinks;