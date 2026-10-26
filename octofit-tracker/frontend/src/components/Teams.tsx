import { CapabilityCard } from './CapabilityCard.js';
import { getJson } from '../api/client.js';

const loadTeams = () => getJson('/api/teams');

export default function Teams() {
  return <CapabilityCard title="Teams" description="Manage teams and members." load={loadTeams} emptyMessage="No teams yet." isEmpty={(data) => (data as { teams: unknown[] }).teams.length === 0} renderContent={(data) => <ul>{(data as { teams: { name: string; members: string[] }[] }).teams.map((team) => <li key={team.name}>{team.name} ({team.members.length} members)</li>)}</ul>} />;
}
