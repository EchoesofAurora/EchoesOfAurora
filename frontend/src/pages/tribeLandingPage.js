import React, {useEffect,useState} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/tribeLandingPage.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function TribeLandingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [references, setReferences] = useState([]);
  const [description,setDescription] = useState([]);


  // Retrieve tribe data from location state
  const tribe = location.state?.tribe;

  useEffect(() => {
    const fetchData = async () => {
      const referencesString = tribe.tribe_references; // e.g., "ref1,ref2,ref3"
      const referencesArray = referencesString.split("~"); // Split by delimiter
      setReferences(referencesArray);

      const descriptionString = tribe.tribe_text; // e.g., "desc1,desc2,desc3"
      const descriptionArray = descriptionString.split("\n"); // Split by delimiter
      setDescription(descriptionArray);
    };
    fetchData();
  }, []);

  // Redirect to home if no tribe data is available
  if (!tribe) {
    navigate("/");
    return null;
  }

  return (
    <div className="tribe-landing-page">
      <Header />
      {/* Back Button */}
      <Link to="/tribes">
        <a href="/" className="back-button">
          ← Back
        </a>
      </Link>
      {/* Tribe Title */}
      <h1>{tribe.tribe_name}</h1>

      {/* Hero Image with Placeholder */}
      <div className="hero-image-container">
        {tribe.heroImage ? (
          <img
            src={tribe.heroImage}
            alt={`${tribe.tribe_name} Hero`}
            className="hero-image"
          />
        ) : (
          <div className="hero-placeholder">
            <p>Hero Image Placeholder</p>
          </div>
        )}
      </div>

      {/* Timeline Section */}
      <div className="section">
        <h2>Historical Timeline</h2>
        <p>
          This tribe has historical significance spanning from{" "}
          <strong>{tribe.start_year}</strong> to{" "}
          <strong>{tribe.end_year || new Date().getFullYear()}</strong>.
        </p>
      </div>

      {/* Overview Section */}
      <div className="section">
        <h2>Overview</h2>
        <div className="description-container">
        {description.map((desc, index) => (
          <p key={index}>{desc}</p>
        ))}
      </div>
      </div>

      {/* History Image with Placeholder */}
      <div className="section">
        <h2>History Image</h2>
        <div className="history-image-container">
          {tribe.historyImage ? (
            <img
              src={tribe.historyImage}
              alt="History"
              className="history-image"
            />
          ) : (
            <div className="history-placeholder">
              <p>History Image Placeholder</p>
            </div>
          )}
        </div>
      </div>

      {/* References Section */}
      <div className="section">
        <h2>References</h2>
        {tribe.tribe_references ? (
          <ul>
            {references.map((reference, index) => (
              <li key={index}>
                <a
                  href={reference.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {reference}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p>No references available for this tribe.</p>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default TribeLandingPage;
