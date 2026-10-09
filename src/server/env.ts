export function env(name: string): string | undefined {
  return process.env[name] || import.meta.env?.[name];
}
export function requireEnv(name: string): string {
  const value = env(name); if (!value) throw new Error(`Missing server configuration: ${name}`); return value;
}
