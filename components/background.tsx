import styled, { keyframes } from "styled-components";

export const Background = () => (
  <>
    {Rectangles.map((Rect, i) => (
      <Rect key={i} />
    ))}
  </>
);

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
    width: 286.38px;
    height: 1411.27px;
    left: 50px;
    top: -400px;
    background: #8000ff;
    opacity: 0.5;
    transform: rotate(-34.17deg);
    animation: ${rotate} ${(speed * 4.2) | 0}s linear infinite;
  `,
  styled.div`
    position: absolute;
    width: 236px;
    height: 1400px;
    left: 250px;
    top: 0px;
    background: #191b8a;
    animation: ${rotate} ${(speed * 1.5) | 0}s linear infinite;
  `,
  styled.div`
    position: absolute;
    width: 900px;
    height: 200px;
    left: 1000px;
    top: 70px;
    background: rgba(255, 0, 172, 0.21);
    animation: ${rotate} ${(speed * 2) | 0}s linear infinite;
  `,
  styled.div`
    position: absolute;
    width: 1608px;
    height: 630px;
    left: 50px;
    top: 0px;
    animation: ${rotate} ${(speed * 3) | 0}s linear infinite;
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
