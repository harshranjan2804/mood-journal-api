const axios = require('axios');

const getSpotifyToken = async () => {
  try {
    const auth = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');
    
    const response = await axios.post(
      'https://accounts.spotify.com/api/token', 
      'grant_type=client_credentials',
      {
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    return response.data.access_token;
  } catch (error) {
    console.error("Spotify Token Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    throw new Error("Failed to get Spotify token");
  }
};

const getMoodRecommendations = async (mood, token) => {
  try {
    const moodMap = {
      happy: 'pop upbeat',
      sad: 'acoustic sad',
      angry: 'rock metal',
      excited: 'dance electronic',
      neutral: 'chill'
    };
    
    const searchQuery = moodMap[mood] || 'pop';
    
    const response = await axios.get(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=5`,
      {
        headers: { 'Authorization': `Bearer ${token}` },
        timeout: 10000 // Add timeout to prevent hanging
      }
    );
    
    return response.data.tracks.items.map(track => ({
      name: track.name,
      artist: track.artists.map(a => a.name).join(', '),
      url: track.external_urls.spotify,
      image: track.album.images[0]?.url,
      preview: track.preview_url 
    }));
  } catch (error) {
    console.error("Spotify Recommendation Error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      mood: mood,
      token: token ? "Exists" : "Missing"
    });
    throw new Error("Failed to fetch recommendations from Spotify");
  }
};

module.exports = { getSpotifyToken, getMoodRecommendations };
