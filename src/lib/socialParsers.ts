const normalizeUrl = (value: string): URL | null => {
  if (!value) return null;
  try {
    return new URL(value);
  } catch {
    try {
      return new URL(`https://${value}`);
    } catch {
      return null;
    }
  }
};

const cleanToken = (value: string | null | undefined): string | undefined => {
  if (!value) return undefined;
  const cleaned = value.trim().replace(/^@/, '').replace(/\/+$/, '');
  return cleaned || undefined;
};

export const extractLinkedinId = (rawUrl: string): string | undefined => {
  const url = normalizeUrl(rawUrl);
  if (!url) return undefined;

  const parts = url.pathname.split('/').filter(Boolean);
  if (parts.length < 2) return undefined;

  const scope = parts[0].toLowerCase();
  if (scope === 'in' || scope === 'company' || scope === 'school') {
    return cleanToken(parts[1]);
  }
  return undefined;
};

export const extractFacebookId = (rawUrl: string): string | undefined => {
  const url = normalizeUrl(rawUrl);
  if (!url) return undefined;

  const profileId = cleanToken(url.searchParams.get('id'));
  if (profileId) return profileId;

  const parts = url.pathname.split('/').filter(Boolean);
  if (parts.length === 0) return undefined;

  const candidate = parts[0].toLowerCase();
  if (candidate === 'profile.php' || candidate === 'pages') {
    return parts[1] ? cleanToken(parts[1]) : undefined;
  }
  return cleanToken(parts[0]);
};

export const extractTwitterHandle = (rawUrl: string): string | undefined => {
  const url = normalizeUrl(rawUrl);
  if (!url) return undefined;

  const parts = url.pathname.split('/').filter(Boolean);
  if (parts.length === 0) return undefined;

  const blocked = new Set(['home', 'explore', 'search', 'intent', 'i', 'share']);
  const candidate = cleanToken(parts[0]);
  if (!candidate || blocked.has(candidate.toLowerCase())) {
    return undefined;
  }
  return candidate;
};

