import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import { TransitionProps } from "@material-ui/core/transitions";
import Firebase from "../../config/Firebase";
import CircularProgress from "@material-ui/core/CircularProgress";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EnterCode({ open, handleClose }) {
  const [isLoading, setLoading] = React.useState(false);
  const createRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      const roomName = e.target[0].value;
      const data = {
        greeting: {
          name: "",
          avatar: "",
          message: "Yo angelo !",
          send_at: new Date().toISOString(),
          sender_id: "",
          timestamp: Date.now(),
        },
      };
      const connect = await Firebase.database()
        .ref(`/chats`)
        .push({ messages: data, room: roomName, members: 1 });
      if (connect.key) {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        maxWidth="sm"
      >
        <Box margin={4}>
          <DialogTitle id="alert-dialog-slide-title">
            Buat Room Baru
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Lengkapi form dibawah untuk membuat room
            </DialogContentText>
            <form onSubmit={createRoom}>
              <TextField
                autoFocus
                id="roomName"
                label="Room name"
                type="text"
                fullWidth
                required
                margin="dense"
                variant="outlined"
              />
              <Box marginTop={3} />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                color="primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <CircularProgress
                      color="secondary"
                      size={15}
                      style={{ marginRight: "10px" }}
                    />
                    Loading...
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </form>
          </DialogContent>
        </Box>
      </Dialog>
    </div>
  );
}
