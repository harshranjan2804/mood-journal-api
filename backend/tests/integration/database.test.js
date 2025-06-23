const Mood = require('../../models/Mood');

describe('Database Integration Tests', () => {
  it('should create and retrieve mood entries', async () => {
    const mood = new Mood({ mood: 'excited', note: 'Test note' });
    await mood.save();
    const foundMood = await Mood.findOne({ mood: 'excited' });
    expect(foundMood.note).toBe('Test note');
  });

  it('should update mood entries', async () => {
    const mood = await Mood.create({ mood: 'neutral', note: 'Original' });
    mood.note = 'Updated';
    await mood.save();
    const updated = await Mood.findById(mood._id);
    expect(updated.note).toBe('Updated');
  });

  it('should delete mood entries', async () => {
    const mood = await Mood.create({ mood: 'angry', note: 'To delete' });
    await Mood.deleteOne({ _id: mood._id });
    const deleted = await Mood.findById(mood._id);
    expect(deleted).toBeNull();
  });
});
