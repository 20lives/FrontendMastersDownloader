export const sanitize = str => str.replace(/\b\)|\(\b|(,$)/gi, '').replace(/\b,/gi, ' -').replace(/[^\w\s-._]/gi, '-');
