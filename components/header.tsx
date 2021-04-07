import Link from "next/link";
import React from "react";
import styled from "styled-components";
import { BREAKPOINT } from "./consts";

export type HeaderProps = {
  metamask: any;
  account: string | null;
  setAccount: React.Dispatch<React.SetStateAction<string | null>>;
};

export const Header = ({metamask, account, setAccount}: HeaderProps) => {
  return <HeaderContainer>
    <h2>Million ETH Homepage</h2>
    <H3>10 000 NFTs to advertise</H3>
    <Link href="/about">How it works</Link>

      {metamask && (
        <>
          <p>Metamask installed.</p>
          <p>Network version: {metamask.networkVersion}</p>
          <p>
            {account && 'Wallet connected!'}
          </p>
          <p>
            {!account && (
              <button
                className="enableEthereumButton"
                onClick={() => {
                  metamask
                    .request({
                      method: "eth_requestAccounts",
                    })
                    .then(
                      (addresses: any) =>
                        addresses && setAccount(addresses[0])
                    );
                }}
              >
                Enable Ethereum
              </button>
            )}
          </p>
        </>
      )}

    {!metamask && <p>Please install MetaMask!</p>}

    <Logo src="data:image/png;base64,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" />
  </HeaderContainer>;
};

const HeaderContainer = styled.div`
  height: 100%;
  flex: 0 1 340px;
  padding: 32px;
  min-width: 180px;
`;

const H3 = styled.div`
  font-size: 16px;
  line-height: 95.5%;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const Logo = styled.img`
  font-family: Fascinate;
  font-style: normal;
  font-weight: 900;
  font-size: 34px;
  color: #FFFFFF;
  bottom: 32px;
  position: absolute;
  @media (max-width: ${BREAKPOINT}px) {
    bottom: auto;
    right: 32px;
    top: 32px;
  }
`;