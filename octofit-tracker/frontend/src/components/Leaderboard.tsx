import { CapabilityCard } from './CapabilityCard.js';
import { getJson } from '../api/client.js';

type LeaderboardData = { leaderboard: { teamName: string; totalPoints: number; rank: number }[] };

function renderLeaderboard(data: unknown) {
  const entries = (data as LeaderboardData).leaderboard;
  return <ol>{entries.map((entry) => <li key={entry.teamName}>{entry.teamName}: {entry.totalPoints} points (rank {entry.rank})</li>)}</ol>;
}

export default function Leaderboard() {
  return <CapabilityCard title="Leaderboard" description="Compare team point totals." load={() => getJson('/api/leaderboard')} emptyMessage="No leaderboard rankings yet." isEmpty={(data) => (data as LeaderboardData).leaderboard.length === 0} renderContent={renderLeaderboard} />;
}
