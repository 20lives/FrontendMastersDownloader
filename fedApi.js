import fetch from 'node-fetch';
import os from 'os';
import fs from 'fs';

import fedHasher from './fedHasher.js';
import constants from './constants.js';

export default {
  login,
  course,
  search,
  tryExistingTokens,
};

const tokensPath = `${os.homedir}/.frontendmasters-downloader`;

async function generateTimestamp() {
  timestamp = Math.floor(Date.now() / 1000);
  hash = await fedHasher(timestamp);
}

function rndHex(len) {
  const hex = '0123456789abcdef';
  let output = '';
  for (let i = 0; i < len; ++i) {
    output += hex.charAt(Math.floor(Math.random() * hex.length));
  }
  return output;
}

function generateClientDeviceID() {
  return `${rndHex(8)}-${rndHex(4)}-${rndHex(4)}-${rndHex(4)}-${rndHex(12)}`;
}

let timestamp;
let hash;
let token;

const cliendDeviceID = generateClientDeviceID();

const baseHeaders = {
  'Host': 'api.frontendmasters.com',
  'content-type': 'application/json; charset=utf-8',
  'accept': 'application/json',
  'x-request-signature' : '',
  'x-client-device': cliendDeviceID,
  'x-client-platform': 'android',
};

async function login(username, password) {
  await generateTimestamp();
  const json = await sendRequest('login/', { password, username });
  token = json.token;

  if(!json.code) {
    saveTokens();
  }

  return json
}

function saveTokens() {
  fs.writeFileSync(tokensPath, JSON.stringify({ timestamp, hash, token }));
}

async function testTokens(items) {
  timestamp = items.timestamp;
  hash = items.hash;
  token = items.token;

  const session = await sendRequest('session/');
  return !!session.user;
}

async function search(query) {
  const lower = query.toLowerCase();
  const courses = await sendRequest('courses/?limit=9999');
  return courses.filter(course => course.title.toLowerCase().includes(lower));
}

async function course(hash) {
  const json = await sendRequest(`courses/${hash}`)
  const list = json.lessonGroups.reduce((acc, cur) => [...acc, ...cur.lessons], []);
  return list.map(course => {
    const { title, pos, streamingURL, transcriptURL } = course;
    return { title, pos, streamingURL, transcriptURL };
  });
}

function sendRequest(target, body = null) {
  const options = {
    method: body ? 'POST' : 'GET' ,
    headers: baseHeaders,
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  if (!token) {
    options.headers['x-request-signature'] = `timestamp=${timestamp}&hash=${hash}`;
  } else {
    options.headers.authorization = `Bearer ${token}`;
  }
  const url = `${constants.baseUrl}${target}`;
  return fetch(url, options).then(res => res.text()).then(x => JSON.parse(x));
}

async function tryExistingTokens() {
  if (!fs.existsSync(tokensPath)) {
    return false;
  }
  console.log('Existing login found.');
  const tokens = JSON.parse(fs.readFileSync(tokensPath));
  const tokenWorks = await testTokens(tokens);
  if (!tokenWorks) {
    console.log('Existing login expired/not working.')
    return false;
  }
  return true;
}
