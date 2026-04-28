/**
 * Normalizes login API payloads. Backend may return either:
 * - New shape: { message, user: { token, user: { ...profile } } }
 * - Legacy: { token | jwtToken, userDetails | user, userId }
 */
export function getLoginJwt(data: unknown): string | undefined {
  if (!data || typeof data !== 'object') return undefined;
  const d = data as Record<string, unknown>;
  const wrapped = d.user;
  if (wrapped && typeof wrapped === 'object') {
    const token = (wrapped as Record<string, unknown>).token;
    if (typeof token === 'string' && token.length > 0) return token;
  }
  if (typeof d.token === 'string' && d.token.length > 0) return d.token;
  if (typeof d.jwtToken === 'string' && d.jwtToken.length > 0) return d.jwtToken;
  return undefined;
}

export function getLoginUserRecord(data: unknown): Record<string, unknown> | undefined {
  if (!data || typeof data !== 'object') return undefined;
  const d = data as Record<string, unknown>;
  const wrapped = d.user;
  if (wrapped && typeof wrapped === 'object') {
    const inner = (wrapped as Record<string, unknown>).user;
    if (inner && typeof inner === 'object') return inner as Record<string, unknown>;
  }
  if (d.userDetails && typeof d.userDetails === 'object') {
    return d.userDetails as Record<string, unknown>;
  }
  if (wrapped && typeof wrapped === 'object') {
    const w = wrapped as Record<string, unknown>;
    if (!('token' in w) && !('user' in w)) return w;
  }
  return undefined;
}

export function mapLoginResponseToUserFields(data: unknown): {
  _id: string;
  email: string;
  phone_number: string;
  name: string;
  bio: string;
  location: string;
} {
  const u = getLoginUserRecord(data);
  const d = data && typeof data === 'object' ? (data as Record<string, unknown>) : {};
  const id = u?._id ?? u?.id ?? d.userId;
  return {
    _id: typeof id === 'string' ? id : id != null ? String(id) : '',
    email: typeof u?.email === 'string' ? u.email : '',
    phone_number:
      (typeof u?.mobile === 'string' && u.mobile) ||
      (typeof u?.phone === 'string' && u.phone) ||
      (typeof u?.phone_number === 'string' && u.phone_number) ||
      '',
    name: typeof u?.name === 'string' ? u.name : '',
    bio: typeof u?.bio === 'string' ? u.bio : '',
    location:
      (typeof u?.location === 'string' && u.location) ||
      (typeof u?.ville === 'string' && u.ville) ||
      (typeof u?.province === 'string' && u.province) ||
      '',
  };
}
