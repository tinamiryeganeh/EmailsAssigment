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

export const moveEmail = (emailId, mailbox)=>{
    let url = `${BASE_URL}/v0/mail/${emailId}?mailbox=${mailbox}`;
    let config = {...getConfig('put')};
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

export const updateEmail = (email)=>{
    let url = `${BASE_URL}/v0/mail/update/${email.id}`;
    let config = {...getConfig('put'), body: JSON.stringify(email)};
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

export const getPicture = ()=> {
    gapi.client.people.people.get({
       'resourceName': 'people/me',
       'pageSize': 10,
       'personFields': 'photos',
     }).then(function(response) {
       var connections = response.result.connections;
       appendPre('Connections:');

       if (connections.length > 0) {
         for (i = 0; i < connections.length; i++) {
           var person = connections[i];
           if (person.url && person.url.length > 0) {
             appendPre(person.names[0].url)
           } else {
             appendPre("No display name found for connection.");
           }
         }
       } else {
         appendPre('No connections found.');
       }
     });
  }

export const createEmail = (email) =>{
    let url = `${BASE_URL}/v0/mail`;
    let config = {...getConfig('post'), body: JSON.stringify(email)};
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
          .then(createdEmail=> resolve(createdEmail)).catch(error=>reject(error));
    })
    

}

const getConfig = (method = 'get')=>{
    return {
        method: method,
    headers: new Headers({
      'Authorization': `Bearer ${getBearerToken()}`, 
      'Content-Type': 'application/json'
    })};
}