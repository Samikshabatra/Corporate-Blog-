export function generateSlugClient(input: string): string {
  return input
    .toLowerCase().trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function validateSlugClient(slug: string): { valid: boolean; error: string | null } {
  if (slug.length < 3) return { valid: false, error: 'Slug must be at least 3 characters' };
  if (slug.length > 80) return { valid: false, error: 'Slug must be under 80 characters' };
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { valid: false, error: 'Only lowercase letters, numbers, and hyphens allowed' };
  }
  const reserved = ['admin', 'api', 'auth', 'login', 'register', 'dashboard'];
  if (reserved.includes(slug)) return { valid: false, error: `"${slug}" is a reserved word` };
  return { valid: true, error: null };
}
