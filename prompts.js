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

export default {
    login,
};
