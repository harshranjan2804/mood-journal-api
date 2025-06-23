const request = require('supertest');
const app = require('../../app');
const mongoose = require('mongoose');

// Mock Spotify to force errors
jest.mock('../../utils/spotify', () => ({
  getSpotifyToken: jest.fn().mockRejectedValue(new Error('Token failed')),
  getMoodRecommendations: jest.fn().mockRejectedValue(new Error('Recommendation failed'))
}));

describe('Mood API Error Handling', () => {
  it('should return 404 for non-existent mood', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/moods/${fakeId}/music`);
    expect(res.statusCode).toBe(404);
  });

  it('should handle Spotify token errors', async () => {
    // Create a real mood first
    const moodRes = await request(app)
      .post('/api/moods')
      .send({ mood: 'happy', note: 'Test' });
    
    const res = await request(app).get(`/api/moods/${moodRes.body._id}/music`);
    expect(res.statusCode).toBe(500);
    expect(res.body.error).toContain('Failed to fetch music');
  });
});
