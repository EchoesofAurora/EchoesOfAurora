// StoriesTable.js
import React from "react";
import vector155 from "../images/vector-155.svg";
import "../styles/StoriesTable.css";

const stories = [
  { id: "#123", tribe: "Ababco", timeline: "1600s", status: "Editing", link: "https://www.legendsofamerica.com/tribe-summary-a/#Ababco" },
  { id: "#122", tribe: "Allakaweah", timeline: "1500s", status: "Published", link: "https://www.legendsofamerica.com/tribe-summary-a/#Allakaweah" },
  { id: "#121", tribe: "Blackfeet", timeline: "1750s", status: "Published", link: "https://www.legendsofamerica.com/na-blackfoot/" },
  { id: "#120", tribe: "Kutchin", timeline: "1790s", status: "Editing", link: "https://www.legendsofamerica.com/tribe-summary-j-k/#Kutchin" },
  { id: "#123", tribe: "Ababco", timeline: "1600s", status: "Editing", link: "https://www.legendsofamerica.com/tribe-summary-a/#Ababco" },
  { id: "#122", tribe: "Allakaweah", timeline: "1500s", status: "Published", link: "https://www.legendsofamerica.com/tribe-summary-a/#Allakaweah" },
  { id: "#121", tribe: "Blackfeet", timeline: "1750s", status: "Published", link: "https://www.legendsofamerica.com/na-blackfoot/" },
  { id: "#123", tribe: "Ababco", timeline: "1600s", status: "Editing", link: "https://www.legendsofamerica.com/tribe-summary-a/#Ababco" },
  { id: "#122", tribe: "Allakaweah", timeline: "1500s", status: "Published", link: "https://www.legendsofamerica.com/tribe-summary-a/#Allakaweah" },
  { id: "#121", tribe: "Blackfeet", timeline: "1750s", status: "Published", link: "https://www.legendsofamerica.com/na-blackfoot/" },
  { id: "#120", tribe: "Kutchin", timeline: "1790s", status: "Editing", link: "https://www.legendsofamerica.com/tribe-summary-j-k/#Kutchin" },
  { id: "#123", tribe: "Ababco", timeline: "1600s", status: "Editing", link: "https://www.legendsofamerica.com/tribe-summary-a/#Ababco" },
  { id: "#122", tribe: "Allakaweah", timeline: "1500s", status: "Published", link: "https://www.legendsofamerica.com/tribe-summary-a/#Allakaweah" },
  { id: "#121", tribe: "Blackfeet", timeline: "1750s", status: "Published", link: "https://www.legendsofamerica.com/na-blackfoot/" },

  { id: "#120", tribe: "Kutchin", timeline: "1790s", status: "Editing", link: "https://www.legendsofamerica.com/tribe-summary-j-k/#Kutchin" }
];

const StoriesTable = () => {
  return (
    <div className="stories-dashboard-table-container">
      <div className="dashboard-table-header">
        <div className="dashboard-table-header-cell">dashboard-Story ID</div>
        <div className="dashboard-table-header-cell">Tribe</div>
        <div className="dashboard-table-header-cell">Timeline</div>
        <div className="dashboard-table-header-cell">Status</div>
      </div>

      

      {stories.map((story, index) => (
        <div className={`dashboard-story-row dashboard-story-row-${story.status.toLowerCase()}`} key={index}>
          <div className="dashboard-story-id">{story.id}</div>
          <a className="dashboard-story-tribe" href={story.link} target="_blank" rel="noopener noreferrer">{story.tribe}</a>
          <div className="dashboard-story-timeline">{story.timeline}</div>
          <a
            className={`dashboard-story-status dashboard-story-status-${story.status.toLowerCase()}`}
            href={story.link}
            target="_blank"
            rel="noopener noreferrer"
          >
            {story.status}
          </a>
        </div>
      ))}
    </div>
  );
};

export default StoriesTable;


















// // Storiesdashboard-Table.js
// import React from "react";
// import vector155 from "../images/vector-155.svg";
// import "../styles/Dashboard.css";


