export const  getTimeDifferenceString = (createdAt) => {
    const createdDate = new Date(createdAt);
    const currentDate = new Date();
  
    const timeDifferenceInMilliseconds = currentDate - createdDate;
  
    // Convert milliseconds to seconds, minutes, hours, and days
    const secondsDifference = Math.floor(timeDifferenceInMilliseconds / 1000);
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);
    const daysDifference = Math.floor(hoursDifference / 24);
  
    if (daysDifference > 0) {
      return `${daysDifference} ${daysDifference === 1 ? "day ago" : "days ago"}`;
    } else if (hoursDifference > 0) {
      return `${hoursDifference} ${hoursDifference === 1 ? "hour ago" : "hours ago"}`;
    } else if (minutesDifference > 0) {
      return `${minutesDifference} ${minutesDifference === 1 ? "minute ago" : "minutes ago"}`;
    } else {
      return "Just now";
    }
  };
  