/* @flow */
import React from "react";
import styled from "styled-components";

const Welcome = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: green;
  width: 100%;
  text-align: center;
`;

class Main extends React.Component<void, void, void> {
  render() {
    return <Welcome>Welcome to your new app!</Welcome>;
  }
}

export default Main;
