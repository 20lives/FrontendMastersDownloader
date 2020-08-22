#!/usr/bin/env node

import inquirer from 'inquirer';

import fedApi from './fedApi.js';
import prompts from './prompts.js';
import dl from './downloader.js';
import { sanitize } from './utils.js';

(async function run() {
  if (!(await fedApi.tryExistingTokens())) {

    const { email, password } = await inquirer.prompt(prompts.login);
    const loginRes = await fedApi.login(email, password);

    if (loginRes.code) {
      console.log(`Login failed: ${loginRes.message}`);
      return;
    }
  }

  let searchCourseRes = [];
  while (searchCourseRes.length < 1) {
    const searchCoursePromptRes = await inquirer.prompt(prompts.searchCourse);
    const { query } = searchCoursePromptRes;
    searchCourseRes = await fedApi.search(query);

    if (searchCourseRes.length < 1) {
      console.log('No results found, try again.');
    }
  }

  const list = searchCourseRes.map((course) => {
    const { title, instructors, hasCC, durationSeconds } = course;
    return {
      name: `${title} - ${instructors[0].name} (${parseInt(durationSeconds / 3600)} hours, ${parseInt(durationSeconds / 60 % 60)} minutes) ${hasCC ? '[CC]' : ''}`,
      value: course,
    };
  });

  const { course } = await inquirer.prompt(prompts.selectCourse(list));

  const answers = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'download',
      message: `download ${course.title}? (Y/n)`,
      default: true,
    },
  ]);

  const downloadList = await fedApi.course(course.hash);

  dl.setDir( `./${sanitize(course.title)}/`);
  dl.setTotal(downloadList.length);

  for (const file of downloadList) {
    const { streamingURL, transcriptURL, pos, title } = file;
    await dl.download( transcriptURL, pos, title, 'srt');
    await dl.download( streamingURL, pos, title, 'mp4');
  }

})();
