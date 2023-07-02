const mapping: Record<string, string> = {
  applications: 'application',
  bounties: 'bounty',
  leaderboards: 'leaderboard',
  organizations: 'organization',
  users: 'user',
  vulnerabilities: 'vulnerability',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
