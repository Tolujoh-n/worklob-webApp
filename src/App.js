import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import WalletRegister from "./components/WalletRegister";
import Approutes from "./components/Approutes";
import { Web3Provider } from "./Web3Provider";

function App() {
  return (
    <Web3Provider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/wallet-register" element={<WalletRegister />} />
          <Route path="/dashboard/*" element={<Approutes />} />
        </Routes>
      </Router>
    </Web3Provider>
  );
}

export default App;
