import fetch from 'node-fetch';

import constants from './constants.js';

export default function (timestamp) {
  return fetch(`${constants.fedHasherUrl}${timestamp}`)
    .then((res) => res.json())
    .then((json) => json.hash);
}
