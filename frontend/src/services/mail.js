import {getBearerToken} from './auth';
const BASE_URL =  'http://localhost:3010';
export const getMails = (mailbox, from)=>{
    const url = `${BASE_URL}/v0/mail?mailbox=${mailbox}&from=${from}`
    let config = getConfig();
    return fetch(url,config)
      .then(res=> res.json())
      .then(mailboxes=> mailboxes);
}

const getConfig = (method = 'get')=>{

    return {
        method: method,
    headers: new Headers({
      'Authorization': `Bearer ${getBearerToken()}`, 
      'Content-Type': 'application/x-www-form-urlencoded'
    })};
}