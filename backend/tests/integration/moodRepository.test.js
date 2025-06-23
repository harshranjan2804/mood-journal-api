const Mood = require('../../models/Mood');

afterEach(async () => {
  await Mood.deleteMany();
});

describe('Mood Repository', () => {
  it('should create and retrieve mood entries', async () => {
    const mood = new Mood({ mood: 'excited', note: 'Test note' });
    await mood.save();
    const foundMood = await Mood.findOne({ mood: 'excited' });
    expect(foundMood.note).toBe('Test note');
  });

  it('should calculate mood statistics', async () => {
    await Mood.create([
      { mood: 'happy', note: 'Note 1' },
      { mood: 'sad', note: 'Note 2' },
      { mood: 'happy', note: 'Note 3' }
    ]);
    
    const stats = await Mood.aggregate([
      { $group: { _id: '$mood', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    expect(stats).toEqual([
      { _id: 'happy', count: 2 },
      { _id: 'sad', count: 1 }
    ]);
  });
});
