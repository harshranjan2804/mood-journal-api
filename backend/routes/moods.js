const express = require('express');
const router = express.Router();
const Mood = require('../models/Mood');
const { getSpotifyToken, getMoodRecommendations } = require('../utils/spotify');

// POST /api/moods - create mood
router.post('/', async (req, res) => {
  const { mood, note } = req.body;
  if (!mood || !note) {
    return res.status(400).json({ message: 'Mood and note are required' });
  }
  try {
    const newMood = new Mood({ mood, note });
    const savedMood = await newMood.save();
    res.status(201).json(savedMood);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create mood' });
  }
});

// GET /api/moods - get all moods
router.get('/', async (req, res) => {
  try {
    const moods = await Mood.find();
    res.json(moods);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch moods' });
  }
});

// GET /api/moods/:id - get mood by id
router.get('/:id', async (req, res) => {
  try {
    const mood = await Mood.findById(req.params.id);
    if (!mood) {
      return res.status(404).json({ message: 'Mood not found' });
    }
    res.json(mood);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch mood' });
  }
});

// GET /api/moods/:id/music - get music recommendations
router.get('/:id/music', async (req, res) => {
  try {
    const mood = await Mood.findById(req.params.id);
    if (!mood) {
      return res.status(404).json({ message: 'Mood not found' });
    }
    const token = await getSpotifyToken();
    const recommendations = await getMoodRecommendations(mood.mood, token);
    res.json({ recommendations });
  } catch (error) {
    console.error("Spotify API Error Details:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });
    res.status(500).json({ error: 'Failed to fetch music recommendations' });
  }
});

// PUT /api/moods/:id - update mood
router.put('/:id', async (req, res) => {
  const { mood, note } = req.body;
  if (!mood) {
    return res.status(400).json({ message: 'Mood is required' });
  }
  try {
    const updatedMood = await Mood.findByIdAndUpdate(req.params.id, { mood, note }, { new: true });
    if (!updatedMood) {
      return res.status(404).json({ message: 'Mood not found' });
    }
    res.json(updatedMood);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update mood' });
  }
});

// DELETE /api/moods/:id - delete mood
router.delete('/:id', async (req, res) => {
  try {
    const deletedMood = await Mood.findByIdAndDelete(req.params.id);
    if (!deletedMood) {
      return res.status(404).json({ message: 'Mood not found' });
    }
    res.json({ message: 'Mood deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete mood' });
  }
});

module.exports = router;
