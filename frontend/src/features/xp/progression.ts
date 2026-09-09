export type Completion = 'assessment' | 'workshop';
export const levels = [0, 100, 350, 750, 1350, 2250, 3550, 5350, 7850, 11350];
export const levelNames = ['Student Profile', 'Basic Job Applications', 'Premium Challenges', 'Employer Recommendations', 'Advanced Opportunities', 'Verified Contributor', 'Mentor Eligibility', 'Elite Opportunities', 'Industry Recognition', 'Platform Ambassador'];
export function completeActivity(completed: Completion[], id: Completion): Completion[] {
  if (completed.includes(id) || (id === 'workshop' && !completed.includes('assessment'))) return completed;
  return [...completed, id];
}
export function progression(completed: Completion[]) {
  const xp = 890 + (completed.includes('assessment') ? 300 : 0) + (completed.includes('workshop') ? 200 : 0);
  const level = levels.filter(threshold => xp >= threshold).length;
  const next = levels[level];
  const progress = next === undefined ? 1 : (xp - levels[level - 1]) / (next - levels[level - 1]);
  return { xp, level, next, progress };
}
export function ownsOutfit(name: string, completed: Completion[]) {
  return name === 'Campus Hoodie' || (name === 'Career Blazer' && completed.includes('assessment')) || (name === 'Gold Jacket' && progression(completed).level >= 5);
}
