import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/StoryLandingPage.css"; 

const StoryLandingPage = () => {
  const { storyId } = useParams();
    const navigate = useNavigate();
  
  const [story, setStory] = useState(null);
  const [tribes, setTribes] = useState([]);
  const [activeImage, setActiveImage] = useState(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await fetch(`/api/stories/${storyId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setStory(data);
      } catch (err) {
        console.error("Error fetching story:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchTribes = async () => {
      try {
        const response = await fetch("/api/tribes");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setTribes(data);
      } catch (error) {
        console.error("Error fetching tribes:", error);
      }
    };

    fetchStory();
    fetchTribes();
  }, [storyId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [storyId]);

  const getTribeName = (tribeId) => {
    const tribe = tribes.find(t => t.tribe_id === tribeId);
    return tribe ? tribe.tribe_name : "";
  };

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
    if (story?.images && story.images.length > 0) {
      return `data:${story.images[0].media_type};base64,${story.images[0].image_data}`;
    }
    
    try {
      const imagesContext = require.context("../images/stories", false, /\.png$/);
      return imagesContext(`./${storyId}.png`);
    } catch (e) {
      console.error(`Image not found: ${storyId}.png`);
      return null;
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
      try {
        return require('../images/stories/1.png');
      } catch (e) {
        return null;
      }
    }
  };

  // Get remaining images for gallery
  const getGalleryImages = () => {
    if (story?.images && story.images.length > 1) {
      return story.images.slice(1);
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
                  className="story-landing-reference-link"
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
  if (!story) return <div className="user-frontend"><Header /><p>Story not found.</p></div>;

  const galleryImages = getGalleryImages();
  const tribeName = story.tribeName || getTribeName(story.tribe_id);
  const heroImage = getHeroImage();

  return (
    <div className="user-frontend">
      <Header />
      
      <div className="story-landing-container">
        <Link to="/stories" className="story-landing-back" onClick={() => navigate(-1)}>← Back</Link>
        
        {/* Hero Image with Overlay Text */}
        <div className="story-landing-hero-container">
          {heroImage ? (
            <>
              <img 
                src={heroImage} 
                alt={story.story_name} 
                className="story-landing-hero-image"
              />
              <div className="story-landing-hero-overlay">
                <h1 className="story-landing-title">{story.story_name}</h1>
                <div className="story-landing-subtitle">{tribeName} | {story.story_year}</div>
              </div>
            </>
          ) : (
            <div className="hero-placeholder">
              <h1 className="story-landing-title">{story.story_name}</h1>
              <div className="story-landing-subtitle">{tribeName} | {story.story_year}</div>
            </div>
          )}
        </div>
        
        {/* Story Content */}
        <div className="story-landing-details">
          <h2>Story Details</h2>
          <div className="story-landing-text">{story.story_text}</div>
          
          {/* References Section */}
          {story.story_references && (
            <div className="story-landing-references">
              <h3>References</h3>
              <div className="reference-container">
                {formatReferences(story.story_references)}
              </div>
            </div>
          )}
        </div>
        
        {/* Media Gallery - Only shown if there are additional images */}
        {galleryImages.length > 0 && (
          <div className="story-landing-gallery">
            <h2>Media Gallery</h2>
            <div className="story-landing-grid">
              {galleryImages.map((image, index) => (
                <div 
                  key={index} 
                  className="story-landing-item"
                  onClick={() => openGalleryModal(image)}
                >
                  <img
                    src={`data:${image.media_type};base64,${image.image_data}`}
                    alt={`${story.story_name} - Image ${index + 2}`}
                    className="story-landing-gallery-image"
                  />
                  {image.caption && <p className="story-landing-caption">{image.caption}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Related Stories Section */}
        {story.relatedStories && story.relatedStories.length > 0 && (
          <div className="story-related-stories">
            <h2 className="related-stories-title">More Stories from {tribeName}</h2>
            <div className="related-stories-grid">
              {story.relatedStories.map((relStory, index) => (
                <div className="related-story-card" key={index}>
                  <img 
                    src={getStoryImage(relStory)} 
                    alt={relStory.story_name}
                    className="related-story-image"
                    onError={(e) => {
                      console.error("Failed to load story image");
                      e.target.onerror = null;
                      try {
                        e.target.src = require('../images/stories/1.png');
                      } catch (err) {
                        e.target.style.display = 'none';
                      }
                    }}
                  />
                  <div className="related-story-content">
                    <h3 className="related-story-title">{relStory.story_name}</h3>
                    <p className="related-story-summary">
                      Summary: {relStory.story_text.length > 120 
                        ? `${relStory.story_text.substring(0, 120)}...` 
                        : relStory.story_text}
                    </p>
                    <Link 
                      to={`/story/${relStory.story_id}`} 
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
        <div className="story-landing-modal">
          <div className="story-landing-modal-content">
            <span className="story-landing-close" onClick={closeGalleryModal}>&times;</span>
            <img 
              src={`data:${activeImage.media_type};base64,${activeImage.image_data}`} 
              alt="Gallery image" 
              className="story-landing-modal-image"
            />
            {activeImage.caption && (
              <p className="story-landing-modal-caption">{activeImage.caption}</p>
            )}
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default StoryLandingPage;