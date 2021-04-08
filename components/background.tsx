import styled, { keyframes } from "styled-components";

export const Background = () => <>{Rectangles.map((Rect, i) => <Rect key={i} />)}</>;

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
