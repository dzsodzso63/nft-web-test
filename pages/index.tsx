import { GetStaticProps } from "next";
import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { RecoilRoot } from "recoil";
import { Billboard } from "../components/billboard/billboard";
import { BILLBOARD_HEIGHT, BILLBOARD_WIDTH } from "../components/consts";
import {
  BillboardData,
  TileData,
  TileSchema,
} from "../components/test-data";
import { getAuthenticatedSignature } from "../utils/authenticate";
import { queryAllItems } from "../utils/database";
import { Header } from "../components/header";

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

type Scaled = {
  scale: number;
};

const getScale = () => (console.log('calc'), typeof window !== "undefined" ? window.innerHeight / 1066 : 1);

export default function IndexPage(props: IndexPageProps) {
  const [account, setAccount] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1);
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

  useEffect(() => {
    setScale(getScale());
  }, []);

  return (
    <RecoilRoot>
      <Container scale={scale}>
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
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  `;
  
  const speed = 10;

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
      animation: ${rotate} ${speed}s linear infinite;
    `,
    styled.div`
      position: absolute;
      width: 636px;
      height: 946px;
      left: -233px;
      top: 635px;
      background: #191B6A;
      animation: ${rotate} ${speed}s linear infinite;
    `,
    styled.div`
      position: absolute;
      width: 608px;
      height: 630px;
      left: 1064px;
      top: -276px;
      background: rgba(255, 0, 172, 0.11);
      animation: ${rotate} ${speed}s linear infinite;
    `,
    styled.div`
      position: absolute;
      width: 608px;
      height: 630px;
      left: 868px;
      top: 635px;      
      background: rgba(128, 0, 255, 0.3);
      animation: ${rotate} ${speed}s linear infinite;
    `,
    styled.div`
      position: absolute;
      width: 1608px;
      height: 630px;
      left: 50px;
      top: 0px;    
      animation: ${rotate} ${speed}s linear infinite;  
      &:before {
        content: "TILOS";
        font-weight: 900;
        font-size: 1200px;
        line-height: 0.9;
        color: rgba(255, 0, 172, 0.43);
      }
    `,
  ];

  return <>{Rectangles.map((Rect, i) => <Rect key={i} />)}</>;
};

const Main = styled.div`
  backdrop-filter: blur(300px);
  color: #BFEEFC;
  mix-blend-mode: normal;
  text-shadow: 0px 2px 2px rgba(0, 0, 0, 0.25), 0px 2px 10px #9E00FF;
  width: 200%;
  display: flex;
  flex-direction: row;
  font-family: PT Mono;
  font-style: normal;
  font-weight: bold;
  line-height: 95.5%;
`;

const Container = styled.div<Scaled>`
  height: 1066px;
  width: 200%;
  overflow: hidden;
  position: relative;
  transform: scale(${props => props.scale || 1});
  transform-origin: top left;
`;

const BilboardWrapper = styled.div`
  padding: 32px;
`;