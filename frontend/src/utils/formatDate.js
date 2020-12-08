/**
*@return {object}
*@param {object} receivedDate
*/
export const  formatDate = (receivedDate) =>{
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