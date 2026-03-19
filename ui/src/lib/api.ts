export function graphqlEndpoint(): string {
  // Vite exposes env vars prefixed with VITE_ via import.meta.env
  const base = (import.meta as any).env?.VITE_API_URL || '';
  // If base is empty, using '/graphql' will hit same host the app is served from.
  return `${base}/graphql`.replace(':/', '://').replace('//graphql', '/graphql');
}
