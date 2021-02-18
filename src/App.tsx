import React from "react";
import MainWelcome from "./components/Main/Welcome";
import MainChatRoom from "./components/Chat/Wrapper";

interface AppProps {}

interface AppState {
  validRoom: boolean;
  roomInfo: any;
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props: AppState) {
    super(props);
    this.state = {
      validRoom: false,
      roomInfo: null,
    };
  }

  componentDidMount = () => {
    const roomInfo = localStorage.getItem('roomInfo');
    if (roomInfo) {
      this.setState({ validRoom: true, roomInfo: JSON.parse(roomInfo) });
    }
  }

  render() {
    const { validRoom, roomInfo } = this.state;
    return (
      <div className="app">
        {validRoom && roomInfo ? (
          <div style={{ width: "80vw", overflowY: "hidden" }}>
            <MainChatRoom roomInfo={roomInfo} />
          </div>
        ) : (
          <MainWelcome
            setRoom={(e: any) =>
              this.setState({ validRoom: e.status, roomInfo: e.data })
            }
          />
        )}
      </div>
    );
  }
}
