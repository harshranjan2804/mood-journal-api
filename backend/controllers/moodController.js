// backend/controllers/moodController.js
const Mood = require('../models/Mood');

async function getMoodStats() {
  const stats = await Mood.aggregate([
    { $group: { _id: '$mood', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  const total = stats.reduce((sum, stat) => sum + stat.count, 0);
  const average = stats.length > 0 ? total / stats.length : 0;
  return { stats, total, average };
}

module.exports = { getMoodStats };
