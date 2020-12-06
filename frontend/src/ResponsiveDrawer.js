// Tina Miryeganeh Assignment6 CSE-183
// Refrences:
// https://material-ui.com/components/drawers/#responsive-drawer
// https://material-ui.com/components/dialogs/
// https://material-ui.com/components/lists/
import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {makeStyles, useTheme} from '@material-ui/core/styles';
import EmailList from './EmailList';
import {getMails} from './services/mail'
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));
/**
*@return{object}
*@param {string} props
*/
function ResponsiveDrawer(props) {
  const {window} = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [inbox, setInbox] = useState([]);
  const [trash, setTrash] = useState([]);
  const [inInbox, setInInbox] = useState(true);
  const [mailboxes, setMailboxes] = useState([]);
  const [selectedMailbox, setSelectedMailbox] = useState('inbox')
  // [{name:'inbox', mail:[]}]
  const getMailCount = (mailboxName)=> mailboxes?.filter(mailbox=> mailbox.name.toLowerCase() === mailboxName.toLowerCase())?.mail?.length
  
  useEffect(()=>{
    getMails().then(mailboxes=>{
      setMailboxes(mailboxes);
    })
  },[]);
  // useEffect(() => {
  //   const mails = emails.map((email) =>
  //     ({...email, received: new Date(email.received)}));
  //   mails.sort((email1, email2) => {
  //     if (email1.received.getTime() > email2.received.getTime()) {
  //       return -1;
  //     }
  //     if (email1.received.getTime() < email2.received.getTime()) {
  //       return 1;
  //     }
  //     return 0;
  //   });
    // spread operator
  //   console.log(mails);
  //   setTrash(mails.filter((email) => email.trash));
  //   setInbox(mails.filter((email) => !email.trash));
  // }, []);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List >
         <ListItem button key="Inbox" onClick={()=>{setSelectedMailbox('inbox')}}>
          <ListItemIcon > <InboxIcon /> </ListItemIcon>
          <ListItemText primary="Inbox" />{getMailCount("inbox")}
        </ListItem>
      </List> 
      <Divider />
      <List >
      <ListItem button key="Starred" onClick={()=>{}}>
          
          <ListItemIcon > <InboxIcon /> </ListItemIcon>
          <ListItemText primary="Starred" />{getMailCount("starred")}
        </ListItem>
        <ListItem button key="Sent" onClick={()=>{}}>
          
          <ListItemIcon > <InboxIcon /> </ListItemIcon>
          <ListItemText primary="Sent" />{getMailCount("Sent")}
        </ListItem>
        <ListItem button key="Drafts" onClick={()=>{}}>
          
          <ListItemIcon > <InboxIcon /> </ListItemIcon>
          <ListItemText primary="Drafts" />
        </ListItem>
        <ListItem button key="Trash" onClick={()=>{}}>
          
          <ListItemIcon > <InboxIcon /> </ListItemIcon>
          <ListItemText primary="Trash" />
        </ListItem>
       
           </List >
           <Divider />
           <List>
        {mailboxes?.filter(mailbox=> mailbox.name !== 'inbox' || mailbox.name !== 'sent'|| mailbox.name !== 'trash')?.map(mailbox=>( <ListItem button key={mailbox.name} onClick={()=>{setSelectedMailbox(mailbox.name)}}>
          <ListItemIcon > <InboxIcon /> </ListItemIcon>
          <ListItemText primary={mailbox.name} />
        </ListItem>
        ))}
       
       

      </List>
    </div>
  );

  const container = window !==
    undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            CSE183 Mail - {inInbox ? 'Inbox' : 'Trash'}
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        
         {/* <EmailList mailbox={selectedMailbox} /> */}
      </main>
    </div>
  );
}


ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};
export default ResponsiveDrawer;
