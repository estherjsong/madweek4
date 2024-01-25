export function formatDateString(rawDateString) {
    const date = new Date(rawDateString);
    const currentDate = new Date();

    const timeDifference = currentDate - date;
    const secondsDifference = Math.floor(timeDifference / 1000);

    const minute = 60;
    const hour = minute * 60;
    const day = hour * 24;

    if (secondsDifference < minute) {
        return `${Math.floor(secondsDifference)} seconds ago`;
    } else if (secondsDifference < hour) {
        const minutes = Math.floor(secondsDifference / minute);
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (secondsDifference < day) {
        const hours = Math.floor(secondsDifference / hour);
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else if (secondsDifference < day * 7) {
        const days = Math.floor(secondsDifference / day);
        return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    } else {
        const options = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false, // Use 24-hour format
        };

        return (new Date(rawDateString)).toLocaleString('en-US', options);
    }
}