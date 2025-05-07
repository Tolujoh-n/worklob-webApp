import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster, toast } from "sonner";
import Walletmodal from "./Walletmodal.jsx";

import Home from "../views/Home";
import Navbar from "../components/Navbar";
import Freelance from "./Freelance.jsx";
import Sidenav from "./Sidenav";
import Fulltimejob from "./Fulltimejob.jsx";
import Myfreelance from "./freelancer/Myfreelance.jsx";
import Myfulltime from "./freelancer/Myfulltime.jsx";
import Mygigs from "./freelancer/Mygigs.jsx";

import Customerdash from "./customers/Customerdash.jsx";
import Cusfreelance from "./customers/Cusfreelance.jsx";
import Cusfulltime from "./customers/Cusfulltime.jsx";
import Cusgigs from "./customers/Cusgigs.jsx";
import Browsegigs from "./customers/Browsegigs.jsx";
import Postjob from "./customers/Postjob.jsx";
import Postgig from "./freelancer/Postgig.jsx";
import Freelanceform from "./customers/jobform/Freelanceform.jsx";
import Fulltimeform from "./customers/jobform/Fulltimeform.jsx";

import Chat from "./chat/Chat.jsx";
import Chatdetails from "./chat/chatdetails/Chatdetails.jsx";

import Settings from "../views/Settings";
import Footer from "../components/Footer";
import Gigdetails from "./Gigdetails";
import Referrals from "./referrals/Referrals.jsx";
import Wallet from "./wallet/Wallet.jsx";
import Userprofile from "./Userprofile.jsx";

// Future rootes
import Trade from "./trade/Trade.jsx";
import Stake from "./staking/Stake.jsx";
import Loan from "./loans/Loan.jsx";
import LoanPortfolio from "./loans/LoanPortfolio.jsx";
import Loanlist from "./loans/Loanlist.jsx";
import Governance from "./governance/Governance.jsx";
import GovenanceDetails from "./governance/GovenanceDetails.jsx";
import Proposal from "./governance/Proposal.jsx";
import Agents from "./ai/Agents.jsx";
import AgentsDetails from "./ai/AgentsDetails.jsx";

// Admin UI:
import Fundstaking from "./contract-admin-ui/Fundstaking.js";

// Css files
import "../assets/vendor/simple-datatables/style.css";
import "../assets/vendor/remixicon/remixicon.css";
import "../assets/vendor/quill/quill.bubble.css";
import "../assets/vendor/quill/quill.snow.css";
import "../assets/vendor/boxicons/css/boxicons.min.css";
import "../assets/vendor/bootstrap-icons/bootstrap-icons.css";
import "../assets/vendor/bootstrap/css/bootstrap.min.css";
import "../assets/css/style.css";

import "../assets/css/dashboard.css";

const Approutes = () => {
  const [activeLink, setActiveLink] = useState("");
  const [isWalletmodalOpen, setIsWalletmodalOpen] = useState(false);

  const openWalletmodal = () => setIsWalletmodalOpen(true);
  const closeWalletmodal = () => setIsWalletmodalOpen(false);

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState); // Toggles the state
  };

  const openSidebar = () => {
    setSidebarOpen(true); // Explicitly sets the state to true
  };

  const closeSidebar = () => {
    setSidebarOpen(false); // Explicitly sets the state to false
  };

  return (
    <div className={isSidebarOpen ? "toggle-sidebar" : ""}>
      <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <Sidenav
        isSidebarOpen={isSidebarOpen}
        activeLink={activeLink}
        setActive={setActiveLink}
      />
      <main id="main" className="main">
        <section className="section dashboard">
          <div className="row">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/browsegigs" element={<Browsegigs />} />
              <Route path="/freelance" element={<Freelance />} />
              <Route path="/wallet" element={<Wallet />} />
              <Route path="/mygigs" element={<Mygigs />} />
              <Route path="/myfulltime" element={<Myfulltime />} />
              <Route path="/myfreelance" element={<Myfreelance />} />
              <Route path="/fulltimejob" element={<Fulltimejob />} />

              <Route path="/chat" element={<Chat />} />
              <Route
                path="/chatdetails/:jobId/chat/:chatId"
                element={<Chatdetails />}
              />

              <Route path="/customerdash" element={<Customerdash />} />
              <Route path="/cusfreelance" element={<Cusfreelance />} />
              <Route path="/cusfulltime" element={<Cusfulltime />} />
              <Route path="/cusgigs" element={<Cusgigs />} />
              <Route path="/postjob" element={<Postjob />} />
              <Route path="/postgig" element={<Postgig />} />
              <Route path="/freelanceform" element={<Freelanceform />} />
              <Route path="/fulltimeform" element={<Fulltimeform />} />

              <Route path="/Profile" element={<Settings />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/gigdetails/:jobId" element={<Gigdetails />} />
              <Route path="/referrals" element={<Referrals />} />
              <Route path="/trade" element={<Trade />} />
              <Route path="/staking" element={<Stake />} />

              <Route path="/loan" element={<Loan />} />
              <Route path="/loan_portfolio" element={<LoanPortfolio />} />
              <Route path="/loan_list" element={<Loanlist />} />

              <Route path="/governance" element={<Governance />} />
              <Route path="/govenance_details" element={<GovenanceDetails />} />
              <Route path="/proposal" element={<Proposal />} />
              <Route path="/ai_agents" element={<Agents />} />
              <Route
                path="/:id/ai_agents_details"
                element={<AgentsDetails />}
              />
              <Route path="/:username" element={<Userprofile />} />

              {/* Route to fund staking pool */}
              <Route path="/fundstaking" element={<Fundstaking />} />
            </Routes>
          </div>
          <Walletmodal isOpen={isWalletmodalOpen} onClose={closeWalletmodal} />
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Approutes;
