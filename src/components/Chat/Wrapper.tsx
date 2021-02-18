import React, { Component } from "react";
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Grid,
  Typography as Text,
  TextField,
  IconButton,
  Menu,
  MenuItem,
} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import MoreVertIcon from "@material-ui/icons/MoreVert";

interface AppProps {}

interface AppState {
  openModalCode: boolean;
  actionAnchor: any;
}

export default class Welcome extends Component<AppProps, AppState> {
  constructor(props: AppState) {
    super(props);
    this.state = {
      openModalCode: false,
      actionAnchor: null,
    };
  }

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
    const { actionAnchor } = this.state;
    return (
      <div>
        <Card variant="outlined">
          <CardHeader
            title="Group title"
            subheader="2k member"
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
            <Box marginY={8} marginX={6}>
              {/* Received */}
              <Box display="flex" justifyContent="flex-end">
                <div>
                  <div className="box3 received received-first">
                    <Text align="left" style={{ fontSize: "12px" }}>
                      WOOOYYYYYY JANCCOOOOKKK
                    </Text>
                  </div>
                </div>
              </Box>
              {[1, 2, 3, 4, 5].map((val) => (
                <Box display="flex" justifyContent="flex-end" key={val}>
                  <div>
                    <div className="box3 received">
                      <Text align="left" style={{ fontSize: "12px" }}>
                        WOOOYYYYYY JANCCOOOOKKK
                      </Text>
                    </div>
                  </div>
                </Box>
              ))}

              {/* Sender */}
              <Box display="flex" justifyContent="flex-start">
                <div>
                  <Grid container spacing={3}>
                    <Grid item>
                      <Avatar
                        alt="Remy Sharp"
                        src="/static/images/avatar/1.jpg"
                      />
                    </Grid>
                    <Grid item>
                      <div className="box3 sender sender-first">
                        <Text
                          align="left"
                          style={{ fontSize: "12px", fontWeight: "bold" }}
                        >
                          Ismanyan
                        </Text>
                        <Text align="left" style={{ fontSize: "12px" }}>
                          WOOOYYYYYY JANCCOOOOKKK APPPAASNN
                        </Text>
                      </div>
                      {[1, 2, 3, 4, 5].map((val) => (
                        <div className="box3 sender" key={val}>
                          <Text
                            align="left"
                            style={{ fontSize: "12px", fontWeight: "bold" }}
                          >
                            Ismanyan
                          </Text>
                          <Text align="left" style={{ fontSize: "12px" }}>
                            WOOOYYYYYY JANCCOOOOKKK APPPAASNN
                          </Text>
                        </div>
                      ))}
                    </Grid>
                  </Grid>
                </div>
              </Box>
            </Box>
          </CardContent>
          <CardActions style={{ borderTop: "1px solid rgba(0, 0, 0, 0.12)" }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item lg={11}>
                <TextField
                  fullWidth
                  variant="filled"
                  InputProps={{ disableUnderline: true }}
                  size="small"
                />
              </Grid>
              <Grid item>
                <Button color="primary" variant="contained">
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
