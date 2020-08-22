import fetch from 'node-fetch';
import progress from 'progress';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';

import { sanitize } from './utils.js';

let total;
let dir;

function setDir(_dir) {
  dir = _dir;
}

function setTotal(_total) {
  total = _total;
}

async function download(url, id, title, ext) {
  const filename = sanitize(`${id + 1}. ${title}.${ext}`);
  const destPath = `${dir}/${filename}`;

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  if (fs.existsSync(destPath)) {
    console.log('File already exists, skips');
    return;
  }

  const progressLine = `[:bar] (${id + 1}/${total}): ${title} (${ext})`;

  if (ext == 'srt') {
    const bar = new progress( progressLine, { width: 30, total: 100 });
    const data = await fetch(url);
    const { body } = data;

    bar.total  = Number(data.headers.get('content-length'));

    body.pipe(fs.createWriteStream(destPath));
    body.on('data', (chunk) => bar.tick(chunk.length));

    return new Promise(resolve => body.on('end', resolve));
  } else if (ext == 'mp4') {
    const bar = new progress( progressLine, { width: 30, total: 100 });

    const update = prog => bar.tick(prog.percent - bar.curr);
    const run = ffmpeg(url).on('progress', update).save(destPath);

    return new Promise(resolve => run.on('end', resolve));
  }
}

export default {
  download,
  setDir,
  setTotal,
};
