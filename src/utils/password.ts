import bcrypt from "bcrypt";

/**
 * Hash a plain‑text password.
 * Uses bcrypt with the default salt rounds (10).
 */
export const hashPassword = async (plain: string): Promise<string> => {
  const salt = await bcrypt.genSalt();
  return bcrypt.hash(plain, salt);
};

/**
 * Compare a plain‑text password with a stored bcrypt hash.
 * Returns true if they match.
 */
export const comparePassword = async (
  plain: string,
  hash: string,
): Promise<boolean> => {
  return bcrypt.compare(plain, hash);
};
