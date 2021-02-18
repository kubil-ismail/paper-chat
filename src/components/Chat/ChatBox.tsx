import React from "react";
import Box from "@material-ui/core/Box";
import Text from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import moment from 'moment';

interface SenderProps {
  body: string;
  name: string;
  time: string;
}

export function Sender(props: SenderProps) {
  const { body, name, time } = props;

  return (
    <Box display="flex" justifyContent="flex-start">
      <div>
        <Grid container spacing={3} justify="flex-start">
          <Grid item>
            <Avatar alt={name} src="/static/images/avatar/1.jpg" />
          </Grid>
          <Grid item>
            <div className="box3 sender sender-first">
              <Text
                align="left"
                style={{ fontSize: "12px", fontWeight: "bold" }}
              >
                {name}
              </Text>
              <Text align="left" style={{ fontSize: "12px" }}>
                {body}
              </Text>
              <Text
                align="right"
                style={{ fontSize: "10px", color: "rgb(90 90 90 / 62%)" }}
              >
                {moment(time).format("HH:mm")}
              </Text>
            </div>
          </Grid>
        </Grid>
      </div>
    </Box>
  );
}

interface ReceiverProps {
  body: string;
  time: string;
}

export function Receiver(props: ReceiverProps) {
  const { body, time } = props;

  return (
    <Box display="flex" justifyContent="flex-end">
      <div>
        <div className="box3 received received-first">
          <Text align="left" style={{ fontSize: "12px" }}>
            {body}
          </Text>
          <Text align="right" style={{ fontSize: "10px", color: "#ffffff9e" }}>
            {moment(time).format("HH:mm")}
          </Text>
        </div>
      </div>
    </Box>
  );
}
