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
import {getMails} from './services/mail';

const useStyles = makeStyles({
  table: {
    minWidth: 300,
  },
});

/**
*@return{object}
*@param {string} props
*/
export default function EmailList({mailbox}) {
  

 
  const [emails, setEmails]=  useState([]);
  useEffect(()=>{
    getMails(mailbox)
    .then(mailboxes=>{
      if(mailboxes?.length>0){
        let mails = mailboxes[0].mail.map((email) =>
        ({...email, received: new Date(email.received)}));
      mails.sort((email1, email2) => {
        if (email1.received.getTime() > email2.received.getTime()) {
          return -1;
        }
        if (email1.received.getTime() < email2.received.getTime()) {
          return 1;
        }
        return 0;
      });
        setEmails(mails);
      }else{
        setEmails([]);
      }
    });
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
            {emails?.length > 0 && emails?.map((email) => (
              <TableRow onClick={
                (e)=>{
                  viewEmail(email);
                }
              }key= {
                email.id
              }>
                <TableCell>
                  {email.from.name}
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


