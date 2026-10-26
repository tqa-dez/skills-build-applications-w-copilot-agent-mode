import { CapabilityCard } from './CapabilityCard.js';
import { getJson } from '../api/client.js';

export default function Workouts() {
  return <CapabilityCard title="Workout suggestions" description="Recommend workouts from activity patterns." load={() => getJson('/api/workouts/suggestions/mona%40example.com')} emptyMessage="No workout suggestions yet." isEmpty={(data) => (data as { suggestions: unknown[] }).suggestions.length === 0} renderContent={(data) => <ul>{(data as { suggestions: { title: string; reason?: string }[] }).suggestions.map((suggestion) => <li key={suggestion.title}>{suggestion.title}{suggestion.reason ? `: ${suggestion.reason}` : ''}</li>)}</ul>} />;
}
