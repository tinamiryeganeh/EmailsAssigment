// Tina Miryeganeh Assignment6 CSE-183
import React, {useEffect, useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  pos: {
    marginBottom: 12,
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const {children, classes, onClose, ...other} = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close"
          className={classes.closeButton}
          onClick={onClose}>
          <CloseIcon />
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

// const DialogActions = withStyles((theme) => ({
//   root: {
//     margin: 0,
//     padding: theme.spacing(1),
//   },
// }))(MuiDialogActions);
/**
*@return {object}
*@param {object} object
*/
export default function Home({email, open, handleClose}) {
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
      {email && (<Dialog fullScreen={fullScreen} onClose={handleClose}
        aria-labelledby="customized-dialog-title" maxWidth="lg"
        open={open}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {email.subject}
        </DialogTitle>
        <DialogContent dividers>
          <Typography gutterBottom>
            <p>From: {email.from}</p>
            <p>To: {email.email}</p>
            <p>Subject: {email.subject}</p>
            <p>Recieved: {email.received.toString()}</p>
          </Typography>
          <Typography gutterBottom>
            {email.content}
          </Typography>
        </DialogContent>
      </Dialog>)}
    </div>
  );
}

Home.propTypes = {
  email: PropTypes.object,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
};
