import fetch from 'node-fetch';

import fedHasher from './fedHasher.js';
import constants from './constants.js';

export default {
  login,
  course,
  courses,
};

async function generateTimestamp() {
  timestamp = Math.floor(Date.now() / 1000);
  hash = await fedHasher(timestamp);
}


const baseHeaders = {
  'Host': 'api.frontendmasters.com',
  'content-type': 'application/json; charset=utf-8',
  'user-agent': 'okhttp/3.10.0',
  'accept': 'application/json',
  'x-request-signature' : '',
  'x-client-device': '17ab480f-9f5a-4079-8b78-7fc9a76834b0',
  'x-client-platform': 'android',
};

let timestamp;
let hash;
let token;

async function login(username, password) {
  await generateTimestamp();
  const json = await sendRequest('login/', { password, username });
  token = json.token;
  return json
}

function courses() {
  return sendRequest('courses/?limit=9999');
}

async function course(hash) {
  return sendRequest(`courses/${hash}`);
}

function sendRequest(target, body = null) {
  const options = {
    method: body ? 'post' : 'get' ,
    headers: baseHeaders,
    body: JSON.stringify(body),
  };
  if (!token) {
    options.headers['x-request-signature'] = `timestamp=${timestamp}&hash=${hash}`;
  } else {
    options.headers.authorization = `Bearer ${token}`;
  }
  const url = `${constants.baseUrl}${target}`;
  return fetch(url, options).then(res => res.text()).then(x => JSON.parse(x));
}
