import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const temp = await bcrypt.hash(password, salt);
    return temp;
  } catch (error) {
    console.log(error);
  }
};

export const checkPassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
