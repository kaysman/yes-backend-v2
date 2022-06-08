import * as argon from 'argon2';

export async function hashString(unHashedPassword: string): Promise<string> {
  return await argon.hash(unHashedPassword);
}
