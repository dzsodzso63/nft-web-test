import { GetStaticProps } from "next";
import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { RecoilRoot } from "recoil";
import { BILLBOARD_HEIGHT, BILLBOARD_WIDTH, BREAKPOINT } from "../components/consts";
import {
  BillboardData,
  TileData,
  TileSchema,
} from "../components/test-data";
import { queryAllItems } from "../utils/database";
import { Header } from "../components/header";
import { Billboard } from "../components/billboard/billboard";

interface ServerSideProps {
  billboardData: BillboardData | null;
}

const bilboardData = (queryResult: { Items: TileSchema[] }) => {
  if (!queryResult) {
    return null;
  }

  const items = queryResult.Items.map((item) => ({
    bilboardID: item.BilboardID.S,
    index: item.TileIndex.N,
    owner: item.owner.S,
    url: item.url.S,
    base64Url: item.DataURI.S,
  })).reduce<{ [index: string]: TileData }>(
    (data, item) => ({ ...data, [item.index]: item }),
    {}
  );
  return Array.from({ length: BILLBOARD_HEIGHT }, (_, row) =>
    Array.from(
      { length: BILLBOARD_WIDTH },
      (_, col) => items[row * BILLBOARD_WIDTH + col] || null
    )
  );
};

export const getServerSideProps: GetStaticProps<ServerSideProps> = async () => {
  const data = await queryAllItems();

  return {
    props: {
      billboardData: bilboardData(data as { Items: TileSchema[] }),
    },
  };
};

type IndexPageProps = ServerSideProps;

export default function IndexPage(props: IndexPageProps) {
  const [account, setAccount] = useState<string | null>(null);
  const [metamask, setMetamask] = useState<any>(); // TODO Metamask types
  const [apiResult, setApiResult] = useState<any>(); // TODO Metamask types

  useEffect(() => {
    if (!metamask && typeof window !== "undefined") {
      setMetamask((window as any).ethereum);
    }
    if (metamask && metamask.selectedAddress) {
      setAccount(metamask.selectedAddress);
    }
  }, [metamask]);

  return (
    <RecoilRoot>
      <Container>
        <Background />
        <Main>
          <Header metamask={metamask} account={account} setAccount={setAccount}/>
          <BilboardWrapper>
            {props.billboardData ? (
              <Billboard
                data={props.billboardData}
                owner={account}
                metamask={metamask}
              />
            ) : (
              "Database error"
            )}
          </BilboardWrapper>
        </Main>
      </Container>
    </RecoilRoot>
  );
}

const Background = () => {

  const rotate = keyframes`
    from {
      transform: rotate(0deg) translate3d(0, 0, 0);
    }

    to {
      transform: rotate(360deg) translate3d(0, 0, 0);
    }
  `;
  
  const speed = 20;

  const Rectangles = [
    styled.div`
      position: absolute;
      width: 986.38px;
      height: 1411.27px;
      left: -250px;
      top: -400px;
      background: #8000FF;
      opacity: 0.5;
      transform: rotate(-34.17deg);
      animation: ${rotate} ${speed * 4.2 | 0}s linear infinite;
    `,
    styled.div`
      position: absolute;
      width: 236px;
      height: 1346px;
      left: 0px;
      top: 335px;
      background: #191B6A;
      animation: ${rotate} ${speed * 1.5 | 0}s linear infinite;
    `,
    styled.div`
      position: absolute;
      width: 608px;
      height: 630px;
      left: 1064px;
      top: 76px;
      background: rgba(255, 0, 172, 0.11);
      animation: ${rotate} ${speed * 2 | 0}s linear infinite;
    `,
    styled.div`
      position: absolute;
      width: 608px;
      height: 630px;
      left: 868px;
      top: 635px;      
      background: rgba(128, 0, 255, 0.3);
      animation: ${rotate} ${speed * 2.5 | 0}s linear infinite;
    `,
    styled.div`
      position: absolute;
      width: 1608px;
      height: 630px;
      left: 50px;
      top: 0px;    
      animation: ${rotate} ${speed * 3 | 0}s linear infinite;  
      &:before {
        content: "TilosLabs";
        font-weight: 900;
        font-size: 900px;
        line-height: 0.9;
        letter-spacing: 90px;
        color: rgba(255, 0, 172, 0.43);
      }
    `,
  ];

  return <>{Rectangles.map((Rect, i) => <Rect key={i} />)}</>;
};

const Main = styled.div`
  backdrop-filter: blur(250px);
  color: #BFEEFC;
  mix-blend-mode: normal;
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25), 0px 2px 10px #9E00FF;
  display: flex;
  flex-direction: row;
  font-family: PT Mono;
  font-style: normal;
  font-weight: bold;
  overflow: hidden;
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  @media (max-width: ${BREAKPOINT}px) {
    flex-direction: column;
  }
`;

const Container = styled.div`
  overflow: hidden;
  position: fixed;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
`;

const BilboardWrapper = styled.div`
  height: 100%;
  flex: 1 0 1002px;
  overflow: scroll;
`;