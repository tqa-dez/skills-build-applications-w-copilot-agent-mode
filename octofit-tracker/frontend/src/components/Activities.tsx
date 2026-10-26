import { CapabilityCard } from './CapabilityCard.js';

export default function Activities() {
  return <CapabilityCard title="Activities" description="Track student activity minutes and points." endpoint="/api/activities" emptyMessage="No activities yet." isEmpty={(data) => (data as { activities: unknown[] }).activities.length === 0} renderContent={(data) => <ul>{(data as { activities: { type: string; minutes: number; points: number }[] }).activities.map((activity) => <li key={`${activity.type}-${activity.minutes}-${activity.points}`}>{activity.type}: {activity.minutes} minutes ({activity.points} points)</li>)}</ul>} />;
}
