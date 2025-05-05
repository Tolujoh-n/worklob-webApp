import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import WalletRegister from "./components/WalletRegister";
import Approutes from "./components/Approutes";
import { Web3Provider } from "./Web3Provider";
import { base } from "viem/chains";
import { OnchainKitProvider, getOnchainKitConfig } from "@coinbase/onchainkit";
import { baseSepolia } from "viem/chains";
import { createPublicClient, http } from "viem";

function App() {
  return (
    // Wrap your app with both OnchainKitProvider and Web3Provider to use their context
    <OnchainKitProvider apiKey="DaSMXWYnsSsDIb0Qv5UM37tvgAV1h8s5" chain={base}>
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
    </OnchainKitProvider>
  );
}

export default App;
