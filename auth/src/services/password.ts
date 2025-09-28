import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

// scrypt is a callback based function, we need to promisify it to use async/await
// turn call back based function to promise based function
const scryptAsync = promisify(scrypt);

export class Password {
  static async toHash(password: string) {
    const salt = randomBytes(8).toString('hex'); // generate random string
    const buf = (await scryptAsync(password, salt, 64)) as Buffer; // hash the password
    return `${buf.toString('hex')}.${salt}`; // return the hashed password with salt
  }
  static async compare(storedPassword: string, suppliedPassword: string) {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buf.toString('hex') === hashedPassword;
  }
}
