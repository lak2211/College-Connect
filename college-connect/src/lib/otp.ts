import crypto from 'crypto';

/**
 * Generate a secure 6-digit OTP
 */
export const generateOtp = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Generate OTP expiration time (10 minutes from now)
 */
export const generateOtpExpiration = (): Date => {
  return new Date(Date.now() + 10 * 60 * 1000);
};

/**
 * Check if OTP is expired
 */
export const isOtpExpired = (expiresAt: Date): boolean => {
  return new Date() > expiresAt;
};
