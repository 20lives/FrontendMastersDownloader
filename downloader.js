import fetch from 'node-fetch';
import progress from 'progress';
import fs from 'fs';
import readline from 'readline';
import util from 'util';
import { spawn } from 'child_process';

let total;
let dir;

function setDir(_dir) {
  dir = _dir;
}

function setTotal(_total) {
  total = _total;
}

function download(url, id, title, ext) {
  const filename = `${id + 1}. ${title}.${ext}`.replace(/[^\w\s-\._]/gi, '-')

  const destPath = `${dir}/${filename}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  if (fs.existsSync(destPath)) {
    console.log('File already exists, skips');
    return;
  }

  return fetch(url).then((data) => {
    const bar = new progress( `[:bar] (${id + 1}/${total}): ${title}`, {
      complete: '=',
      incomplete: ' ',
      width: 30,
      total: Number(data.headers.get('content-length')),
    });

    data.body.pipe(fs.createWriteStream(destPath));
    data.body.on('data', (chunk) => bar.tick(chunk.length));
    return new Promise((resolve) => data.body.on('end', resolve));
  });
}

async function hlsdl(url, id, title, ext) {

  const filename = `${id + 1}. ${title}.mp4`.replace(/[^\w\s-\._]/gi, '-')

  const destPath = `${dir}/${filename}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  if (fs.existsSync(destPath)) {
    console.log('File already exists, skips');
    return;
  }

  const run = await spawn('youtube-dl',  [`-o${destPath}`, url]);

  run.stdout.on('data', data  => console.log(data.toString()));
  run.stderr.on('data', data  => console.log(data.toString()));
  return new Promise(resolve => run.on('exit', resolve));
}

export default {
  download,
  setDir,
  setTotal,
  hlsdl,
}
