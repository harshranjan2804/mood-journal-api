const express = require('express');
const router = express.Router();
const Mood = require('../models/Mood');
const { getSpotifyToken, getMoodRecommendations } = require('../utils/spotify');

// Create mood entry
router.post('/', async (req, res) => {
  try {
    const { mood, note } = req.body;
    const newMood = new Mood({ mood, note });
    await newMood.save();
    res.status(201).json(newMood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all mood entries
router.get('/', async (req, res) => {
  try {
    const moods = await Mood.find().sort({ date: -1 });
    res.json(moods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete mood entry
router.delete('/:id', async (req, res) => {
  try {
    await Mood.findByIdAndDelete(req.params.id);
    res.json({ message: 'Mood entry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get mood stats
router.get('/stats', async (req, res) => {
  try {
    const stats = await Mood.aggregate([
      { $group: { _id: '$mood', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    const total = stats.reduce((sum, stat) => sum + stat.count, 0);
    const average = stats.length > 0 ? total / stats.length : 0;
    
    res.json({ stats, total, average });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get music recommendations for mood - UPDATED WITH ERROR HANDLING
router.get('/:id/music', async (req, res) => {
  try {
    const moodEntry = await Mood.findById(req.params.id);
    if (!moodEntry) return res.status(404).json({ message: 'Mood not found' });
    
    const token = await getSpotifyToken();
    const recommendations = await getMoodRecommendations(moodEntry.mood, token);
    
    res.json({
      mood: moodEntry.mood,
      recommendations
    });
  } catch (error) {
    // Enhanced error logging and response
    console.error("Spotify API Error Details:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
      config: error.config,
    });
    
    res.status(500).json({
      error: 'Failed to fetch music',
      details: error.message,
      spotify: error.response?.data || null
    });
  }
});

// Update a mood entry
router.put('/:id', async (req, res) => {
  try {
    const { mood, note } = req.body;
    const updatedMood = await Mood.findByIdAndUpdate(
      req.params.id,
      { mood, note },
      { new: true, runValidators: true }
    );
    if (!updatedMood) {
      return res.status(404).json({ message: 'Mood entry not found' });
    }
    res.json(updatedMood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
