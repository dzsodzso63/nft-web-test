import Link from "next/link";
import React from "react";
import { useRecoilState } from "recoil";
import styled from "styled-components";

import { userState } from "../recoil/atoms";
import { getEthereumClient } from "../utils/ethereum";
import { BREAKPOINT, LOGO_URL } from "./consts";

export const Header = () => {
  const [user, setUser] = useRecoilState(userState);
  const ethereum = getEthereumClient();
  return <HeaderContainer>
    <h2>Million ETH Homepage</h2>
    <H3>10 000 NFTs to advertise</H3>
    <Link href="/about">How it works</Link>
    <div suppressHydrationWarning>  
      {ethereum && (
        <div>
          <p>Metamask installed.</p>
          <p>Network version: {ethereum.networkVersion}</p>
          <p>
            {user.account && 'Wallet connected!'}
          </p>
          <p>
            {!user.account && (
              <button
                className="enableEthereumButton"
                onClick={() => {
                  ethereum
                    .request({
                      method: "eth_requestAccounts",
                    })
                    .then(
                      (addresses: any) =>
                        addresses && setUser({
                          ...user,
                          account: addresses[0],
                        })
                    );
                }}
              >
                Connect Wallet
              </button>
            )}
          </p>
        </div>
      )}
      {!ethereum && <p>Please install MetaMask!</p>}
    </div>

    <Logo src={LOGO_URL} />
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