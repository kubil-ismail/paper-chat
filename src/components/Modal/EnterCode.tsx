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
import { Formik } from "formik";
import * as Yup from "yup";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Schema = Yup.object().shape({
  roomCode: Yup.string()
    .min(5, "Too Short!")
    .max(20, "Too Long!")
    .required("Required"),
  userName: Yup.string()
    .min(2, "Too Short!")
    .max(14, "Too Long!")
    .required("Required"),
});

export default function EnterCode({ open, handleClose, setRoom }) {
  const [isLoading, setLoading] = React.useState(false);
  const enterRoom = async ({ roomCode, userName }) => {
    try {
      setLoading(true);
      // Connect to db
      const connect = Firebase.database()
        .ref(`/chats/${roomCode}`)
        .orderByKey();

      // Get value
      connect.on("value", (snapshot) => {
        const result = snapshot.val();
        if (result) {
          setLoading(false);
          setRoom({
            status: true,
            data: {
              room: result.room,
              members: result.member,
              roomCode: roomCode,
              userName: userName,
            },
          });
        } else {
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
            <Formik
              initialValues={{
                roomCode: "",
                userName: "",
              }}
              validationSchema={Schema}
              onSubmit={(values) => {
                enterRoom(values);
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                isValid,
                handleSubmit,
              }) => (
                <form onSubmit={handleSubmit}>
                  <TextField
                    autoFocus
                    id="roomCode"
                    label="Room code"
                    type="text"
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    name="roomCode"
                    helperText={touched.roomCode ? errors.roomCode : ""}
                    error={touched.roomCode && Boolean(errors.roomCode)}
                    value={values.roomCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <TextField
                    id="yourName"
                    label="Your Name"
                    type="text"
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    name="userName"
                    helperText={touched.userName ? errors.userName : ""}
                    error={touched.userName && Boolean(errors.userName)}
                    value={values.userName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Box marginTop={3} />
                  <Button
                    variant="contained"
                    type="submit"
                    color="primary"
                    fullWidth
                    disabled={isLoading || !isValid}
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
              )}
            </Formik>
          </DialogContent>
        </Box>
      </Dialog>
    </div>
  );
}