// const stories = [
//   { id: "#123", tribe: "Ababco", timeline: "1600s", status: "Editing", link: "https://www.legendsofamerica.com/tribe-summary-a/#Ababco" },
//   { id: "#122", tribe: "Allakaweah", timeline: "1500s", status: "Published", link: "https://www.legendsofamerica.com/tribe-summary-a/#Allakaweah" },
//   { id: "#121", tribe: "Blackfeet", timeline: "1750s", status: "Published", link: "https://www.legendsofamerica.com/na-blackfoot/" },
//   { id: "#120", tribe: "Kutchin", timeline: "1790s", status: "Editing", link: "https://www.legendsofamerica.com/tribe-summary-j-k/#Kutchin" },
//   { id: "#123", tribe: "Ababco", timeline: "1600s", status: "Editing", link: "https://www.legendsofamerica.com/tribe-summary-a/#Ababco" },
//   { id: "#122", tribe: "Allakaweah", timeline: "1500s", status: "Published", link: "https://www.legendsofamerica.com/tribe-summary-a/#Allakaweah" },
//   { id: "#121", tribe: "Blackfeet", timeline: "1750s", status: "Published", link: "https://www.legendsofamerica.com/na-blackfoot/" },
//   { id: "#120", tribe: "Kutchin", timeline: "1790s", status: "Editing", link: "https://www.legendsofamerica.com/tribe-summary-j-k/#Kutchin" }

// ];

// const Storiesdashboard-Table = () => {
//   return (
//     <div className="frame-16">
//       <div className="frame-17">
//         <div className="frame-18">
            
//           {["dashboard-Story ID", "Tribe", "Timeline", "Status"].map((head, index) => (
//             <div className={`dashboard-table-head-${index + 1}`} key={index}>
//               <div className="head">{head}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//       <img className="vector-2" alt="Vector" src={vector155} />

//         <img className="vector-3" alt="Vector" src={vector155} />

//         <img className="vector-4" alt="Vector" src={vector155} />

//         <img className="vector-5" alt="Vector" src={vector155} />

//         <img className="vector-6" alt="Vector" src={vector155} />

//         <img className="vector-7" alt="Vector" src={vector155} />

//         <img className="vector-8" alt="Vector" src={vector155} />

//       <div className="text-wrapper-7">Recent stories</div>
      
//       {stories.map((dashboard-story, index) => (
//         <div className={`group-${index + 2}`} key={index}>
//           <div className="head-3">{dashboard-story.id}</div>
//           <a className="head-4" href={dashboard-story.link} target="_blank" rel="noopener noreferrer">{dashboard-story.tribe}</a>
//           <div className="head-5">{dashboard-story.timeline}</div>
//           <div className={`dashboard-table-head-${dashboard-story.status === "Editing" ? "5" : "6"}`}>
//             <div className={`head-${dashboard-story.status === "Editing" ? "6" : "7"}`}>{dashboard-story.status}</div>
//             </div>

//         </div>
//       ))}
//     </div>
//   );
// };

// export default Storiesdashboard-Table;



{/* <div className="frame-16">
        <div className="frame-17">
          <div className="frame-18">
            <div className="dashboard-table-head-1">
              <div className="head">dashboard-Story ID</div>
            </div>

            <div className="dashboard-table-head-2">
              <div className="head">Tribe</div>
            </div>

            <div className="dashboard-table-head-3">
              <div className="head">Timeline</div>
            </div>

            <div className="dashboard-table-head-4">
              <div className="head">Status</div>
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

          <div className="dashboard-table-head-5">
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

          <div className="dashboard-table-head-6">
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

          <div className="dashboard-table-head-6">
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

          <div className="dashboard-table-head-5">
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

          <div className="dashboard-table-head-6">
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

          <div className="dashboard-table-head-5">
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

          <div className="dashboard-table-head-6">
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

          <div className="dashboard-table-head-6">
            <div className="head-7">published</div>
          </div>
        </div>
      </div> */}
