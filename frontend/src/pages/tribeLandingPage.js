import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/tribeLandingPage.css";

// Import default image for consistency with tribes page
import defaultTribeImage from "../images/tribes/1.png";
// Import default story image for related stories
import defaultStoryImage from "../images/stories/1.png";

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

  useEffect(() => {
    window.scrollTo(0, 0);
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
    if (tribeImages && tribeImages.length > 0) {
      return `data:${tribeImages[0].media_type};base64,${tribeImages[0].image_data}`;
    }
    
    try {
      // Use consistent tribe-id specific image
      return require(`../images/tribes/${tribeId}.png`);
    } catch (e) {
      console.error(`Image not found for tribe ID: ${tribeId}`);
      return defaultTribeImage;
    }
  };

  // Get image for a story card
  const getStoryImage = (story) => {
    if (story.image_data) {
      return `data:${story.media_type};base64,${story.image_data}`;
    }
    
    try {
      return require(`../images/stories/${story.story_id}.png`);
    } catch (e) {
      // Default image if story specific image is not found
      return defaultStoryImage;
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
    
    // Split the references by comma
    const refArray = references.split(',').map(ref => ref.trim()).filter(ref => ref.length > 0);
    
    return (
      <div className="reference-links">
        {refArray.map((reference, index) => {
          let formattedRef = reference;
          
          // Check if it looks like a URL without http/https prefix
          if (!reference.startsWith('http://') && !reference.startsWith('https://') && 
              (reference.startsWith('www.') || reference.includes('.com') || 
               reference.includes('.org') || reference.includes('.gov') || 
               reference.includes('.edu') || reference.includes('.net'))) {
            formattedRef = 'https://' + reference;
          }
          
          // Check if reference is a URL (either originally or after adding https://)
          if (formattedRef.startsWith('http://') || formattedRef.startsWith('https://')) {
            // Extract domain name for display
            let domain = '';
            try {
              domain = new URL(formattedRef).hostname.replace('www.', '');
            } catch (e) {
              domain = reference; // Use original reference for display if URL parsing fails
            }
            
            return (
              <div key={index} className="reference-link-item">
                <a 
                  href={formattedRef} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="tribe-landing-reference-link"
                >
                  {domain}
                </a>
              </div>
            );
          }
          
          // If not a URL, just return the text
          return <div key={index} className="reference-link-item">{reference}</div>;
        })}
      </div>
    );
  };

  if (loading) return <div className="user-frontend"><Header /><p>Loading...</p></div>;
  if (error) return <div className="user-frontend"><Header /><p>Error: {error}</p></div>;
  if (!tribe) return <div className="user-frontend"><Header /><p>Tribe not found.</p></div>;

  const galleryImages = getGalleryImages();
  const heroImage = getHeroImage();

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
                  console.error("Failed to load tribe hero image");
                  e.target.onerror = null;
                  e.target.src = defaultTribeImage;
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
        
        {/* Related Stories Section */}
        {tribe.relatedStories && tribe.relatedStories.length > 0 && (
          <div className="tribe-related-stories">
            <h2 className="related-stories-title">More Stories from {tribe.tribe_name}</h2>
            <div className="related-stories-grid">
              {tribe.relatedStories.map((story, index) => (
                <div className="related-story-card" key={story.story_id || index}>
                  <img 
                    src={getStoryImage(story)} 
                    alt={story.story_name}
                    className="related-story-image"
                    onError={(e) => {
                      console.error("Failed to load story image");
                      e.target.onerror = null;
                      e.target.src = defaultStoryImage;
                    }}
                  />
                  <div className="related-story-content">
                    <h3 className="related-story-title">{story.story_name}</h3>
                    <p className="related-story-summary">
                      Summary: {story.story_text.length > 120 
                        ? `${story.story_text.substring(0, 120)}...` 
                        : story.story_text}
                    </p>
                    <Link 
                      to={`/story/${story.story_id}`} 
                      className="related-story-link"
                    >
                      Read More
                    </Link>
                  </div>
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