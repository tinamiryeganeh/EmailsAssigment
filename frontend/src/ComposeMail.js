// Tina Miryeganeh Assignment9 CSE-183
import React, { useEffect, useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import AccountCircle from '@material-ui/icons/AccountCircle';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { createEmail } from './services/mail';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

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
    flexGrow: 1,
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

const useStyles = makeStyles((theme) => ({
  margin: {
    margin: theme.spacing(1),
  },
}));

const DialogTitle = withStyles(styles)((props) => {
  // const classes = useStyles();
  const { children, classes, onClose,onSend, ...other } = props;

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

      <IconButton aria-label="Send"
      onClick={onSend}
      >
          <ArrowForwardIcon/>
        </IconButton>

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
export default function ComposeMail({ open, handleClose }) {
  const classes = useStyles();
  const [fullScreen, setFullScreen] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const[emailAddress, setEmailAddress] = useState('');
  const [subject, setSubject] = useState('');
  // const [selectedMailbox, setSelectedMailbox] = useState('');
  useEffect(()=>{

    const html = '<p>Hey this <strong>editor</strong> rocks 😀</p>';
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      
      setEditorState(EditorState.createWithContent(contentState));
    }
  },[])
const onSend=()=>{
  createEmail({
    to:{
      name: 'Nima',
      email: emailAddress
    },
    subject: subject,
    content:draftToHtml(convertToRaw(editorState.getCurrentContent()))
  }).then((createdEmail)=>{
    if(createdEmail?.id){
      handleClose();
    }
  })
//   console.log('this is the ocntent', draftToHtml(convertToRaw(editorState.getCurrentContent())));
//  console.log({
//     to:{
//       name: '',
//       email: emailAddress
//     },
//     subject: subject,
//     content:draftToHtml(convertToRaw(editorState.getCurrentContent()))
//   });

}

  // const openDropdown = Boolean(moveMailbox);
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

const onHandleChange = (e)=>{
    const {name,value} = e.target;
    if(name  ==='subject'){
      setSubject(value);
    }else{
      setEmailAddress(value)
    }
  }

  const replyEmail = () => {

  }

  const onEditorStateChange = (editorState) => {
    setEditorState(editorState);
  }

  return (
    <div>

      {(<Dialog fullScreen={fullScreen} onClose={handleClose}
        aria-labelledby="customized-dialog-title" maxWidth="lg"
        open={open}>



        <DialogTitle id="customized-dialog-title" onSend={onSend} onClose={handleClose}></DialogTitle>

        <DialogContent dividers>
          <TextField
            className={classes.margin}
            name="email"
            id="input-with-icon-textfield"
            label="To"
            onChange={onHandleChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle />
                </InputAdornment>
              ),
            }}
          />
          <TextField
          name="subject"
            className={classes.margin}
            onChange={onHandleChange}
            id="input-with-icon-textfield"
            label="Subject"
          />

          <Editor
            editorState={editorState}
            toolbarClassName="toolbarClassName"
            wrapperClassName="wrapperClassName"
            editorClassName="editorClassName"
            onEditorStateChange={onEditorStateChange}
          />
          <textarea
          disabled
          value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        />
        </DialogContent>
      </Dialog>)}
    </div>
  );
}

ComposeMail.propTypes = {

  open: PropTypes.bool,
  handleClose: PropTypes.func,
};
