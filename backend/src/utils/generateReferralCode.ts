export function generateReferralCode(length = 6) {
  // base36 short code uppercase (alphanumeric)
  return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
}
