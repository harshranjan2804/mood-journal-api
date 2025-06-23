const { getSpotifyToken, getMoodRecommendations } = require('../../utils/spotify');
const axios = require('axios');

// Suppress console.error during tests to avoid noisy logs
jest.spyOn(console, 'error').mockImplementation(() => {});

jest.mock('axios');

describe('Spotify Utilities', () => {
  it('should fetch Spotify token', async () => {
    axios.post.mockResolvedValue({ 
      data: { access_token: 'test-token' } 
    });
    
    const token = await getSpotifyToken();
    expect(token).toBe('test-token');
  });

  it('should handle token errors', async () => {
    axios.post.mockRejectedValue(new Error('API down'));
    await expect(getSpotifyToken()).rejects.toThrow('Failed to get Spotify token');
  });

  it('should get mood recommendations', async () => {
    axios.get.mockResolvedValue({
      data: {
        tracks: {
          items: [{
            name: 'Happy Song',
            artists: [{ name: 'Artist1' }],
            external_urls: { spotify: 'http://spotify.com/track1' },
            album: { images: [{ url: 'image1.jpg' }] },
            preview_url: null // simulate no preview
          }]
        }
      }
    });
    
    const recommendations = await getMoodRecommendations('happy', 'token');
    expect(recommendations).toEqual([{  // include preview field as null
      name: 'Happy Song',
      artist: 'Artist1',
      url: 'http://spotify.com/track1',
      image: 'image1.jpg',
      preview: null
    }]);
  });
});

// Add these tests at the bottom
it('should handle 401 Spotify errors', async () => {
  const error = new Error('Unauthorized');
  error.response = { status: 401 };
  axios.get.mockRejectedValue(error);
  
  await expect(getMoodRecommendations('happy', 'token'))
    .rejects.toThrow('Spotify token expired');
});

it('should handle 429 Spotify errors', async () => {
  const error = new Error('Too Many Requests');
  error.response = { status: 429 };
  axios.get.mockRejectedValue(error);
  
  await expect(getMoodRecommendations('happy', 'token'))
    .rejects.toThrow('Spotify rate limit exceeded');
});

it('should handle network errors', async () => {
  axios.get.mockRejectedValue(new Error('Network error'));
  
  await expect(getMoodRecommendations('happy', 'token'))
    .rejects.toThrow('Failed to fetch recommendations from Spotify');
});
