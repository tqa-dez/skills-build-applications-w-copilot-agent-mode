import { CapabilityCard } from './CapabilityCard.js';

export default function Teams() {
  return <CapabilityCard title="Teams" description="Manage teams and members." endpoint="/api/teams" emptyMessage="No teams yet." isEmpty={(data) => (data as { teams: unknown[] }).teams.length === 0} renderContent={(data) => <ul>{(data as { teams: { name: string; members: string[] }[] }).teams.map((team) => <li key={team.name}>{team.name} ({team.members.length} members)</li>)}</ul>} />;
}
