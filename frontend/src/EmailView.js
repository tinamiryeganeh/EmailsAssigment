// Tina Miryeganeh Assignment9 CSE-183
import React, { useEffect, useState } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import MarkunreadIcon from '@material-ui/icons/Markunread';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import DeleteIcon from '@material-ui/icons/Delete';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { formatDate } from './utils/formatDate';
import { moveEmail, updateEmail,getMails } from './services/mail'
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import StarIcon from '@material-ui/icons/Star';
import { yellow } from "@material-ui/core/colors";
import StarOutlineIcon from '@material-ui/icons/StarOutline';


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
    flexGrow:1,
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

// const useStyles = makeStyles((theme) => ({
//   root: {
//     flexGrow: 1,
//   },
//   menuButton: {
//     marginRight: theme.spacing(2),
//   },
//   title: {
//     flexGrow: 1,
//   },
// }));

const DialogTitle = withStyles(styles)((props) => {
  // const classes = useStyles();
  const { children, classes, onClose, handleChange, markUnread, moveEmailToTrash,mailbox,moveEmailToMailbox, ...other } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const [mailboxes, setMailboxes] = useState([]);

  const open = Boolean(anchorEl);
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  useEffect(()=>{
    loadMailboxes();
  },[])

  const loadMailboxes = ()=>{
    getMails().then(mailboxes=>{
      setMailboxes(mailboxes);
    }).catch(error=>{
     if(error.status === 403){
       history.push('/login');
     }
    })
  }

  const handleClose = () => {
    setAnchorEl(null);
  };
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
       <IconButton 
          onClick={markUnread}
          color="inherit"
          >
          <MarkunreadIcon />
        </IconButton>

        <IconButton 
             aria-label="Move to anouther mailbox"
            aria-controls="menu-appbar"
            onClick={handleMenu} 
            color="inherit"
          > 
            <SaveAltIcon />
          </IconButton>
       
          <Menu
           id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
             vertical: 'bottom',
             horizontal: 'left',
           }}
           keepMounted
           transformOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
           }}
           open={open}
                onClose={handleClose}
          >
            {mailboxes?.filter(mbox=> mbox.name !== 'starred' && mbox.name.toLowerCase() !== mailbox.toLowerCase() && mbox.name !== 'sent' && mbox.name !== 'trash')?.map(filteredMailbox=>
            (<MenuItem key={filteredMailbox.name} onClick={()=>moveEmailToMailbox(filteredMailbox.name)}>{filteredMailbox.name}</MenuItem>))}
          </Menu>
          
          <IconButton onClick={moveEmailToTrash} color="inherit"><DeleteIcon /></IconButton>
       
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
export default function EmailView({ email, open, handleClose, mailbox }) {
  const [fullScreen, setFullScreen] = useState(false);
  // const [selectedMailbox, setSelectedMailbox] = useState('');
  const [moveMailbox, setMoveMailbox] = useState(null);
  const [isStarred, setIsStarred] = useState(email?.starred);
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
  const moveEmailToMailbox = (name)=>{
    moveEmail(email.id, name).then(success => {
      if (success) {
        handleClose();
      }
    });
  }
  const handleChange = (event) => {
    setMoveMailbox(event.currentTarget);
  };
  useEffect(() => {
    setFullScreen(isMobile());
  });
  const moveEmailToTrash = () => {
    moveEmail(email.id, 'trash').then(success => {
      if (success) {
        handleClose();
      }
    });
  }
  const markUnread = ()=>{
    updateEmail({...email, read:false}).then(success => {
      if (success) {
        handleClose();
      }
    });
  }
  const replyEmail= ()=>{

  }
  const modifyEmail = async (email) => {
    try {
      const success = await updateEmail(email);
      if (success) {
      setIsStarred(email.starred);
      }
    } catch (ex) {

    }
  }

  return (
    <div>

      {email && (<Dialog fullScreen={fullScreen} onClose={handleClose}
        aria-labelledby="customized-dialog-title" maxWidth="lg"
        open={open}>

      
        
          <DialogTitle moveEmailToMailbox={moveEmailToMailbox} mailbox={mailbox} id="customized-dialog-title" moveEmailToTrash={moveEmailToTrash} handleChange={handleChange} markUnread={markUnread} onClose={handleClose}></DialogTitle>
          
    





            {/* <MenuItem value="">
            <em>None</em>
            </MenuItem>
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>    
            */}



         

        <DialogContent dividers>
          <Typography gutterBottom>


          <Typography gutterBottom>
              {email.subject}
            </Typography>

            <Typography variant="h6" noWrap>
             {mailbox}
          </Typography>
          <IconButton>{isStarred? (<StarIcon style={{ color: yellow[500] }} onClick={() => {
                  modifyEmail({ ...email, starred: false })
                }} />) : (<StarOutlineIcon onClick={() => {
                  modifyEmail({ ...email, starred: true })
                }} />)}
          </IconButton>


         

            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              color="inherit"
            >
              <AccountCircle fontSize="large" color="disabled" />
              <p>{`${email.from.name}`}</p>
              <p>{`${email.from.email}`}</p>
              <p>{formatDate(email.received)}</p>
              <IconButton onClick={replyEmail} color="inherit"><ArrowBackIcon /></IconButton>
            </IconButton>


            {/* <p>To: {`${email.to.name}<${email.to.email}>`}</p>
            <p>Subject: {email.subject}</p> */}

          </Typography>

          <Typography gutterBottom>
            {email.content}
          </Typography>

        </DialogContent>
      </Dialog>)}
    </div>
  );
}

EmailView.propTypes = {
  email: PropTypes.object,
  open: PropTypes.bool,
  handleClose: PropTypes.func,
};
