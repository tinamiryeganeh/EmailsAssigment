// Tina Miryeganeh Assignment6 CSE-183
// Refrences:
// https://material-ui.com/components/drawers/#responsive-drawer
// https://material-ui.com/components/dialogs/
// https://material-ui.com/components/lists/
import React, {useEffect, useState} from 'react';
import {useHistory } from 'react-router-dom';
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
import {fade, makeStyles, useTheme} from '@material-ui/core/styles';
import EmailList from './EmailList';
import {getMails} from './services/mail'
import StarOutlineSharpIcon from '@material-ui/icons/StarOutlineSharp';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import AccountCircle from '@material-ui/icons/AccountCircle';

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
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
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
  const history = useHistory();
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
  const getMailCount = (mailboxName)=> {
    if(mailboxes?.length>0){
       return mailboxes.find(mailbox=> 
        mailbox.name.toLowerCase() === mailboxName.toLowerCase())?.mail?.length
    }
    return 0;
  }
  useEffect(()=>{
    getMails().then(mailboxes=>{
      setMailboxes(mailboxes);
    }).catch(error=>{
     if(error.status === 403){
       history.push('/login');
     }
    })
  },[]);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const drawer = (
    <div>
      <div className={classes.toolbar} /> 

      <Divider /> 

      <List >
         <ListItem selected={selectedMailbox.toLowerCase() === 'inbox'} button key="Inbox" onClick={()=>{setSelectedMailbox('inbox')}}>
          <ListItemIcon > <InboxIcon /> </ListItemIcon>
          <ListItemText primary={`Inbox`} />{getMailCount("inbox")}
        </ListItem>
      </List> 

      <Divider />

      <List >
      <ListItem selected={selectedMailbox.toLowerCase() === 'starred'} button key="Starred" onClick={()=>{setSelectedMailbox('Starred')}}>
          
          <ListItemIcon > <InboxIcon /> </ListItemIcon>
          <ListItemText primary="Starred" />{getMailCount("starred")}
        </ListItem>
        <ListItem selected={selectedMailbox.toLowerCase() === 'sent'} button key="Sent" onClick={()=>{setSelectedMailbox('Sent')}}>
          
          <ListItemIcon > <InboxIcon /> </ListItemIcon>
          <ListItemText primary="Sent" />{getMailCount("Sent")}
        </ListItem>
        <ListItem selected={selectedMailbox.toLowerCase() === 'drafts'} button key="Drafts" onClick={()=>{setSelectedMailbox('Drafts')}}>
          
          <ListItemIcon > <InboxIcon /> </ListItemIcon>
          <ListItemText primary="Drafts" />{getMailCount("Drafts")}
        </ListItem>
        <ListItem selected={selectedMailbox.toLowerCase() === 'trash'} button key="Trash" onClick={()=>{setSelectedMailbox('Trash')}}>
          
          <ListItemIcon > <InboxIcon /> </ListItemIcon>
          <ListItemText primary="Trash" />{getMailCount("Trash")}
        </ListItem>
      </List >

      <Divider />

      <List>
      <ListItem selected={selectedMailbox.toLowerCase() === 'New Mailbox'} button key="New Mailbox" onClick={()=>{setSelectedMailbox('New Mailbox')}}>
          <ListItemIcon > <InboxIcon /> </ListItemIcon>
          <ListItemText primary="New Mailbox" />
        </ListItem>
     </List>

     <Divider />

     <List>
      <ListItem selected={selectedMailbox.toLowerCase() === 'Setting'} button key="Setting" onClick={()=>{setSelectedMailbox('Setting')}}>
          <ListItemIcon > <InboxIcon /> </ListItemIcon>
          <ListItemText primary="Setting" />
        </ListItem>
     </List>

      <List>
        {mailboxes?.filter(mailbox=> mailbox.name !== 'inbox' && mailbox.name !== 'sent' && mailbox.name !== 'trash')?.map(mailbox=>( <ListItem button key={mailbox.name} onClick={()=>{setSelectedMailbox(mailbox.name)}}>
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

          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>

          <div className={classes.grow} />
          
          <IconButton aria-label="show mails" color="inherit">
              <Badge  color="secondary">
                <MailIcon />
              </Badge>
            </IconButton>

            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>

        </Toolbar>
      </AppBar>


      {/* <Toolbar>
         <Typography variant="h6" noWrap>
            CSE183 Mail - {selectedMailbox}
          </Typography>
      </Toolbar>
       */}

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
         <EmailList mailbox={selectedMailbox} />
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