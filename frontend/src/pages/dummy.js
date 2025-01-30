import React from "react";
import auroraNameWithLogo1 from "../images/aurora-name-with-logo-1.png";
import bookmark from "../images/bookmark.svg";
import category from "../images/category.svg";
import ellipse8692 from "../images/ellipse-869-2.png";
import ellipse8693 from "../images/ellipse-869-3.png";
import ellipse869 from "../images/ellipse-869.png";
import frame2 from "../images/frame-2.svg";
import frame3 from "../images/frame-3.svg";
import frame from "../images/frame.svg";
import iconLeftWrapper from "../images/icon-left-wrapper.svg";
import icon from "../images/icon.svg";
import image2 from "../images/image-2.svg";
import image from "../images/image.png";
import image1 from "../images/image-1.svg";
import mail from "../images/mail.svg";
import people from "../images/people.svg";
import settings from "../images/settings.svg";
import "../styles/style.css"

const Dashboard = () => {
  return (
    <main className="dashboard">
      <header className="admin-navbar-home">
        <div className="header">
          <div className="frame-19">
            <div className="WF-button">
              <img
                className="icon-left-wrapper"
                alt="Icon left wrapper"
                src={iconLeftWrapper}
              />
              <span className="label">Lynn</span>
              <img className="icon" alt="Icon" src={icon} />
            </div>
          </div>
          <div className="overlap-group-4">
            <img className="frame-20" alt="Frame" src={frame3} />
            <img className="frame-21" alt="Frame" src={frame} />
          </div>
          <div className="overlap-2">
            <img className="frame-22" alt="Frame" src={image1} />
            <img className="frame-23" alt="Frame" src={frame2} />
          </div>
          <div className="logo">
            <img
              className="aurora-name-with"
              alt="Aurora name with"
              src={auroraNameWithLogo1}
            />
          </div>
        </div>
      </header>
      <section className="content">
        <aside className="sidebar">
          <nav className="menu">
            <ul>
              <li>
                <img src={category} alt="Dashboard" />
                <span>Dashboard</span>
              </li>
              <li>
                <img src={bookmark} alt="Manage Stories" />
                <span>Manage Stories</span>
              </li>
              <li>
                <img src={people} alt="Manage Tribes" />
                <span>Manage Tribes</span>
              </li>
              <li>
                <img src={image2} alt="Media Library" />
                <span>Media Library</span>
              </li>
              <li>
                <img src={mail} alt="User Submissions" />
                <span>User Submissions</span>
              </li>
              <li>
                <img src={settings} alt="Settings" />
                <span>Settings</span>
              </li>
            </ul>
          </nav>
        </aside>
        <section className="main-content">
          <div className="stats">
            <div className="stat">
              <h3>500</h3>
              <p>Total Tribes</p>
            </div>
            <div className="stat">
              <h3>1400</h3>
              <p>Total Stories</p>
            </div>
            <div className="stat">
              <h3>85</h3>
              <p>Total Locations</p>
            </div>
            <div className="stat">
              <h3>60</h3>
              <p>Total Messages</p>
            </div>
            <div className="stat">
              <h3>40</h3>
              <p>Unread Messages</p>
            </div>
          </div>
          <div className="recent">
            <div className="recent-messages">
              <h4>Recent Messages</h4>
              <ul>
                <li>
                  <img src={ellipse869} alt="Talan Mango" />
                  <span>Talan Mango</span>
                </li>
                <li>
                  <img src={ellipse8693} alt="Craig Baptista" />
                  <span>Craig Baptista</span>
                </li>
                <li>
                  <img src={image} alt="Alfonso Schleifer" />
                  <span>Alfonso Schleifer</span>
                </li>
                <li>
                  <img src={ellipse8692} alt="Zaire Passaquindici" />
                  <span>Zaire Passaquindici</span>
                </li>
              </ul>
            </div>
            <div className="recent-stories">
              <h4>Recent Stories</h4>
              <table>
                <thead>
                  <tr>
                    <th>Story ID</th>
                    <th>Tribe</th>
                    <th>Timeline</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>#123</td>
                    <td>
                      <a
                        href="https://www.legendsofamerica.com/tribe-summary-a/#Ababco"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Ababco
                      </a>
                    </td>
                    <td>1600s</td>
                    <td>Editing</td>
                  </tr>
                  <tr>
                    <td>#122</td>
                    <td>
                      <a
                        href="https://www.legendsofamerica.com/tribe-summary-a/#Allakaweah"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Allakaweah
                      </a>
                    </td>
                    <td>1500s</td>
                    <td>Published</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </section>
      <footer className="footer">
        <p>© 2024 All rights reserved.</p>
        <nav>
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </nav>
      </footer>
    </main>
  );
};

