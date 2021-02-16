import React from "react";
import Firebase from "./config/Firebase";
import UniqueId from "uniqid";

interface State {
  chats: any;
  roomId: null | string;
  senderId: string;
  message: string;
}

interface Props { }

class App extends React.Component<Props, State> {
  constructor(props: State) {
    super(props);
    this.state = {
      chats: {},
      roomId: null,
      senderId: UniqueId.time(),
      message: "",
    };
  }

  componentDidMount = () => {
    const { roomId } = this.state;
    this.getChat(roomId);
  };

  // Get chat by room id
  getChat = (roomId: string | null) => {
    if (roomId) {
      const connect = Firebase.database().ref(`/chats/${roomId}`).orderByKey();
      connect.on("value", (snapshot) => {
        const result = snapshot.val();
        if (result) {
          this.setState({ chats: result.data });
        } else {
          console.log("no data");
        }
      });
    }
  };

  // Set new room by room id
  setRoom = () => {
    const senderId = UniqueId();
    // Default message after create room
    const data = {
      greeting: {
        name: "Bilkis Ismail",
        avatar:
          "https://s.gravatar.com/avatar/9a6426a03a80eefde6c1421722f1855d?size=100&default=retro",
        message: "Yo angelo !",
        send_at: new Date().toISOString(),
        sender_id: senderId,
        timestamp: Date.now(),
      },
    };
    const connect = Firebase.database().ref(`/chats`);
    connect.push({ data }).then((res) => {
      this.setState({ roomId: res.key });
    });
  };

  // Send new chat by room id
  sendChat = (roomId: string | null) => {
    if (roomId) {
      const { senderId, message } = this.state;
      // Default message after create room
      const data = {
        name: "Bilkis Ismail",
        avatar:
          "https://s.gravatar.com/avatar/9a6426a03a80eefde6c1421722f1855d?size=100&default=retro",
        message: message,
        send_at: new Date().toISOString(),
        sender_id: senderId,
      };
      const connect = Firebase.database().ref(`/chats/${roomId}/data`);
      connect
        .push()
        .set(data)
        .then(() => {
          console.log("success");
        });
    }
  };

  render() {
    const { roomId, chats } = this.state;
    console.log(Object.keys(chats));
    return (
      <>
        <div style={{ marginBottom: "50px" }}>
          <input
            placeholder="Room Id"
            onChange={(e) => this.setState({ roomId: e.target.value })}
          />
          <button onClick={() => this.getChat(roomId)}>find</button>
          <button onClick={() => this.setRoom()}>create</button>
        </div>

        <table>
          <tr>
            <th>From</th>
            <th>Message</th>
            <th>Send At</th>
          </tr>
          {Object.keys(chats).length > 0 &&
            Object.keys(chats)
              .filter((res) => res !== "greeting")
              .map((val, key) => (
                <tr key={key}>
                  <td>{chats[val].name}</td>
                  <td>{chats[val].message}</td>
                  <td>{chats[val].send_at}</td>
                </tr>
              ))}
        </table>
        <textarea
          onChange={(e) => this.setState({ message: e.target.value })}
        />
        <button onClick={() => this.sendChat(roomId)}>send</button>

      </>
    );
  }
}

export default App;
