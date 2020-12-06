// Tina Miryeganeh Assignment6 CSE-183
import React, {useState, useEffect} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Home from './Home';
import PropTypes from 'prop-types';


const useStyles = makeStyles({
  table: {
    minWidth: 300,
  },
});

/**
*@return{object}
*@param {string} props
*/
export default function EmailList() {
  const [mailbox, setMailbox] = useState('inbox');
  const getBearerToken =() =>{
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user).accessToken : null;

  }
  const [bearerToken, setBearerToken] = useState(getBearerToken);
  const [emails, setEmails]=  useState([]);
  useEffect(()=>{
    fetch(`http://localhost:3010/v0/mail?mailbox=${mailbox}`,{
      method: 'get',
      headers: new Headers({
        'Authorization': `Bearer ${bearerToken}`, 
        'Content-Type': 'application/x-www-form-urlencoded'
      })
    })
    .then(res=> res.json())
    .then(mailboxes=>{
      console.log(mailboxes);
      setEmails(mailboxes[0].mail);
    })
  },[mailbox]);
  const [open, setOpen] = useState(false);
  const [emailToView, setEmailToView] = useState();
  const onClose = () => {
    setOpen(false);
  };
  const classes = useStyles();
  const viewEmail = (email) => {
    setEmailToView(email);
    setOpen(true);
    console.log(email);
  };
  /**
*@return {object}
*@param {object} receivedDate
*/
  function displayTime(receivedDate) {
    const today = new Date();

    if (receivedDate.getDate() ==
    today.getDate() && receivedDate.getFullYear()==
     today.getFullYear() && receivedDate.getMonth() == today.getMonth()) {
      return receivedDate.toLocaleTimeString(navigator.language, {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (receivedDate.getFullYear() == today.getFullYear()) {
      const formatter = new Intl.DateTimeFormat(navigator.language, {
        month: 'short',
        day: '2-digit',
      });
      return formatter.format(receivedDate);
    } else {
      return receivedDate.getFullYear().toString();
    }
  }
  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">
          <TableBody>
            {emails?.map((email) => (
              <TableRow onClick={
                (e)=>{
                  viewEmail(email);
                }
              }key= {
                email.id
              }>
                <TableCell>
                  {email.from}
                </TableCell>
                <TableCell>{email.subject}</TableCell>
                <TableCell>{displayTime(email.received)}</TableCell>
              </TableRow>

            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Home email={emailToView} open={open} handleClose={onClose} />
    </>
  );
}
EmailList.propTypes = {
  emails: PropTypes.array,
};


