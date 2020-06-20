const sanitize = str => str.replace(/[^\w\s-\._]/gi, '-');
export default sanitize;