import React from "react";
import Firebase from "./config/Firebase";
import UniqueId from "uniqid";
import AppBar from "@material-ui/core/AppBar";
import Container from "@material-ui/core/Container";
import Toolbar from "@material-ui/core/Toolbar";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import imageCompression from "browser-image-compression";

interface State {
  chats: any;
  roomId: null | string;
  senderId: string;
  senderName: string;
  message: string;
  loadingImage: boolean;
  fileUrl: null | string;
  errorImage: boolean;
}

interface Props {}

class App extends React.Component<Props, State> {
  constructor(props: State) {
    super(props);
    this.state = {
      chats: {},
      roomId: null,
      senderId: UniqueId.time(),
      senderName: "Unknown",
      message: "",
      loadingImage: false,
      fileUrl: null,
      errorImage: false,
    };
  }

  componentDidMount = () => {
    const savedRoom = localStorage.getItem("roomId");
    if (savedRoom) {
      this.setState({ roomId: savedRoom });
      this.getChat(savedRoom);
    } else {
      const { roomId } = this.state;
      this.getChat(roomId);
    }
  };

  // Get chat by room id
  getChat = (roomId: string | null) => {
    if (roomId) {
      const connect = Firebase.database().ref(`/chats/${roomId}`).orderByKey();
      connect.on("value", (snapshot) => {
        const result = snapshot.val();
        if (result) {
          this.setState({ chats: result.data });
          localStorage.setItem("roomId", roomId);
        } else {
          console.log("no data");
        }
      });
    }
  };

  // Set new room by room id
  setRoom = () => {
    const senderId = UniqueId();
    const { senderName } = this.state;
    // Default message after create room
    const data = {
      greeting: {
        name: senderName,
        avatar: "",
        message: "Yo angelo !",
        send_at: new Date().toISOString(),
        sender_id: senderId,
        timestamp: Date.now(),
      },
    };
    const connect = Firebase.database().ref(`/chats`);
    connect.push({ data }).then((res) => {
      this.setState({ roomId: res.key });
      this.getChat(res.key);
    });
  };

  // Send new chat by room id
  sendChat = (roomId: string | null, type: string) => {
    if (roomId) {
      const { senderId, message, senderName, fileUrl } = this.state;
      const data = {
        name: senderName,
        avatar: "",
        message: message,
        send_at: new Date().toISOString(),
        sender_id: senderId,
        timestamp: Date.now(),
        file: fileUrl,
        type: type,
      };
      const connect = Firebase.database().ref(`/chats/${roomId}/data`);
      connect
        .push()
        .set(data)
        .then(() => {
          this.setState({ message: "" });
        });
    }
  };

  // Handle upload file image / sound record
  handleUpload = async (file: any) => {
    const { roomId } = this.state;
    if (roomId) {
      try {
        this.setState({ loadingImage: true, errorImage: false });
        const files = file.target.files[0];

        // Compress image option
        const options = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
        };

        const compressedFile = await imageCompression(files, options);
        const upload = Firebase.storage()
          .ref(`/images/${compressedFile.name}`)
          .put(compressedFile);
        upload.on(
          "state_changed",
          () => {
            // Handle on upload files
            this.setState({ loadingImage: true });
          },
          (err) => {
            //catches the errors
            this.setState({ loadingImage: false, errorImage: true });
          },
          () => {
            // gets the functions from storage refences the image storage in firebase by the children
            // gets the download url then sets the image from firebase as the value for the imgUrl key:
            Firebase.storage()
              .ref("images")
              .child(compressedFile.name)
              .getDownloadURL()
              .then((res) => {
                this.setState({ loadingImage: false, fileUrl: res });
                this.sendChat(roomId, "file");
              });
          }
        );
      } catch (error) {
        this.setState({ loadingImage: false, errorImage: true });
      }
    }
  };

  // Delete saved room id
  clearRoom = () => {
    localStorage.setItem("roomId", "");
    this.setState({ roomId: null });
  };

  render() {
    const { roomId, chats, errorImage, loadingImage, message } = this.state;
    return (
      <>
        <Container>
          <Paper square>
            {roomId && (
              <Button
                variant="contained"
                color="secondary"
                onClick={() => this.clearRoom()}
              >
                Exit
              </Button>
            )}
            {!roomId && (
              <>
                <TextField
                  label="Room Id"
                  variant="filled"
                  onChange={(e) => this.setState({ roomId: e.target.value })}
                />
                <TextField
                  label="Your Name"
                  variant="filled"
                  onChange={(e) =>
                    this.setState({ senderName: e.target.value })
                  }
                />
                <Button
                  variant="contained"
                  onClick={() => this.getChat(roomId)}
                >
                  Enter
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => this.setRoom()}
                >
                  Create New
                </Button>
              </>
            )}

            <List>
              {roomId && Object.keys(chats).length > 0 &&
                Object.keys(chats)
                  .filter((res) => res !== "greeting")
                  .map((val, key) => (
                    <React.Fragment key={key}>
                      <ListItem button>
                        <ListItemAvatar>
                          <Avatar alt={chats[val].name} src={chats[val].avatar}>
                            {chats[val]["name"].substring(0, 2)}
                          </Avatar>
                        </ListItemAvatar>
                        {chats[val].type === "file" ? (
                          <img
                            src={chats[val].file}
                            width="100%"
                            height="400px"
                            alt="sending pictures"
                          />
                        ) : (
                          <ListItemText
                            primary={chats[val].name}
                            secondary={chats[val].message}
                          />
                        )}
                      </ListItem>
                    </React.Fragment>
                  ))}
            </List>
            {loadingImage && <p>lOADINGGSS.......</p>}
            {errorImage && <p>Upload errors....</p>}
          </Paper>
          {roomId && (
            <AppBar position="static" color="transparent">
              <Toolbar>
                <TextField
                  label="Message"
                  variant="filled"
                  fullWidth
                  value={message}
                  onChange={(e) => this.setState({ message: e.target.value })}
                  onKeyPress={(e) => {
                    if (
                      e.key === "Enter" &&
                      !(e.key === "Enter" && e.shiftKey)
                    ) {
                      e.preventDefault();
                      this.setState({ message: "" });
                      this.sendChat(roomId, "text");
                    }
                  }}
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={this.handleUpload}
                />
                <Button
                  variant="contained"
                  onClick={() => this.sendChat(roomId, "text")}
                >
                  Send
                </Button>
              </Toolbar>
            </AppBar>
          )}
        </Container>
      </>
    );
  }
}

export default App;
