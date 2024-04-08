import type { NextPage } from "next";
import dynamic from 'next/dynamic';
import { Col, Row } from "antd";
import { Text } from "@nextui-org/react";
import styled from "styled-components";

// Dynamically import ReactPlayer
const ReactPlayer = dynamic(
    () => import('react-player'),
    { ssr: false } // This line is important. It's what prevents server-side render
);

const CCTVListContainer = styled.div`
    margin: 40px 30vw;
`;

const staticData = {
    count: 10,
    data: [
        // Your articles data here
    ],
};

const PlayerWrapper = styled.div`
  position: relative;
`;

const ClickCatcher = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;
const CCTV: NextPage = () => {
    const cctvData = [
        { id: 1, description: 'CCTV 1', url: "https://www.youtube.com/watch?v=GVCUSMHCSA8" },
        { id: 2, description: 'CCTV 2', url: "https://www.youtube.com/watch?v=vOUI7egxyE8" },
        { id: 3, description: 'CCTV 3', url: "https://www.youtube.com/watch?v=uj8HZ3v_39o" },
        { id: 4, description: 'CCTV 4', url: "https://www.youtube.com/watch?v=_XiHJAk_3q4" }
    ];
    return (
        <CCTVListContainer>
            <Col>
                <Row style={{ marginBottom: "40px" }}>
                    <Text h3>Informasi Keamanan</Text>
                </Row>
                <Row>
                    {cctvData.map((cctv, index) => (
                        <div key={cctv.id}>
                            <Text h4>{cctv.description}</Text>
                            <ReactPlayer
                                url={cctv.url}
                                playing={true}
                                muted={true}
                                config={{
                                    youtube: {
                                        playerVars: {
                                            controls: 0,
                                            iv_load_policy: 3
                                        }
                                    }
                                }}
                            />
                        </div>
                    ))}
                </Row>
            </Col>
        </CCTVListContainer>
    );
};

export default CCTV;