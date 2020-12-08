// Tina Miryeganeh Assignment6 CSE-183
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
// import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import EmailView from './EmailView';
import PropTypes from 'prop-types';
import { getMails } from './services/mail';
import AccountCircle from '@material-ui/icons/AccountCircle';
import StarOutlineIcon from '@material-ui/icons/StarOutline';
import { formatDate } from './utils/formatDate';
import { yellow } from "@material-ui/core/colors";
import StarIcon from '@material-ui/icons/Star';
import { updateEmail } from "./services/mail";

const useStyles = makeStyles({
  table: {
    minWidth: 300,
  },
  bold:{
    fontWeight: 900
  }
});




/**
*@return{object}
*@param {string} props
*/
export default function EmailList({ mailbox }) {

  const [emails, setEmails] = useState([]);
  useEffect(() => {
    loadEmails()
  }, [mailbox]);

  const loadEmails = () => {
    getMails(mailbox)
      .then(mailboxes => {
        if (mailboxes?.length > 0) {
          let mails = mailboxes[0].mail.map((email) =>
            ({ ...email, received: new Date(email.received) }));
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
        } else {
          setEmails([]);
        }
      });
  }

  const [open, setOpen] = useState(false);
  const [emailToView, setEmailToView] = useState();
  const onClose = () => {
    setOpen(false);
  };

  const classes = useStyles();
  const viewEmail = (e, email) => {
    console.log(e);
    if (e.target?.nodeName !== 'svg') {
      setEmailToView(email);
      setOpen(true);
      if (!email.read) {
        updateEmail({ ...email, read: true });
      }
    }
  };

  const updateEmail = async (email)=>{
    try{
      const success = await updateEmail(email);
      if (success) {
        loadEmails();
      }
    }catch(ex){

    }
  }


  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="simple table">

          <TableBody>
            {emails?.length > 0 && emails?.map((email) => (
              <TableRow onClick={
                (e) => {
                  viewEmail(e, email);
                }
              } key={
                email.id
              }>
                <AccountCircle />
                <div className={!email.read?classes.bold:""}>{email.from.name}</div>
                <div className={!email.read?classes.bold:""}>{email.subject}</div>
                <div>{email.content.substring(0, 30)}{email.content.length > 30 ? '...' : ''}</div>
                <TableCell>{formatDate(email.received)}</TableCell>
                {email.starred ? (<StarIcon style={{ color: yellow[500] }} onClick={() => {
                  updateEmail({ ...email, starred: false })
                }} />) : (<StarOutlineIcon onClick={() => {
                  updateEmail({ ...email, starred: true })
                }} />)}
              </TableRow>
            ))}
          </TableBody>

        </Table>
      </TableContainer>

      <EmailView email={emailToView} open={open} handleClose={onClose} />
    </>
  );
}
EmailList.propTypes = {
  emails: PropTypes.array,
};


