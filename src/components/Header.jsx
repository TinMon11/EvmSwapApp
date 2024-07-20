import React from "react";
import { WalletConnectButton } from "./WalletConnectButton";
import Logo from "../assets/Logo.png";

export const Header = () => {
  return (
    <>
      <div className="flex flex-row justify-between w-full p-4 bg-black text-white items-center">
        <img src={Logo} alt="logo" className="w-28" />
        <WalletConnectButton />
      </div>
    </>
  );
};