export default Dashboard;













/////////////////////////// most important one //////////////////



import React from "react";
import auroraNameWithLogo1 from "../images/aurora-name-with-logo-1.png";
import bookmark from "../images/bookmark.svg";
import category from "../images/category.svg";
import ellipse8692 from "../images/ellipse-869-2.png";
import ellipse8693 from "../images/ellipse-869-3.png";
import ellipse869 from "../images/ellipse-869.png";
import frame2 from "../images/frame-2.svg";
import frame3 from "../images/frame-3.svg";
import frame from "../images/frame.svg";
import iconLeftWrapper from "../images/icon-left-wrapper.svg";
import icon from "../images/icon.svg";
import image2 from "../images/image-2.svg";
import image from "../images/image.png";
import image1 from "../images/image-1.svg";
import mail from "../images/mail.svg";
import people from "../images/people.svg";
import settings from "../images/settings.svg";
import "../styles/Dashboard.css";
import vector145 from "../images/vector-145.svg";
import vector148 from "../images/vector-148.svg";
import vector155 from "../images/vector-155.svg";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="div">
        <div className="overlap">
          <div className="overlap-group">
            <img className="vector" alt="Vector" src={vector145} />

            <img className="img" alt="Vector" src={vector148} />
          </div>

          <div className="frame">
            <div className="frame-2">
              <div className="rectangle" />

              <div className="frame-3">
                <img className="img-2" alt="Category" src={category} />

                <div className="text-wrapper">Dashboard</div>
              </div>
            </div>

            <div className="frame-2">
              <div className="rectangle-2" />

              <div className="frame-4">
                <img className="img-2" alt="Bookmark" src={bookmark} />

                <div className="text-wrapper-2">Manage Stories</div>
              </div>
            </div>

            <div className="frame-2">
              <div className="rectangle-2" />

              <div className="frame-4">
                <img className="img-2" alt="People" src={people} />

                <div className="text-wrapper-3">Manage Tribes</div>
              </div>
            </div>

            <div className="frame-2">
              <div className="rectangle-2" />

              <div className="frame-4">
                <img className="img-2" alt="Image" src={image2} />

                <div className="text-wrapper-4">Media Library</div>
              </div>
            </div>

            <div className="frame-2">
              <div className="rectangle-2" />

              <div className="frame-4">
                <img className="img-2" alt="Mail" src={mail} />

                <div className="text-wrapper-4">User Submissions</div>
              </div>
            </div>

            <div className="frame-2">
              <div className="rectangle-2" />

              <div className="frame-4">
                <img className="img-2" alt="Settings" src={settings} />

                <div className="text-wrapper-4">Settings</div>
              </div>
            </div>
          </div>

          <div className="frame-5">
            <div className="frame-6">
              <div className="group">
                <div className="overlap-group-2">
                  <div className="title">500</div>

                  <div className="title-2">Total Tribes</div>
                </div>
              </div>

              <div className="group">
                <div className="overlap-group-2">
                  <div className="title-3">1400</div>

                  <div className="title-4">Total Stories</div>
                </div>
              </div>

              <div className="group">
                <div className="overlap-group-2">
                  <div className="title-5">85</div>

                  <div className="title-2">Total Location</div>
                </div>
              </div>

              <div className="group">
                <div className="overlap-group-2">
                  <div className="title-6">60</div>

                  <div className="title-2">Total Messages</div>
                </div>
              </div>

              <div className="overlap-wrapper">
                <div className="overlap-group-2">
                  <div className="title-5">40</div>

                  <div className="title-7">unread&nbsp;&nbsp;Messages</div>
                </div>
              </div>
            </div>

            <div className="frame-7">
              <div className="overlap-group-wrapper">
                <div className="overlap-group-3">
                  <div className="title-8">500</div>

                  <div className="title-9">Pending Stories</div>

                  <div className="title-10">View</div>
                </div>
              </div>

              <div className="div-wrapper">
                <div className="overlap-group-3">
                  <div className="title-11">20</div>

                  <div className="title-12">Published Stories</div>

                  <div className="title-10">View</div>
                </div>
              </div>
            </div>
          </div>

          <div className="section-thank-you">
            <div className="text-wrapper-5">Recent Messages</div>

            <div className="frame-wrapper">
              <div className="frame-8">
                <img className="ellipse" alt="Ellipse" src={ellipse869} />

                <div className="text-wrapper-6">Talan Mango</div>
              </div>
            </div>

            <div className="frame-9">
              <div className="frame-8">
                <img className="ellipse" alt="Ellipse" src={ellipse8693} />

                <div className="text-wrapper-6">Craig Baptista</div>
              </div>
            </div>

            <div className="frame-10">
              <div className="frame-8">
                <img className="ellipse" alt="Ellipse" src={image} />

                <div className="text-wrapper-6">Alfonso Schleifer</div>
              </div>
            </div>

            <div className="frame-11">
              <div className="frame-8">
                <img className="ellipse" alt="Ellipse" src={ellipse8692} />

                <div className="text-wrapper-6">Zaire Passaquindici</div>
              </div>
            </div>

            <div className="frame-12">
              <div className="frame-8">
                <img className="ellipse" alt="Ellipse" src={ellipse8692} />

                <div className="text-wrapper-6">Zaire Passaquindici</div>
              </div>
            </div>

            <div className="frame-13">
              <div className="frame-8">
                <img className="ellipse" alt="Ellipse" src={ellipse8692} />

                <div className="text-wrapper-6">Zaire Passaquindici</div>
              </div>
            </div>

            <div className="frame-14">
              <div className="frame-8">
                <img className="ellipse" alt="Ellipse" src={ellipse8692} />

                <div className="text-wrapper-6">Zaire Passaquindici</div>
              </div>
            </div>

            <div className="frame-15">
              <div className="frame-8">
                <img className="ellipse" alt="Ellipse" src={ellipse8692} />

                <div className="text-wrapper-6">Zaire Passaquindici</div>
              </div>
            </div>
          </div>

          <div className="frame-16">
            <div className="frame-17">
              <div className="frame-18">
                <div className="table-head">
                  <div className="head">Story ID</div>
                </div>

                <div className="table-head-2">
                  <div className="head">Tribe</div>
                </div>

                <div className="table-head-3">
                  <div className="head">Timeline</div>
                </div>

                <div className="table-head-4">
                  <div className="head-2">Status</div>
                </div>
              </div>
            </div>

            <img className="vector-2" alt="Vector" src={vector155} />

            <img className="vector-3" alt="Vector" src={vector155} />

            <img className="vector-4" alt="Vector" src={vector155} />

            <img className="vector-5" alt="Vector" src={vector155} />

            <img className="vector-6" alt="Vector" src={vector155} />

            <img className="vector-7" alt="Vector" src={vector155} />

            <img className="vector-8" alt="Vector" src={vector155} />

            <div className="text-wrapper-7">Recent stories</div>

            <div className="group-2">
              <div className="head-3">#123</div>

              <a
                className="head-4"
                href="https://www.legendsofamerica.com/tribe-summary-a/#Ababco"
                rel="noopener noreferrer"
                target="_blank"
              >
                Ababco
              </a>

              <div className="head-5">1600s</div>

              <div className="table-head-5">
                <div className="head-6">Editing</div>
              </div>
            </div>

            <div className="group-3">
              <div className="head-3">#122</div>

              <a
                className="head-4"
                href="https://www.legendsofamerica.com/tribe-summary-a/#Allakaweah"
                rel="noopener noreferrer"
                target="_blank"
              >
                Allakaweah
              </a>

              <div className="head-5">1500s</div>

              <div className="table-head-6">
                <div className="head-7">published</div>
              </div>
            </div>

            <div className="group-4">
              <div className="head-3">#121</div>

              <a
                className="head-4"
                href="https://www.legendsofamerica.com/na-blackfoot/"
                rel="noopener noreferrer"
                target="_blank"
              >
                Blackfeet
              </a>

              <div className="head-5">1750s</div>

              <div className="table-head-6">
                <div className="head-7">published</div>
              </div>
            </div>

            <div className="group-5">
              <div className="head-3">#120</div>

              <a
                className="head-4"
                href="https://www.legendsofamerica.com/tribe-summary-j-k/#Kutchin"
                rel="noopener noreferrer"
                target="_blank"
              >
                Kutchin
              </a>

              <div className="head-5">1790s</div>

              <div className="table-head-5">
                <div className="head-6">Editing</div>
              </div>
            </div>

            <div className="group-6">
              <div className="head-3">#119</div>

              <a
                className="head-4"
                href="https://www.legendsofamerica.com/tribe-summary-s/4/#Swinomish"
                rel="noopener noreferrer"
                target="_blank"
              >
                Swinomish
              </a>

              <div className="head-5">1680s</div>

              <div className="table-head-6">
                <div className="head-7">published</div>
              </div>
            </div>

            <div className="group-7">
              <div className="head-3">#118</div>

              <a
                className="head-4"
                href="https://www.legendsofamerica.com/chumash-indians/"
                rel="noopener noreferrer"
                target="_blank"
              >
                Chumash
              </a>

              <div className="head-5">1940s</div>

              <div className="table-head-5">
                <div className="head-6">Editing</div>
              </div>
            </div>

            <div className="group-8">
              <div className="head-3">#117</div>

              <a
                className="head-4"
                href="https://www.legendsofamerica.com/tribe-summary-t-v/#Towa"
                rel="noopener noreferrer"
                target="_blank"
              >
                Towa
              </a>

              <div className="head-5">1800s</div>

              <div className="table-head-6">
                <div className="head-8">published</div>
              </div>
            </div>

            <div className="group-9">
              <div className="head-3">#116</div>

              <a
                className="head-4"
                href="https://www.legendsofamerica.com/tribe-summary-n/2/#Nipmuc"
                rel="noopener noreferrer"
                target="_blank"
              >
                Nipmuc
              </a>

              <div className="head-5">1200s</div>

              <div className="table-head-6">
                <div className="head-7">published</div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="credits">
            <p className="element-relume-all">© 2024 All rights reserved.</p>

            <div className="footer-links">
              <div className="text-wrapper-8">Privacy Policy</div>

              <div className="text-wrapper-8">Terms of Service</div>
            </div>
          </div>
        </div>

        <div className="admin-navbar-home-wrapper">
          <div className="admin-navbar-home">
            <header className="header">
              <div className="frame-19">
                <div className="frame-18">
                  <div className="WF-button">
                    <img
                      className="icon-left-wrapper"
                      alt="Icon left wrapper"
                      src={iconLeftWrapper}
                    />

                    <div className="label">Lynn</div>

                    <img className="icon" alt="Icon" src={icon} />
                  </div>
                </div>
              </div>

              <div className="overlap-2">
                <img className="frame-20" alt="Frame" src={frame3} />

                <img className="frame-21" alt="Frame" src={frame} />
              </div>

              <div className="overlap-group-4">
                <img className="frame-22" alt="Frame" src={image1} />

                <img className="frame-23" alt="Frame" src={frame2} />
              </div>

              <div className="logo">
                <img
                  className="aurora-name-with"
                  alt="Aurora name with"
                  src={auroraNameWithLogo1}
                />
              </div>
            </header>
          </div>
        </div>
      </div>
    </div>
  );
};



