const login = [
  {
    type: 'input',
    name: 'email',
    message: 'Email address:',
  },
  {
    type: 'password',
    name: 'password',
    mask: '*',
    message: 'Password:',
  },
];

const searchCourse = [
  {
    type: 'input',
    name: 'query',
    message: 'Search for course by keyword:',
  },
];


const selectCourse = (list) => [
  {
    type: 'list',
    name: 'course',
    message: 'Select a course form search results:',
    choices: list,
  },
];

const selectQuality = (list) => [
  {
    type: 'list',
    name: 'quality',
    message: 'Select download quality:',
    choices: list,
  },
];

export default {
  login,
  searchCourse,
  selectCourse,
  selectQuality,
};
