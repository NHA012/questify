import { getCourses, getCurrentUser, signOut, signUp } from './api-function.js';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 500 },
    { duration: '2m', target: 1000 },
    { duration: '1m', target: 0 },
  ],
};

export default function () {
  const signUpResult = signUp();

  if (signUpResult) {
    getCurrentUser();
    getCourses();
  } else {
    // eslint-disable-next-line no-undef
    console.log('Sign-up failed');
  }
  signOut();
  sleep(1);
}
