import React, { Component } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography as Text,
} from "@material-ui/core";
import ModalCode from "../Modal/EnterCode";

interface AppProps {}

interface AppState {
  openModalCode: boolean;
}

export default class Welcome extends Component<AppProps, AppState> {
  constructor(props: AppState) {
    super(props);
    this.state = {
      openModalCode: false,
    };
  }

  render() {
    const { openModalCode } = this.state;
    return (
      <div className="app">
        <Grid container justify="center">
          <Grid item lg={8}>
            <Card>
              <CardContent>
                <Box marginY={8} marginX={6}>
                  <Box
                    display="flex"
                    justifyContent="center"
                    marginBottom="20px"
                  >
                    <img src="/slider.svg" alt="img" width="200px" />
                  </Box>
                  <Text variant="h5" align="center" gutterBottom>
                    Kirim pesan ke semua orang sekarang secara gratis.
                  </Text>
                  <Text align="center" gutterBottom>
                    Paperchat memungkinkan kamu membuat ruang diskusi secara
                    terbuka dengan memasukan code room atau bisa membuat baru
                    dan kamu dapat membagikan code room milikmu
                  </Text>
                  <Box marginTop={4} />
                  <Grid container justify="center" spacing={2}>
                    <Grid item>
                      <Button variant="contained" color="primary" fullWidth>
                        Buat room baru
                      </Button>
                    </Grid>
                    <Grid item>
                      <Button
                        variant="outlined"
                        color="primary"
                        fullWidth
                        onClick={() => this.setState({ openModalCode: true })}
                      >
                        Masukan code room
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Show Modal enter code */}
        <ModalCode
          open={openModalCode}
          handleClose={() => this.setState({ openModalCode: false })}
        />
      </div>
    );
  }
}
