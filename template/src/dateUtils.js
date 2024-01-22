export function formatDateString(rawDateString) {
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // Use 24-hour format
    };

    const formattedDate = (new Date(rawDateString))
        .toLocaleString('en-US', options);

    return formattedDate;
}