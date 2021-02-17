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

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EnterCode({ open, handleClose }) {
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
            <TextField
              autoFocus
              id="name"
              label="Room code"
              type="text"
              fullWidth
              margin="dense"
              variant="outlined"
            />
            <Box marginTop={3} />
            <Button onClick={handleClose} variant="contained" fullWidth color="primary">
              Enter
            </Button>
          </DialogContent>
        </Box>
      </Dialog>
    </div>
  );
}
