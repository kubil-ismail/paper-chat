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
import UniqueId from 'uniqid';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Schema = Yup.object().shape({
  roomName: Yup.string()
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
  const createRoom = async ({ roomName, userName }) => {
    try {
      setLoading(true);
      const senderId = UniqueId.time();
      const data = {
        greeting: {
          name: "",
          avatar: "",
          message: "",
          send_at: new Date().toISOString(),
          sender_id: senderId,
          timestamp: Date.now(),
        },
      };
      const connect = await Firebase.database()
        .ref(`/chats`)
        .push({ messages: data, room: roomName, members: 1 });
      if (connect.key) {
        setLoading(false);
        setRoom({
          status: true,
          data: {
            room: roomName,
            members: 1,
            roomCode: connect.key,
            userName: userName,
            senderId: senderId,
          },
        });
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
            <Formik
              initialValues={{
                roomName: "",
                userName: "",
              }}
              validationSchema={Schema}
              onSubmit={(values) => {
                createRoom(values);
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
                    id="roomName"
                    label="Room name"
                    type="text"
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    name="roomName"
                    helperText={touched.roomName ? errors.roomName : ""}
                    error={touched.roomName && Boolean(errors.roomName)}
                    value={values.roomName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <TextField
                    autoFocus
                    id="yourNames"
                    label="Your name"
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
                    type="submit"
                    variant="contained"
                    fullWidth
                    color="primary"
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
                      "Create"
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
