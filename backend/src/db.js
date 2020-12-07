const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

// needs to accept anouther param (userid).
//modify the Where and check the user if id as well.(modify our query to include userid) this usser id we get from token
exports.selectEmails = async (mailbox, from, userid) => {
  let select = 'SELECT id, mail, mailbox FROM mail';
  const query = {
    text: '',
    values: [],
  };
  
  if (from && mailbox && userid) {
    select += ` WHERE userid = $1 and mail->>'from' ~* $2 and mailbox ~* $3`;
    query.values = [userid, from , mailbox];
  } else if (mailbox && userid) {
    select += ` WHERE userid = $1 and mailbox ~* $2`;
    query.values = [userid, mailbox];
  } else if (from && userid) {
    select += ` WHERE userid = $1 and mail->>'from' ~* $2`;
    query.values = [userid, from];
  }else{
    select += ` WHERE userid = $1`;
    query.values = [userid];
  }
  query.text = select;
  console.log('-------------------------------------------------------------------------------');
  console.log(query);
  const {rows} = await pool.query(query);
   console.log(rows[0]);
   console.log('-------------------------------------------------------------------');
  const groupedMails = rows?.length ? new Map() : null;
  for (const row of rows) {
    if (groupedMails.has(row.mailbox)) {
      const value = groupedMails.get(row.mailbox);
      value.push({id: row.id, ...row.mail});
      groupedMails.set(row.mailbox, value);
    } else {
      groupedMails.set(row.mailbox, [{id: row.id, ...row.mail}]);
    }
  }
  // console.log(groupedMails);
  return groupedMails;
};

exports.selectEmail = async (id) => {
  const select = 'SELECT id, mail,mailbox FROM mail WHERE id = $1';
  // console.log(id);
  const query = {
    text: select,
    values: [id],
  };
  const {rows} = await pool.query(query);
  // console.log(rows);
  // console.log(select.id);
  return rows.length == 1 ? {
    id: rows[0].id, ...rows[0].mail, mailbox: rows[0].mailbox}: undefined;
};


exports.insertEmail = async (mailbox, mail, userid) => {
  const insert = 'INSERT INTO mail(mailbox, mail, userid) VALUES ($1, $2, $3) RETURNING id, mail';
  const query = {
    text: insert,
    values: [mailbox, mail, userid],
  };
  const {rows} = await pool.query(query);
  return {id: rows[0].id, ...rows[0].mail};
};

exports.moveEmail = async (mail, mailbox) =>{
  const update = 'UPDATE mail SET mailbox = $1 WHERE id = $2';
  const query = {
    text: update,
    values: [mailbox, mail.id],
  };
  const {rowCount} = await pool.query(query);
  return rowCount>0;
};

exports.selectUserByEmail = async (email) => {
  let select = `SELECT userid, userinfo FROM users where userinfo->>'email' ~* $1`;
  const query = {
  text: select,
  values: [email],
  };
  
  const {rows} = await pool.query(query);

  return rows.length>0? {id: rows[0].userid, ...rows[0].userinfo}: null;
  };

// exports.getUserByEmail = async (email) =>{
//   //const select = await exports.selectEmail();
//   // const select = `SELECT * FROM users`;
//   const select = 'SELECT userinfo FROM users WHERE email = $1';
//   const query = {
//     text: select,
//     values: [],
//   };
//   const {rows} = await pool.query(query);
//   console.log(rows[0]);
//   return rows.length == 1 ? {
//     id: rows[0].user_id, ...rows[0].user}: undefined; 
// };
// console.log(`Connected to database '${process.env.POSTGRES_DB}'`);