export default Dashboard;






















// import {
//   category,
//   bookmark,
//   people,
//   image2,
//   mail,
//   settings,
// } from "../images/"; 


{/* <div className="frame">
        <div className="frame-2">
          <div className="rectangle" />
            <div className="frame-3">
              <img className="img-2" alt="Category" src={category} />
              <div className="text-wrapper">Dashboard</div>
            </div>
          </div>

        <div className="frame-2">
          <div className="rectangle-2" />
            <div className="frame-4">
              <img className="img-2" alt="Bookmark" src={bookmark} />
              <div className="text-wrapper-2">Manage Stories</div>
            </div>
          </div>

            <div className="frame-2">
              <div className="rectangle-2" />

              <div className="frame-4">
                <img className="img-2" alt="People" src={people} />

                <div className="text-wrapper-3">Manage Tribes</div>
              </div>
            </div>

            <div className="frame-2">
              <div className="rectangle-2" />

              <div className="frame-4">
                <img className="img-2" alt="Image" src={image2} />

                <div className="text-wrapper-4">Media Library</div>
              </div>
            </div>

            <div className="frame-2">
              <div className="rectangle-2" />

              <div className="frame-4">
                <img className="img-2" alt="Mail" src={mail} />

                <div className="text-wrapper-4">User Submissions</div>
              </div>
            </div>

            <div className="frame-2">
              <div className="rectangle-2" />

              <div className="frame-4">
                <img className="img-2" alt="Settings" src={settings} />

                <div className="text-wrapper-4">Settings</div>
              </div>
            </div> 
          </div> */}