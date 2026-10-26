import mongoose from 'mongoose';
import { Activity, Team, User, Workout } from '../models/index.js';

export async function listActivities() {
  return Activity.find().lean();
}

export async function createActivity(input: unknown) {
  if (
    typeof input !== 'object' ||
    input === null ||
    !('userId' in input) ||
    !('teamId' in input) ||
    !('type' in input) ||
    !('minutes' in input) ||
    typeof input.userId !== 'string' ||
    typeof input.teamId !== 'string' ||
    typeof input.type !== 'string' ||
    typeof input.minutes !== 'number'
  ) {
    throw Object.assign(new Error('Activity requires userId, teamId, type, and minutes'), { status: 400 });
  }

  if (!mongoose.isValidObjectId(input.userId) || !mongoose.isValidObjectId(input.teamId)) {
    throw Object.assign(new Error('Activity userId and teamId must be valid IDs'), { status: 400 });
  }

  const [user, team] = await Promise.all([User.findById(input.userId), Team.findById(input.teamId)]);
  if (!user || !team) {
    throw Object.assign(new Error('Activity user and team must exist'), { status: 404 });
  }

  return Activity.create({
    user: user._id,
    team: team._id,
    type: input.type,
    minutes: input.minutes,
    points: input.minutes,
    occurredAt: new Date(),
  });
}

export async function listTeams() {
  return Team.find().lean();
}

export async function createTeam(input: unknown) {
  if (
    typeof input !== 'object' ||
    input === null ||
    !('name' in input) ||
    !('mascot' in input) ||
    typeof input.name !== 'string' ||
    typeof input.mascot !== 'string' ||
    input.name.trim() === '' ||
    input.mascot.trim() === ''
  ) {
    throw Object.assign(new Error('Team requires name and mascot'), { status: 400 });
  }

  const members = 'members' in input ? input.members : [];
  if (!Array.isArray(members) || members.some((member) => typeof member !== 'string' || !mongoose.isValidObjectId(member))) {
    throw Object.assign(new Error('Team members must be valid IDs'), { status: 400 });
  }

  if (members.length > 0) {
    const memberCount = await User.countDocuments({ _id: { $in: members } });
    if (memberCount !== members.length) {
      throw Object.assign(new Error('Team members must exist'), { status: 404 });
    }
  }

  return Team.create({ name: input.name, mascot: input.mascot, members });
}

export async function getLeaderboard() {
  const entries = await Activity.aggregate([
    { $group: { _id: '$team', totalPoints: { $sum: '$points' } } },
    { $lookup: { from: 'teams', localField: '_id', foreignField: '_id', as: 'team' } },
    { $unwind: '$team' },
    { $project: { _id: 0, teamName: '$team.name', totalPoints: 1 } },
    { $sort: { totalPoints: -1, teamName: 1 } },
  ]);

  return entries.map((entry, index) => ({ ...entry, rank: index + 1 }));
}

export async function suggestWorkouts(userEmail: string) {
  const user = await User.findOne({ email: userEmail });
  if (!user) {
    throw Object.assign(new Error('User was not found'), { status: 404 });
  }

  const recentActivity = await Activity.findOne({ user: user._id }).sort({ occurredAt: -1 }).lean();
  const focus = user.fitnessGoal || recentActivity?.type;
  const workouts = focus
    ? await Workout.find({ focus }).sort({ title: 1 }).lean()
    : await Workout.find().sort({ title: 1 }).lean();
  const reason = recentActivity
    ? `Recommended for your ${focus} goal and recent ${recentActivity.type} activity.`
    : `Recommended for your ${focus} goal.`;

  return workouts.map((workout) => ({ ...workout, reason }));
}

export { User };
