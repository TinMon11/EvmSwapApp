import React from "react";
import {
  GithubIcon,
  LinkednIcon,
  EmailIcon,
} from "../assets/icons/flowbite-icons";

import { useSelector } from "react-redux";

export const Footer = () => {
  const walletAddress = useSelector((state) => state.wallet.walletAddress);
  const chainId = useSelector((state) => state.wallet.chainId);
  const balances = useSelector((state) => state.wallet.balance);

  return (
    <div
      className="flex flex-row justify-between w-full px-4 py-2 bg-black text-white items-center"
    >
      <div className="text-sm">Developed by TinMon11</div>
      <div className="flex flex-row gap-2 items-center justify-center text-gray-600">
        <a
          href="https://github.com/TinMon11"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GithubIcon />
        </a>
        <a
          href="https://www.linkedin.com/in/martin-mondino/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <LinkednIcon />
        </a>
        <a
          href="mailto:martindanielmondino@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <EmailIcon />
        </a>
      </div>
    </div>
  );
};
