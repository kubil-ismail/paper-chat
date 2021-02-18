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
  const enterRoom = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      // Get value input
      const roomCode = e.target[2].value;
      const userName = e.target[0].value;

      // Connect to db
      const connect = Firebase.database()
        .ref(`/chats/${roomCode}`)
        .orderByKey();

      // Get value
      connect.on("value", (snapshot) => {
        const result = snapshot.val();
        if (result) {
          console.log(result);
          setLoading(false);
        } else {
          console.log("no data");
          setLoading(false);
        }
      });
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
          <DialogTitle id="alert-dialog-slide-title">Join Room</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Masukan code room kamu
            </DialogContentText>
            <form onSubmit={enterRoom}>
              <TextField
                autoFocus
                id="yourName"
                label="Your Name"
                type="text"
                fullWidth
                margin="dense"
                variant="outlined"
                required
              />
              <TextField
                autoFocus
                id="roomCode"
                label="Room code"
                type="text"
                fullWidth
                margin="dense"
                variant="outlined"
                required
              />
              <Box marginTop={3} />
              <Button
                variant="contained"
                type="submit"
                color="primary"
                fullWidth
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
                  "Enter"
                )}
              </Button>
            </form>
          </DialogContent>
        </Box>
      </Dialog>
    </div>
  );
}
