const { getMoodStats } = require('../../controllers/moodController');
const Mood = require('../../models/Mood');

describe('Mood Controller - Unit Tests', () => {
  it('should calculate mood statistics correctly', async () => {
    // Mock database response
    Mood.aggregate = jest.fn().mockResolvedValue([
      { _id: 'happy', count: 3 },
      { _id: 'sad', count: 1 }
    ]);

    const stats = await getMoodStats();
    expect(stats.stats).toEqual([
      { _id: 'happy', count: 3 },
      { _id: 'sad', count: 1 }
    ]);
    expect(stats.total).toBe(4);
    expect(stats.average).toBe(2);
  });

  it('should handle empty mood entries', async () => {
    Mood.aggregate = jest.fn().mockResolvedValue([]);
    const stats = await getMoodStats();
    expect(stats.stats).toEqual([]);
    expect(stats.total).toBe(0);
    expect(stats.average).toBe(0);
  });
});
