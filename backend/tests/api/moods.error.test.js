const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const Mood = require('../../models/Mood');

// Mock Spotify for error handling in /music route
jest.mock('../../utils/spotify', () => ({
  getSpotifyToken: jest.fn().mockRejectedValue(new Error('Spotify fail')),
  getMoodRecommendations: jest.fn().mockRejectedValue(new Error('Spotify fail'))
}));

describe('Mood API Error & Edge Case Handling', () => {
  afterEach(async () => {
    jest.restoreAllMocks();
    await Mood.deleteMany();
  });

  it('should return 400 if mood is missing in POST', async () => {
    const res = await request(app)
      .post('/api/moods')
      .send({ note: 'No mood' });
    expect(res.statusCode).toBe(400);
  });

  it('should return 400 if note is missing in POST', async () => {
    const res = await request(app)
      .post('/api/moods')
      .send({ mood: 'happy' });
    expect(res.statusCode).toBe(400);
  });

  it('should handle DB error on POST', async () => {
    jest.spyOn(Mood.prototype, 'save').mockImplementationOnce(() => {
      throw new Error('DB error');
    });
    const res = await request(app)
      .post('/api/moods')
      .send({ mood: 'happy', note: 'test' });
    expect(res.statusCode).toBe(500);
    Mood.prototype.save.mockRestore();
  });

  it('should handle DB error on GET all', async () => {
    jest.spyOn(Mood, 'find').mockImplementationOnce(() => {
      throw new Error('DB error');
    });
    const res = await request(app).get('/api/moods');
    expect(res.statusCode).toBe(500);
    Mood.find.mockRestore();
  });

  it('should return 404 if mood not found by id', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/moods/${fakeId}`);
    expect(res.statusCode).toBe(404);
  });

  it('should handle DB error on GET by id', async () => {
    jest.spyOn(Mood, 'findById').mockImplementationOnce(() => {
      throw new Error('DB error');
    });
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/moods/${fakeId}`);
    expect(res.statusCode).toBe(500);
    Mood.findById.mockRestore();
  });

  it('should return 404 if mood not found for music', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/moods/${fakeId}/music`);
    expect(res.statusCode).toBe(404);
  });

  it('should handle Spotify token error on /music', async () => {
    // Create a real mood
    const mood = await Mood.create({ mood: 'happy', note: 'test' });
    const res = await request(app).get(`/api/moods/${mood._id}/music`);
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toContain('Failed to fetch music');
  });
});
