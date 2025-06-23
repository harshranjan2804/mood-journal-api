const request = require('supertest');
const app = require('../../app');
const Mood = require('../../models/Mood');

// Mock Spotify functions
jest.mock('../../utils/spotify', () => ({
  getSpotifyToken: jest.fn(),
  getMoodRecommendations: jest.fn()
}));
const { getSpotifyToken, getMoodRecommendations } = require('../../utils/spotify');

describe('Music API Tests', () => {
  let testMood;

  beforeEach(async () => {
    testMood = await Mood.create({ mood: 'happy', note: 'Test mood' });
  });

  it('should get music recommendations for mood', async () => {
    getSpotifyToken.mockResolvedValue('test-token');
    getMoodRecommendations.mockResolvedValue([
      { name: 'Happy Song', artist: 'Artist1' }
    ]);

    const res = await request(app)
      .get(`/api/moods/${testMood._id}/music`);

    expect(res.statusCode).toBe(200);
    expect(res.body.recommendations.length).toBe(1);
    expect(res.body.recommendations[0].name).toBe('Happy Song');
  });

  it('should handle Spotify API errors', async () => {
    getSpotifyToken.mockRejectedValue(new Error('Spotify error'));

    const res = await request(app)
      .get(`/api/moods/${testMood._id}/music`);

    expect(res.statusCode).toBe(500);
    expect(res.body.error).toBeDefined();
  });
});
