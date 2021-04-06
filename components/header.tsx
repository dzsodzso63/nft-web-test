import Link from "next/link";
import React from "react";
import styled from "styled-components";

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
          <p>ETH Address: {account}</p>
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
  </HeaderContainer>;
};

const HeaderContainer = styled.div`
  width: 340px;
  padding: 32px;
`;

const H3 = styled.div`
  font-size: 16px;
  line-height: 95.5%;
  margin-top: 16px;
  margin-bottom: 16px;
`;