import { sleep } from 'k6';
import { getCourses, getCurrentUser, signOut, signUp } from './api-function.js';

export const options = {
  scenarios: {
    constant_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 250,
      timeUnit: '1s',
      duration: '5m',
      preAllocatedVUs: 50,
      maxVUs: 100,
    },
  },
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
