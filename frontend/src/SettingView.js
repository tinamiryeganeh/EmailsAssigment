import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import SaveIcon from '@material-ui/icons/Save';

const drawerWidth = 240;
const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  closeButton: {
    marginLeft: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  pos: {
    marginBottom: 12,
  },
  toolbarButtons: {
    marginLeft: 'absolute',
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close"
          className={classes.closeButton}
          onClick={onClose}>
          <ArrowBackIosIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);


/**
*@return {object}
*@param {object} object
*/
export default function SettingView({ email, open, handleClose }) {
  const [fullScreen, setFullScreen] = useState(false);
  const isMobile = () => {
    // credit to Timothy Huang for this regex test:
    // https://dev.to/timhuang/a-simple-way-to-detect-if-browser-is-on-a-mobile-device-with-javascript-44j
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.
      test(navigator.userAgent)) {
      return true;
    } else {
      return false;
    }
  };
  useEffect(() => {
    setFullScreen(isMobile());
  });
 
  return (
    <div>

      <Dialog fullScreen={fullScreen} onClose={handleClose}
        aria-labelledby="customized-dialog-title" maxWidth="lg"
        open={open}>

        <div>
          <DialogTitle id="customized-dialog-title" onClose={handleClose}></DialogTitle>
          <IconButton color="inherit"><SaveIcon /></IconButton>
        </div>

        <DialogContent dividers>
          <Typography gutterBottom>


            {/* <IconButton
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle color="disabled" />
              <p>{`${email.from.name}`}</p>
              <p>{`${email.from.email}`}</p>
              <p>
                <input className="checkBox" type="checkbox"/>
                <label>Remember me</label>
                <input className="button" type="submit" value="Sign in" />
              </p>
            </IconButton> */}

          </Typography>

          {/* <Typography gutterBottom>
            {email.content}
          </Typography> */}

        </DialogContent>
      </Dialog>
    </div>
  );
}

SettingView.propTypes = {
  email: PropTypes.object,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
};
