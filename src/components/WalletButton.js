import React, { createContext, useState, useEffect, useContext } from "react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { TokenRow } from "@coinbase/onchainkit/token";
import { color } from "@coinbase/onchainkit/theme";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import {
  Address,
  Avatar,
  Name,
  Identity,
  Badge,
  EthBalance,
} from "@coinbase/onchainkit/identity";

import { base } from "viem/chains";

const WalletButton = () => (
  <Wallet>
    <ConnectWallet>
      <Avatar className="h-6 w-6" />
      <Name />
    </ConnectWallet>
    <WalletDropdown>
      <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
        <Avatar />
        <Name />
        <Address />
        <EthBalance />
      </Identity>
      <WalletDropdownDisconnect />
    </WalletDropdown>
  </Wallet>
);

export default WalletButton;
