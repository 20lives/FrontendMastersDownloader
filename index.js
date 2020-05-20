#!/usr/bin/env node

import inquirer from 'inquirer';

import fedApi from './fedApi.js';
import prompts from './prompts.js';

(async function run() {
  const { email, password } = await inquirer.prompt(prompts.login);

  const loginRes = await fedApi.login(email, password);

  if (loginRes.code) {
    console.log(`Login failed: ${loginRes.message}`);
    return;
  }

  return ;
  const list = await fedApi.courses();

  const { hash } = list[0];

  const course = await fedApi.course(hash);

  console.log(course.lessonGroups.map((x) => x.lessons));
})();
