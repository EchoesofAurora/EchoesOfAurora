import Header from '../components/Header'
import Footer from '../components/Footer'
import s1 from '../images/rectangle-33.png'
import s2 from '../images/rectangle-26.png'
import s3 from '../images/rectangle-31.png'
import s4 from '../images/rectangle-32.png'
import line1 from "../images/line-1.svg";
import "../styles/aboutStyle.css"
import e1 from '../images/ellipse-3.png'
import e2 from '../images/ellipse-4.png'
import e3 from '../images/ellipse-5.png'
import c1 from '../images/rectangle-34.png'
import c2 from '../images/rectangle-35.png'
import c3 from '../images/rectangle-36.png'
import c4 from '../images/rectangle-37.png'


const About = () => {
    const stories = [
      {
        description:
          "“Welcome to the Indigenous Stories and Space Weather Platform, where ancient wisdom meets scientific discovery. Our journey began with a fascinating revelation: long before modern technology could track space weather, Indigenous peoples across North America were documenting the dancing lights in the sky through their rich oral traditions and stories.”",
        image: s1, 
      },
      {
        title: "Purpose and Goals",
        description:
          "We aim to preserve indigenous knowledge while educating users about space weather phenomena. By weaving together cultural stories with auroral data, we hope to inspire curiosity and respect for the traditions and insights of indigenous peoples.",
        image: s2, 
      },
      {
        title: "Educational Impact",
        description:
          "Designed with K-12 students and educators in mind, our platform serves as a versatile resource for classroom learning and self-guided exploration, offering engaging content that supports a broad range of educational goals.",
        image: s3, 
      },
      {
        title: "Our platform is specially designed for :",
        description:
          "Our platform is primarily tailored for K-12 students, educators, and the general public. It is an inviting space for anyone interested in learning about the unique relationship between indigenous culture and natural phenomena.",
        image: s4, 
      },
      
    ];
  
    const features = [
      {
        title: "Interactive Map & Timeline",
        description:
          "Explore auroral events across time and location through our dynamic map and timeline. This feature allows users to dive into specific periods and regions, experiencing indigenous stories and significant solar events interactively.",
        image: e1, 
      },
      {
        title: "Indigenous Stories Collection",
        description:
          "Discover a rich collection of stories passed down by indigenous tribes, illuminating their cultural connections to the aurora borealis. Each story offers unique insights into how indigenous communities interpreted these celestial phenomena.",
        image: e2, 
      },
      {
        title: "Historical Space Weather Data",
        description:
          "Gain access to meticulously curated space weather data, capturing historical auroral events and solar weather phenomena. This dataset provides valuable context for understanding past interactions between the Earth and space.",
        image: e3, 
      },
      
    ];
  
    const commitments = [
      {
        title: "Educational Mission",
        description:
          "We are dedicated to fostering a deeper understanding of indigenous heritage and scientific discovery. By combining storytelling with auroral data, our platform supports knowledge sharing and lifelong learning.",
        image: c1, 
      },
      {
        title: "Cultural Preservation",
        description:
          "Our platform respects and preserves the cultural significance of indigenous stories, honoring their role in connecting people with the natural world and celestial phenomena like the aurora borealis.",
        image: c2, 
      },
      {
        title: "Scientific Accuracy",
        description:
          "Every story and dataset is carefully reviewed for accuracy, ensuring the information presented aligns with historical records and scientific data, making this platform a reliable educational resource.",
        image: c3, 
      },
      {
        title: "Ongoing Development",
        description:
          "Our commitment doesn’t stop here. We continue to expand and improve the platform, adding new stories, features, and data sources to enhance the educational experience and accessibility for all.",
        image: c4, 
      },
      
    ];
  
    return (
      <div className="stories-page-container">
          <Header/>
        <div className="hero-section">
          <h1 className="top-heading">About Our Platform</h1>
          <h1 className="hero-title">
            "Bridging Indigenous Knowledge and Scientific Exploration to Educate and Inspire."
          </h1>
          <button className="explore-button">See More</button>
        </div>
  
        <div className="title-In-lines">
          <img className="line" alt="Divider Line" src={line1} />
          <h2 className="text-wrapper-6">Our Story</h2>
          <img className="line" alt="Divider Line" src={line1} />
        </div>
  
        <div className="stories-container"> {stories.map((story, index) => ( <div className={`story-card-func ${index % 2 === 0 ? "image-left" : "image-right"}`} key={index}>
        <img src={story.image} alt={story.title} className="story-img" />
        <div className="story-content">
          <h2 className="story-title">{story.title}</h2>
          <p className="story-description">{story.description}</p>
        </div>
            </div>
          ))}
        </div>
  
  
        <div className="title-In-lines">
          <img className="line" alt="Divider Line" src={line1} />
          <h2 className="text-wrapper-6">What we Offer</h2>
          <img className="line" alt="Divider Line" src={line1} />
        </div>

        <div className="stories-container"> {features.map((feature, index) => ( <div className={`features-card-func ${index % 2 === 0 ? "image-left" : "image-right"}`} key={index}>
        <img src={feature.image} alt={feature.title} className="features-img" />
        <div className="features-content">
          <h2 className="features-title">{feature.title}</h2>
          <p className="features-description">{feature.description}</p>
        </div>
            </div>
          ))}
        </div>
  
        <div className="title-In-lines">
          <img className="line" alt="Divider Line" src={line1} />
          <h2 className="text-wrapper-6">Our Commitment</h2>
          <img className="line" alt="Divider Line" src={line1} />
        </div>
  
        <div className="stories-container"> {commitments.map((commitment, index) => ( <div className={`commitment-card-func ${index % 2 === 0 ? "image-left" : "image-right"}`} key={index}>
        <img src={commitment.image} alt={commitment.title} className="commitment-img" />
        <div className="commitment-content">
          <h2 className="commitment-title">{commitment.title}</h2>
          <p className="commitment-description">{commitment.description}</p>
        </div>
            </div>
          ))}
        </div>
  
  
          <Footer/>
      </div>
    );
  };
  
  export default About;
  
  