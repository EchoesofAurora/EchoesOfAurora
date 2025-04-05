import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/tribeLandingPage.css";

const TribeLandingPage = () => {
  const { tribeId } = useParams();
  const navigate = useNavigate();
  const [tribe, setTribe] = useState(null);
  const [tribeImages, setTribeImages] = useState([]);
  const [activeImage, setActiveImage] = useState(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTribe = async () => {
      try {
        const response = await fetch(`/api/tribes/${tribeId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Tribe data received:", data);
        setTribe(data);
        if (data.images && data.images.length > 0) {
          setTribeImages(data.images);
        }
      } catch (err) {
        console.error("Error fetching tribe:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTribe();
  }, [tribeId]);

  const openGalleryModal = (image) => {
    setActiveImage(image);
    setShowGalleryModal(true);
  };

  const closeGalleryModal = () => {
    setShowGalleryModal(false);
    setActiveImage(null);
  };

  // Get hero image from database or static files
  const getHeroImage = () => {
    console.log("Getting hero image, available images:", tribeImages);
    if (tribeImages && tribeImages.length > 0) {
      console.log("Using image from database:", tribeImages[0]);
      return `data:${tribeImages[0].media_type};base64,${tribeImages[0].image_data}`;
    }
    
    try {
      // Fallback to static image
      console.log("Attempting to load static image for tribeId:", tribeId);
      // Simple approach for testing - use a hardcoded image first
      return require(`../images/tribes/${tribeId}.png`);
    } catch (e) {
      console.error(`Image not found: ${tribeId}.png`, e);
      return null;
    }
  };

  // Get remaining images for gallery
  const getGalleryImages = () => {
    if (tribeImages && tribeImages.length > 1) {
      return tribeImages.slice(1);
    }
    return [];
  };

  // Format references as clickable links if they are URLs
  const formatReferences = (references) => {
    if (!references) return null;
    
    // Check if reference is a URL
    if (references.startsWith('http://') || references.startsWith('https://')) {
      // Extract domain name for display
      let domain = '';
      try {
        domain = new URL(references).hostname.replace('www.', '');
      } catch (e) {
        domain = references;
      }
      
      return (
        <a 
          href={references} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="tribe-landing-reference-link"
        >
          {domain}
        </a>
      );
    }
    
    // If not a URL, just return the text
    return references;
  };

  if (loading) return <div className="user-frontend"><Header /><p>Loading...</p></div>;
  if (error) return <div className="user-frontend"><Header /><p>Error: {error}</p></div>;
  if (!tribe) return <div className="user-frontend"><Header /><p>Tribe not found.</p></div>;

  const galleryImages = getGalleryImages();
  const heroImage = getHeroImage();
  console.log("Hero image URL:", heroImage);

  return (
    <div className="user-frontend">
      <Header />
      
      <div className="tribe-landing-container">
        <Link to="/tribes" className="tribe-landing-back">← Back to Tribes</Link>
        
        {/* Hero Image with Overlay Text */}
        <div className="tribe-landing-hero-container">
          {heroImage ? (
            <>
              <img 
                src={heroImage} 
                alt={tribe.tribe_name} 
                className="tribe-landing-hero-image"
                onError={(e) => {
                  console.error("Failed to load image:", heroImage);
                  e.target.style.display = 'none';
                  // Show placeholder instead
                  e.target.parentNode.classList.add('hero-placeholder');
                }}
              />
              <div className="tribe-landing-hero-overlay">
                <h1 className="tribe-landing-title">{tribe.tribe_name}</h1>
                <div className="tribe-landing-subtitle">
                  {tribe.start_year && tribe.end_year ? `${tribe.start_year} - ${tribe.end_year}` : ''}
                </div>
              </div>
            </>
          ) : (
            <div className="hero-placeholder">
              <h1 className="tribe-landing-title">{tribe.tribe_name}</h1>
              <div className="tribe-landing-subtitle">
                {tribe.start_year && tribe.end_year ? `${tribe.start_year} - ${tribe.end_year}` : ''}
              </div>
            </div>
          )}
        </div>
        
        {/* Tribe Content */}
        <div className="tribe-landing-details">
          <h2>Tribe Details</h2>
          <div className="tribe-landing-text">{tribe.tribe_text}</div>

          {/* References Section */}
          {tribe.tribe_references && (
            <div className="tribe-landing-references">
              <h3>References</h3>
              <div className="reference-container">
                {formatReferences(tribe.tribe_references)}
              </div>
            </div>
          )}
        </div>
        
        {/* Media Gallery - Only shown if there are additional images */}
        {galleryImages.length > 0 && (
          <div className="tribe-landing-gallery">
            <h2>Media Gallery</h2>
            <div className="tribe-landing-grid">
              {galleryImages.map((image, index) => (
                <div 
                  key={index} 
                  className="tribe-landing-item"
                  onClick={() => openGalleryModal(image)}
                >
                  <img
                    src={`data:${image.media_type};base64,${image.image_data}`}
                    alt={`${tribe.tribe_name} - Image ${index + 2}`}
                    className="tribe-landing-gallery-image"
                  />
                  {image.caption && <p className="tribe-landing-caption">{image.caption}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Gallery Modal */}
      {showGalleryModal && activeImage && (
        <div className="tribe-landing-modal">
          <div className="tribe-landing-modal-content">
            <span className="tribe-landing-close" onClick={closeGalleryModal}>&times;</span>
            <img 
              src={`data:${activeImage.media_type};base64,${activeImage.image_data}`} 
              alt="Gallery image" 
              className="tribe-landing-modal-image"
            />
            {activeImage.caption && (
              <p className="tribe-landing-modal-caption">{activeImage.caption}</p>
            )}
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};
 
export default TribeLandingPage;