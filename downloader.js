import fetch from 'node-fetch';
import progress from 'progress';
import inquirer from 'inquirer';
import prompts from './prompts.js';
import fs from 'fs';
import readline from 'readline';
import util from 'util';
import { spawn } from 'child_process';

import { sanitize } from './utils.js';

let total;
let dir;

function setDir(_dir) {
  dir = _dir;
}

function setTotal(_total) {
  total = _total;
}

function download(url, id, title, ext) {
  const filename = sanitize(`${id + 1}. ${title}.${ext}`);

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

  const formats = await getQuality(url);

  // for Default Quality
  const desres = '960x540'; // desired resolution
  let video = formats.filter((f) => {
    return f.resolution == desres
  })
  let audio = formats.filter((f) => {
    return f.resolution == 'audio'
  })
  video = video.length > 0 ? video[0] : null;
  audio = audio.length > 0 ? audio[1] : null;
  let format = video && audio ? `${video.format}+${audio.format}` : (video.format || 'best')


  // for ask quality desired
  // const list = formats.map((format) => {
  //   const {format_code, extension, resolution, note} = format;
  //   return {
  //     name: `${resolution} - ${extension} (${note})`,
  //     value: format,
  //   };
  // });
  
  // let audios = list
  // audios.push({
  //   name: `default`,
  //   value: null,
  // })
  // const {video} = await inquirer.prompt(prompts.selectVideoQuality(list));
  // const {audio} = await inquirer.prompt(promps.selectAudioQuality(audios));

  // let format = video.format || 'best';
  // if (audio) format = format + `+${audio.format}`;
  
  console.log('== Format : '+format+' ==')

  const run = await spawn('youtube-dl',  [`-f ${format}`, url, `-o${destPath}`]);

  run.stdout.on('data', data  => console.log(data.toString()));
  run.stderr.on('data', data  => console.log(data.toString()));
  return new Promise(resolve => run.on('exit', resolve));
}

async function getQuality(url) {
  const run = await spawn('youtube-dl',  ['-F', url]);

  run.stdout.setEncoding('utf8');
  return new Promise(function(resolve) {
    run.stdout.on('data', function(data){
      let str = data.toString();
      str = str.substring(str.indexOf("[info]"));
      if (str.indexOf("[info]")>=0) {
        str = str.replace("[info] Available formats for master:", "")
        str = str.replace(/format|code|extension|resolution|note/gi, "");
        let formats = str.split(/(\r?\n)/g).filter((s) => s.trim() != "").map(function(d){
          let sf = d.split(/\s+/)
          let tf = {
            format: sf[0],
            extension: sf[1],
            resolution: sf[2],
            note: sf.slice(3).join(" ")
          }
          return tf
        });

        resolve(formats);
      }
    })
  });
}

export default {
  download,
  setDir,
  setTotal,
  hlsdl,
}
