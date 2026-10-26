import { CapabilityCard } from './CapabilityCard.js';

export default function Leaderboard() {
  return <CapabilityCard title="Leaderboard" description="Compare team point totals." endpoint="/api/leaderboard" emptyMessage="No leaderboard rankings yet." isEmpty={(data) => (data as { leaderboard: unknown[] }).leaderboard.length === 0} renderContent={(data) => <ol>{(data as { leaderboard: { teamName: string; totalPoints: number; rank: number }[] }).leaderboard.map((entry) => <li key={entry.teamName}>{entry.teamName}: {entry.totalPoints} points (rank {entry.rank})</li>)}</ol>} />;
}
