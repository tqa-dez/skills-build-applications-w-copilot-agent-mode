import { CapabilityCard } from './CapabilityCard.js';
import { getJson } from '../api/client.js';

const loadActivities = () => getJson('/api/activities');

export default function Activities() {
  return <CapabilityCard title="Activities" description="Track student activity minutes and points." load={loadActivities} emptyMessage="No activities yet." isEmpty={(data) => (data as { activities: unknown[] }).activities.length === 0} renderContent={(data) => <ul>{(data as { activities: { type: string; minutes: number; points: number }[] }).activities.map((activity) => <li key={`${activity.type}-${activity.minutes}-${activity.points}`}>{activity.type}: {activity.minutes} minutes ({activity.points} points)</li>)}</ul>} />;
}
