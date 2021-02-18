import React, { Component } from "react";
import MainWelcome from "./components/Main/Welcome";
import MainChatRoom from "./components/Chat/Wrapper";

interface AppProps {}

interface AppState {
  openModalCode: boolean;
}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppState) {
    super(props);
    this.state = {
      openModalCode: false,
    };
  }

  render() {
    return (
      <div className="app">
        <MainWelcome />
        {/* <div style={{ width: "80vw", overflowY: 'hidden' }}>
          <MainChatRoom />
        </div> */}
      </div>
    );
  }
}
