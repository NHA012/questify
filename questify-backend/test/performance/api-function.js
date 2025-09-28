import http from 'k6/http';
import { check } from 'k6';
import { Counter } from 'k6/metrics';

const successfulSignups = new Counter('successful_signups');
const failedSignups = new Counter('failed_signups');
const duplicateSignups = new Counter('duplicate_signups');

export function randomString(length) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

export function getCurrentUser() {
  return http.get('https://www.questify.site/api/users/currentuser');
}

export function getCourses() {
  return http.get('https://www.questify.site/api/course-mgmt');
}

export function signOut() {
  return http.post('https://www.questify.site/api/users/signout', {});
}

export function signUp() {
  const userName = `testuser_${randomString(8)}`;
  const email = `test_${randomString(8)}@example.com`;
  const password = '12345aB@';

  const validationResponse = http.post(
    'https://www.questify.site/api/users/validate-credentials',
    JSON.stringify({
      userName: userName,
      email: email,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );

  if (
    !check(validationResponse, {
      'Validation successful': (r) => r.status === 201 || r.status === 200,
    })
  ) {
    failedSignups.add(1);
    return null;
  }
  const signupResponse = http.post(
    'https://www.questify.site/api/users/complete-signup',
    JSON.stringify({
      password: password,
      confirmedPassword: password,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );

  if (check(signupResponse, { 'Signup successful': (r) => r.status === 201 || r.status === 200 })) {
    successfulSignups.add(1);

    try {
      const userData = JSON.parse(signupResponse.body);

      if (userData && userData.id) {
        const updateResponse = http.patch(
          `https://www.questify.site/api/users/${userData.id}`,
          JSON.stringify({
            role: 'teacher',
          }),
          {
            headers: { 'Content-Type': 'application/json' },
          },
        );

        if (check(updateResponse, { 'Role update successful': (r) => r.status === 200 })) {
          return userData;
        } else {
          return userData;
        }
      }
    } catch {
      return null;
    }
  } else if (
    signupResponse.status === 409 ||
    (signupResponse.body && signupResponse.body.includes('already exists'))
  ) {
    duplicateSignups.add(1);
    return null;
  } else {
    failedSignups.add(1);
    return null;
  }
}
