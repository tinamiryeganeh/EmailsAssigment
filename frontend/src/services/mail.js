import {getBearerToken} from './auth';
const BASE_URL =  'http://localhost:3010';


export const getMails = (mailbox, from)=>{
    let url = `${BASE_URL}/v0/mail`
    if (mailbox && from) {
        url += `?mailbox=${mailbox}&from=${from}`;
    } else if (mailbox) {
        url += `?mailbox=${mailbox}`;
    } else if (from) {
        url += `?from=${from}`;
    }
    let config = getConfig();
    return new Promise((resolve, reject)=>{
        fetch(url,config)
          .then(res=> {
              if(res.status === 403){
                  reject ({message: res.statusText, status: res.status})
              }
              if(res.ok){
                  return res.json()
              }
            }          )
          .then(mailboxes=> resolve(mailboxes)).catch(error=>reject(error));
    })
}
export const updateEmail = (email)=>{
    let url = `${BASE_URL}/v0/mail/${email.id}`;
    let config = {...getConfig('patch'), body: JSON.stringify(email)};
    return new Promise((resolve, reject)=>{
        fetch(url,config)
          .then(res=> {
              if(res.status === 403){
                  reject ({message: res.statusText, status: res.status})
              }
              if(res.ok){
                  return res.json()
              }
            }          )
          .then(success=> resolve(success)).catch(error=>reject(error));
    })
    
}

const getConfig = (method = 'get')=>{
    return {
        method: method,
    headers: new Headers({
      'Authorization': `Bearer ${getBearerToken()}`, 
      'Content-Type': 'application/x-www-form-urlencoded'
    })};
}