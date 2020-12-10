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
import SettingView from './SettingView';
import SearchView from './SearchView';
import ComposeView from './SettingView';
import {getMails} from './services/mail'
import StarOutlineSharpIcon from '@material-ui/icons/StarOutlineSharp';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { yellow } from "@material-ui/core/colors";
import StarIcon from '@material-ui/icons/Star';
import SendIcon from '@material-ui/icons/Send';
import DraftsIcon from '@material-ui/icons/Drafts';
import DeleteIcon from '@material-ui/icons/Delete';
import SettingsIcon from '@material-ui/icons/Settings';
import AddIcon from '@material-ui/icons/Add';
import ComposeMail from './ComposeMail';

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
  let timerId;
  const history = useHistory();
  const {window} = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [inbox, setInbox] = useState([]);
  const [trash, setTrash] = useState([]);
  const [inInbox, setInInbox] = useState(true);
  const [mailboxes, setMailboxes] = useState([]);
  const [selectedMailbox, setSelectedMailbox] = useState('inbox');
  const [searchText, setSearchText]= useState('');
  const [SelectedSetting, setSelectedSetting]= useState('');
  const [ firstLoad, setFirstLoad] = useState(true);
  const [openComposeMailDialog, setOpenComposeMailDialog]= useState(false);
  // [{name:'inbox', mail:[]}]
  const closeComposeMailDialog = ()=>{
    setOpenComposeMailDialog(false);
  }
  const getMailCount = (mailboxName)=> {
    if(mailboxes?.length>0){
       return mailboxes.find(mailbox=> 
        mailbox.name.toLowerCase() === mailboxName.toLowerCase())?.mail?.length
    }
    return 0;
  }
  const getUnReadMails = (mailboxName)=> {
    if(mailboxes?.length>0){
       return mailboxes.find(mailbox=> 
        mailbox.name.toLowerCase() === mailboxName.toLowerCase())?.mail?.filter(m=> !m.read)?.length
    }
    return 0;
  }

  const loadMailboxes = ()=>{
    getMails().then(mailboxes=>{
      setMailboxes(mailboxes);
    }).catch(error=>{
     if(error.status === 403){
       history.push('/login');
     }
    })
  }
  useEffect(()=>{
   loadMailboxes();
  },[]);

  useEffect(()=>{
    if(firstLoad){
     setFirstLoad(false);
    }else{
      setMobileOpen(!mobileOpen);
    }
    
  },[selectedMailbox])
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const onRefreshMailbox = ()=>{
    loadMailboxes();
  }


  const onSearchChange = (e)=>{
    if(timerId){
      clearTimeout(timerId);
    }
    timerId =setTimeout(() => {
      setSearchText(e.target.value);
    }, 300);
  }


  const drawer = (
    <div>
      <div className={classes.toolbar} /> 

      <Divider /> 

      <List >
         <ListItem selected={selectedMailbox.toLowerCase() === 'inbox'} button key="Inbox" onClick={()=>{setSelectedMailbox('inbox')}}>
          <ListItemIcon > <InboxIcon /> </ListItemIcon>
          <ListItemText primary={`Inbox`} />{getUnReadMails("inbox")}
        </ListItem>
      </List> 

      <Divider />

      <List >
      <ListItem selected={selectedMailbox.toLowerCase() === 'starred'} button key="Starred" onClick={()=>{setSelectedMailbox('Starred')}}>
          
          <ListItemIcon > <StarIcon style={{ color: yellow[500] }} /> </ListItemIcon>
          <ListItemText primary="Starred" />{getMailCount("starred")}
        </ListItem>
        <ListItem selected={selectedMailbox.toLowerCase() === 'sent'} button key="Sent" onClick={()=>{setSelectedMailbox('Sent')}}>
          
          <ListItemIcon > <SendIcon /> </ListItemIcon>
          <ListItemText primary="Sent" />
        </ListItem>
        <ListItem selected={selectedMailbox.toLowerCase() === 'drafts'} button key="Drafts" onClick={()=>{setSelectedMailbox('Drafts')}}>
          
          <ListItemIcon > <DraftsIcon /> </ListItemIcon>
          <ListItemText primary="Drafts" />{getMailCount("Drafts")}
        </ListItem>
        <ListItem selected={selectedMailbox.toLowerCase() === 'trash'} button key="Trash" onClick={()=>{setSelectedMailbox('Trash')}}>
          
          <ListItemIcon > <DeleteIcon /> </ListItemIcon>
          <ListItemText primary="Trash" />{getMailCount("Trash")}
        </ListItem>
      </List >

      <Divider />

      <List>
      <ListItem selected={selectedMailbox.toLowerCase() === 'New Mailbox'} button key="New Mailbox" onClick={()=>{setSelectedMailbox('New Mailbox')}}>
          <ListItemIcon > <AddIcon /> </ListItemIcon>
          <ListItemText primary="New Mailbox" />
        </ListItem>
     </List>

     <Divider />

     <List>
      <ListItem button key="Setting" onClick={()=>{setSelectedMailbox('setting')}}>
          <ListItemIcon > <SettingsIcon /> </ListItemIcon>
          <ListItemText primary="Setting" />
        </ListItem>
     </List>

      <List>
        {mailboxes?.filter(mailbox=> mailbox.name !== 'starred' && mailbox.name !== 'inbox' && mailbox.name !== 'sent' && mailbox.name !== 'trash')?.map(mailbox=>( <ListItem button key={mailbox.name} onClick={()=>{setSelectedMailbox(mailbox.name)}}>
          <ListItemIcon > <InboxIcon /> </ListItemIcon>
          <ListItemText primary={mailbox.name} />{getUnReadMails(mailbox.name)}
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
              // onClick={}
              onChange={onSearchChange}
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>

          <div className={classes.grow} />
          
          <IconButton 
            aria-label="show mails" 
            color="inherit"
            onClick={()=> setOpenComposeMailDialog(true)}
          >
                <MailIcon />
            </IconButton>


            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              // onClick={}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>

        </Toolbar>
      </AppBar>

      <Typography variant="h6" noWrap>
            CSE183 Mail - {selectedMailbox}
          </Typography>

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
         <EmailList refreshMailbox={onRefreshMailbox} mailbox={selectedMailbox} searchText={searchText} />
         <ComposeMail open={openComposeMailDialog} handleClose={closeComposeMailDialog} />
         {/* <SettingView mailbox={selectedMailbox} />
         <SearchView mailbox={selectedMailbox} />
         <ComposeView mailbox={selectedMailbox} /> */}
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