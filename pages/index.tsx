import { GetStaticProps } from "next";
import React, { useEffect } from "react";
import styled from "styled-components";
import { RecoilRoot, useRecoilState } from "recoil";
import { BILLBOARD_HEIGHT, BILLBOARD_WIDTH, BREAKPOINT } from "../components/consts";
import {
  BillboardData,
  TileData,
  TileSchema,
} from "../components/test-data";
import { queryAllItems } from "../utils/database";
import { Header } from "../components/header";
import { Billboard } from "../components/billboard/billboard";

import { ModalContainer } from "../components/modal";
import { Background } from "../components/background";
import { UploadManager } from "../components/UploadManager";
import { userState } from "../recoil/atoms";
import { getEthereumClient } from "../utils/ethereum";
import { ClaimManager } from "../components/ClaimManager";

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

function IndexPage(props: IndexPageProps) {
  const [user, setUser] = useRecoilState(userState);

  useEffect(() => {
    const ethereum = getEthereumClient();
    if (ethereum && ethereum.selectedAddress !== user.account) {
      setUser({
        account: ethereum && ethereum.selectedAddress,
      });
    }
  }, [user]);

  return (
    <Container>
      <Background />
      <Main>
        <Header />
        <BilboardWrapper>
          {props.billboardData ? (
            <Billboard
              data={props.billboardData}
            />
          ) : (
            "Database error"
          )}
        </BilboardWrapper>
      </Main>
      <ModalContainer />
      <UploadManager />
      <ClaimManager />
    </Container>
  );
}

const Root = (props: IndexPageProps) => <RecoilRoot><IndexPage {...props}/></RecoilRoot>;

export default Root;

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