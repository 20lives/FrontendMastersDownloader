import fetch from 'node-fetch';

import fs from 'fs';

import fedHasher from './fedHasher.js';
import constants from './constants.js';

export default {
  login,
  course,
  search,
  isAuth,
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
  if (getToken() != "") {
    token = getToken();
    return {}
  } else {
    const json = await sendRequest('login/', { password, username });
    token = json.token;
    saveToken(token);
    return json
  }
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

function saveToken(token) {
  let credentialfile = "credential.json";
  fs.readFile(credentialfile, 'utf8', function readFileCallback(err, data){
    if (err){
        console.log(err);
    } else {
    let obj = JSON.parse(data);
    obj.token = token;
    let json = JSON.stringify(obj);
    fs.writeFileSync(credentialfile, json);
}});
}

function getToken() {
  let credentialfile = "credential.json";
  let obj = fs.readFileSync(credentialfile, 'utf8');
  obj = JSON.parse(obj);
  return obj.token;
}

function isAuth() {
  return getToken() != "";
}
