import React, { useRef } from "react";
import { render } from "react-dom";
import useScrollOnDrag from "react-scroll-ondrag";
import styled from "styled-components";

const Container = styled.div`
  display: inline-block;
  width: 500px;
  height: 250px;
  overflow-x: hidden;
  overflow-y: hidden;
  border: 1px solid #000;
  padding: 0 5px;
  white-space: nowrap;
`;

const Box = styled.div`
  display: inline-block;
  height: 300px;
  margin: 5px 10px;
  width: 250px;
  background: linear-gradient(red, yellow);
`;

const ScrollDragView = ({ runScroll,children }) => {
    const containerRef = useRef(null);
    const { events } = useScrollOnDrag(containerRef, {
        runScroll: runScroll && runScroll(containerRef)
    });

    return (
        <Container {...events} ref={containerRef}>
            {
                //children
            }
            <Box key={1} />
            <Box key={2}></Box>
            <Box key={3} />
            <Box key={1} />
            <Box key={2} />
            <Box key={3} />
            <Box key={1} />
            <Box key={2} />
            <Box key={3} />
        </Container>
        );

 };
export default  ScrollDragView






