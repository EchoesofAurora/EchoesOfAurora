
// Dashboard.js
import React from "react";
import "../styles/Dashboard.css";
import Sidebar from "../components/Sidebar";
import Header from "../components/AdminHeader";
import Footer from "../components/AdminFooter";
import HeroDashboard from "./HeroDashboard";


const Dashboard = () => {
  return (
    <div className="dashboard">
      <div className="div">
        <Header />
        <HeroDashboard />
        <Footer />
    </div>
    </div>
  );
};

export default Dashboard;


















// import React from "react";
// import "../styles/Dashboard.css";
// import vector155 from "../images/vector-155.svg";
// import Sidebar from "../components/Sidebar";
// import Header from "../components/AdminHeader";
// import Footer from "../components/AdminFooter";
// import RecentMessages from "./RecentMessages";
// import Statistics from "./Statistics"




// const HeroDashboard = () => {
//   return (
//     <div className="overlap">
      
//       <Sidebar/>
      
//       <div className="frame-5">
//         <div className="frame-6">
//           <div className="group">
//             <div className="overlap-group-2">
//               <div className="title">500</div>

//               <div className="title-2">Total Tribes</div>
//             </div>
//           </div>

//           <div className="group">
//             <div className="overlap-group-2">
//               <div className="title-3">1400</div>

//               <div className="title-4">Total Stories</div>
//             </div>
//           </div>

//           <div className="group">
//             <div className="overlap-group-2">
//               <div className="title-5">85</div>

//               <div className="title-2">Total Location</div>
//             </div>
//           </div>

//           <div className="group">
//             <div className="overlap-group-2">
//               <div className="title-6">60</div>

//               <div className="title-2">Total Messages</div>
//             </div>
//           </div>

//           <div className="overlap-wrapper">
//             <div className="overlap-group-2">
//               <div className="title-5">40</div>

//               <div className="title-7">unread&nbsp;&nbsp;Messages</div>
//             </div>
//           </div>
//         </div>

//         <div className="frame-7">
//           <div className="overlap-group-wrapper">
//             <div className="overlap-group-3">
//               <div className="title-8">500</div>

//               <div className="title-9">Pending Stories</div>

//               <div className="title-10">View</div>
//             </div>
//           </div>

//           <div className="div-wrapper">
//             <div className="overlap-group-3">
//               <div className="title-11">20</div>

//               <div className="title-12">Published Stories</div>

//               <div className="title-10">View</div>
//             </div>
//           </div>
//         </div>
//       </div>

      
//       <RecentMessages  />

//       <div className="frame-16">
//         <div className="frame-17">
//           <div className="frame-18">
//             <div className="table-head-1">
//               <div className="head">Story ID</div>
//             </div>

//             <div className="table-head-2">
//               <div className="head">Tribe</div>
//             </div>

//             <div className="table-head-3">
//               <div className="head">Timeline</div>
//             </div>

//             <div className="table-head-4">
//               <div className="head">Status</div>
//             </div>
//           </div>
//         </div>

//         <img className="vector-2" alt="Vector" src={vector155} />

//         <img className="vector-3" alt="Vector" src={vector155} />

//         <img className="vector-4" alt="Vector" src={vector155} />

//         <img className="vector-5" alt="Vector" src={vector155} />

//         <img className="vector-6" alt="Vector" src={vector155} />

//         <img className="vector-7" alt="Vector" src={vector155} />

//         <img className="vector-8" alt="Vector" src={vector155} />

//         <div className="text-wrapper-7">Recent stories</div>

//         <div className="group-2">
//           <div className="head-3">#123</div>

//           <a
//             className="head-4"
//             href="https://www.legendsofamerica.com/tribe-summary-a/#Ababco"
//             rel="noopener noreferrer"
//             target="_blank"
//           >
//             Ababco
//           </a>

//           <div className="head-5">1600s</div>

//           <div className="table-head-5">
//             <div className="head-6">Editing</div>
//           </div>
//         </div>

//         <div className="group-3">
//           <div className="head-3">#122</div>

//           <a
//             className="head-4"
//             href="https://www.legendsofamerica.com/tribe-summary-a/#Allakaweah"
//             rel="noopener noreferrer"
//             target="_blank"
//           >
//             Allakaweah
//           </a>

//           <div className="head-5">1500s</div>

//           <div className="table-head-6">
//             <div className="head-7">published</div>
//           </div>
//         </div>

//         <div className="group-4">
//           <div className="head-3">#121</div>

//           <a
//             className="head-4"
//             href="https://www.legendsofamerica.com/na-blackfoot/"
//             rel="noopener noreferrer"
//             target="_blank"
//           >
//             Blackfeet
//           </a>

//           <div className="head-5">1750s</div>

//           <div className="table-head-6">
//             <div className="head-7">published</div>
//           </div>
//         </div>

//         <div className="group-5">
//           <div className="head-3">#120</div>

//           <a
//             className="head-4"
//             href="https://www.legendsofamerica.com/tribe-summary-j-k/#Kutchin"
//             rel="noopener noreferrer"
//             target="_blank"
//           >
//             Kutchin
//           </a>

//           <div className="head-5">1790s</div>

//           <div className="table-head-5">
//             <div className="head-6">Editing</div>
//           </div>
//         </div>

//         <div className="group-6">
//           <div className="head-3">#119</div>

//           <a
//             className="head-4"
//             href="https://www.legendsofamerica.com/tribe-summary-s/4/#Swinomish"
//             rel="noopener noreferrer"
//             target="_blank"
//           >
//             Swinomish
//           </a>

//           <div className="head-5">1680s</div>

//           <div className="table-head-6">
//             <div className="head-7">published</div>
//           </div>
//         </div>

//         <div className="group-7">
//           <div className="head-3">#118</div>

//           <a
//             className="head-4"
//             href="https://www.legendsofamerica.com/chumash-indians/"
//             rel="noopener noreferrer"
//             target="_blank"
//           >
//             Chumash
//           </a>

//           <div className="head-5">1940s</div>

//           <div className="table-head-5">
//             <div className="head-6">Editing</div>
//           </div>
//         </div>

//         <div className="group-8">
//           <div className="head-3">#117</div>

//           <a
//             className="head-4"
//             href="https://www.legendsofamerica.com/tribe-summary-t-v/#Towa"
//             rel="noopener noreferrer"
//             target="_blank"
//           >
//             Towa
//           </a>

//           <div className="head-5">1800s</div>

//           <div className="table-head-6">
//             <div className="head-8">published</div>
//           </div>
//         </div>

//         <div className="group-9">
//           <div className="head-3">#116</div>

//           <a
//             className="head-4"
//             href="https://www.legendsofamerica.com/tribe-summary-n/2/#Nipmuc"
//             rel="noopener noreferrer"
//             target="_blank"
//           >
//             Nipmuc
//           </a>

//           <div className="head-5">1200s</div>

//           <div className="table-head-6">
//             <div className="head-7">published</div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };



// const Dashboard = () => {
//   return (
//     <div className="dashboard">
//       <div className="div">
//         <Header />
//         <HeroDashboard />
//         <Footer />
//     </div>
//     </div>
//   );
// };
// export default Dashboard;