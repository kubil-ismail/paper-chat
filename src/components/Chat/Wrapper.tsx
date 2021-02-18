import React, { Component } from "react";
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Grid,
  TextField,
  IconButton,
  Menu,
  MenuItem,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Firebase from "../../config/Firebase";
import { Sender, Receiver } from "./ChatBox";
interface AppProps {
  roomInfo: any;
}

interface AppState {
  openModalCode: boolean;
  actionAnchor: any;
  messages: any;
  members: number;
  senderId: number | null;
  roomId: string | null;
  text: string;
  userName: string | null;
}

export default class Welcome extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      openModalCode: false,
      actionAnchor: null,
      messages: null,
      members: 0,
      senderId: null,
      roomId: null,
      text: "",
      userName: null,
    };
  }

  componentDidMount = () => {
    const { roomInfo } = this.props;
    if (roomInfo) {
      this.getChat(roomInfo.roomCode);
    }
  };

  // Get chat by room Id
  getChat = (roomId: string) => {
    if (roomId) {
      const connect = Firebase.database().ref(`/chats/${roomId}`).orderByKey();
      connect.on("value", (snapshot) => {
        const result = snapshot.val();
        if (result) {
          const { senderId, userName } = this.props.roomInfo;
          this.setState({
            messages: result.messages,
            members: Object.keys(result.members).length,
            senderId: senderId,
            roomId: roomId,
            userName: userName,
          });
          localStorage.setItem("roomInfo", JSON.stringify(this.props.roomInfo));
        } else {
          console.log("no data");
        }
      });
    }
  };

  // Send new chat by room id
  sendChat = (roomId: string, type: string) => {
    console.log(roomId);
    if (roomId) {
      const { senderId, text, userName } = this.state;
      const data = {
        name: userName,
        avatar: "",
        message: text,
        send_at: new Date().toISOString(),
        sender_id: senderId,
        timestamp: Date.now(),
        file: "",
        type: type,
      };
      const connect = Firebase.database().ref(`/chats/${roomId}/messages`);
      connect
        .push()
        .set(data)
        .then(() => {
          this.setState({ text: "" });
        });
    }
  };

  // Handle on option clicked
  handleAction = (event: React.MouseEvent<HTMLButtonElement>) => {
    this.setState({
      actionAnchor: event.currentTarget,
    });
  };

  handleCloseAction = () => {
    this.setState({
      actionAnchor: null,
    });
  };

  render() {
    const { room } = this.props.roomInfo;
    const { actionAnchor, members, messages, senderId, roomId } = this.state;
    return (
      <div>
        <Card variant="outlined">
          <CardHeader
            title={room}
            subheader={`${members} Members`}
            action={
              <IconButton aria-label="settings" onClick={this.handleAction}>
                <MoreVertIcon />
              </IconButton>
            }
            style={{ borderBottom: "1px solid rgba(0, 0, 0, 0.12)" }}
          />
          <Menu
            id="simple-menu"
            anchorEl={actionAnchor}
            keepMounted
            open={Boolean(actionAnchor)}
            onClose={this.handleCloseAction}
          >
            <MenuItem onClick={this.handleCloseAction}>Room Info</MenuItem>
            <MenuItem onClick={this.handleCloseAction}>Exit Room</MenuItem>
          </Menu>
          <CardContent style={{ height: "70vh", overflowY: "scroll" }}>
            <Box marginY={8} marginRight={6} marginLeft={3}>
              {messages &&
                Object.keys(messages).length > 0 &&
                Object.keys(messages)
                  .filter((res) => res !== "greeting")
                  .map((val, key) => (
                    <React.Fragment key={key}>
                      {messages[val].sender_id === senderId ? (
                        <Receiver
                          body={messages[val].message}
                          time={messages[val].send_at}
                        />
                      ) : (
                        <Sender
                          name={messages[val].name}
                          body={messages[val].message}
                          time={messages[val].send_at}
                        />
                      )}
                    </React.Fragment>
                  ))}
            </Box>
          </CardContent>
          <CardActions style={{ borderTop: "1px solid rgba(0, 0, 0, 0.12)" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item lg={11}>
                <TextField
                  fullWidth
                  variant="filled"
                  InputProps={{ disableUnderline: true }}
                  value={this.state.text}
                  size="small"
                  onChange={(e) => this.setState({ text: e.target.value })}
                  onKeyPress={(e) => {
                    if (
                      e.key === "Enter" &&
                      !(e.key === "Enter" && e.shiftKey) &&
                      roomId &&
                      this.state.text.trim().length > 0
                    ) {
                      e.preventDefault();
                      this.setState({ text: "" });
                      this.sendChat(roomId, "text");
                    }
                  }}
                />
              </Grid>
              <Grid item>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    if (roomId && this.state.text.trim().length > 0) {
                      this.setState({ text: "" });
                      this.sendChat(roomId, "text");
                    }
                  }}
                >
                  Send
                </Button>
              </Grid>
            </Grid>
          </CardActions>
        </Card>
      </div>
    );
  }
}
