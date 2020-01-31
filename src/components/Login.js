import React, { useCallback, useContext } from "react";
import { withRouter, Redirect } from "react-router";
import app from "../config/firebase";
import { AuthContext } from "../components/Auth";
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

//material ui 
const useStyles = makeStyles(theme => ({

  bgBlock: {
    height: '100vh',
    backgroundColor: '#1565c0',
  },
  textField: {
    display: 'flex',
    flexDirection: 'column',
    width: 400,
  },
  loginArea: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  }
}));

//history is props
const Login = ({ history }) => {

  const classes = useStyles();  //material ui 

  //function goes here...
  const handleLogin = useCallback(
    async event => {
      event.preventDefault();

      //values from form
      const { email, password } = event.target.elements;
      try {
        await app
          .auth()
          .signInWithEmailAndPassword(email.value, password.value);
        history.push("/");
      } catch (error) {
        //exeption handling
        alert(error);
      }
    },
    [history]
  );

  //getting currentUser from Auth component using context 
  const { currentUser } = useContext(AuthContext);
  //if user credential is not valid
  //currentUser will be null
  //Is valid? then redirect to Home page
  if (currentUser) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <Grid container>
        <Grid item sm={6} md={6} lg={7}>
          <Box
            display={{ xs: 'none', sm: 'block', md: 'block', lg: 'block' }}
            className={classes.bgBlock}
          >
          </Box>
        </Grid>
        <Grid
          item xs={12} sm={6} md={6} lg={5}
          container
          direction="column"
          justify="center"
          alignItems="center"
        >
          <Box
            className={classes.loginArea}
          >
            <form
              onSubmit={handleLogin}
              noValidate
              autoComplete="off"
              className={classes.form}
            >
              <TextField
                id="standard-multiline-flexible"
                name="email"
                label="Email"
                placeholder="Email..."
                className={classes.textField}
                margin="normal"
              />

              <TextField
                id="standard-password-input"
                name="password"
                label="Password"
                className={classes.textField}
                placeholder="Password..."
                type="password"
                autoComplete="current-password"
                margin="normal"
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
              >
                Sign In
            </Button>
            </form>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default withRouter(Login);