import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/api/moods";

function App() {
  const [moods, setMoods] = useState([]);
  const [newMood, setNewMood] = useState("");
  const [note, setNote] = useState("");
  const [music, setMusic] = useState(null);
  const [selectedMoodId, setSelectedMoodId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // For editing
  const [editingId, setEditingId] = useState(null);
  const [editMood, setEditMood] = useState("");
  const [editNote, setEditNote] = useState("");

  useEffect(() => {
    fetchMoods();
  }, []);

  const fetchMoods = async () => {
    try {
      const res = await axios.get(API_URL);
      setMoods(res.data);
    } catch (err) {
      console.error("Failed to fetch moods:", err);
    }
  };

  const addMood = async () => {
    if (!newMood) return alert("Please select a mood");
    try {
      await axios.post(API_URL, { mood: newMood, note });
      setNewMood("");
      setNote("");
      fetchMoods();
    } catch (err) {
      alert(`Failed to add mood: ${err.message}`);
    }
  };

  const deleteMood = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      if (selectedMoodId === id) {
        setMusic(null);
        setSelectedMoodId(null);
      }
      fetchMoods();
    } catch (err) {
      alert(`Failed to delete mood: ${err.message}`);
    }
  };

  const getMusic = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/${id}/music`);
      setMusic(res.data);
      setSelectedMoodId(id);
    } catch (err) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.details ||
        "Failed to load music recommendations";
      setError(errorMsg);
      console.error("Music Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Start editing a mood entry
  const startEdit = (mood) => {
    setEditingId(mood._id);
    setEditMood(mood.mood);
    setEditNote(mood.note);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditMood("");
    setEditNote("");
  };

  // Save edited mood (PUT)
  const saveEdit = async (id) => {
    if (!editMood) return alert("Please select a mood");
    try {
      await axios.put(`${API_URL}/${id}`, { mood: editMood, note: editNote });
      setEditingId(null);
      setEditMood("");
      setEditNote("");
      fetchMoods();
    } catch (err) {
      alert(`Failed to update mood: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-blue-700 dark:text-blue-300">
          Mood Journal 🎵
        </h1>

        {/* Add Mood Form */}
        <div className="mb-8 p-6 bg-white dark:bg-gray-900 rounded-xl shadow flex flex-col md:flex-row gap-4 items-center">
          <select
            value={newMood}
            onChange={(e) => setNewMood(e.target.value)}
            className="border p-2 rounded w-full md:w-auto"
          >
            <option value="">Select Mood</option>
            <option value="happy">😊 Happy</option>
            <option value="sad">😢 Sad</option>
            <option value="angry">😠 Angry</option>
            <option value="excited">🤩 Excited</option>
            <option value="neutral">😐 Neutral</option>
          </select>
          <input
            type="text"
            placeholder="Add a note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <button
            onClick={addMood}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
          >
            Add Mood
          </button>
        </div>

        {/* Mood Entries */}
        <div>
          {moods.length === 0 ? (
            <p className="text-center text-gray-500">No mood entries yet.</p>
          ) : (
            moods.map((mood) => (
              <div
                key={mood._id}
                className="mb-6 p-6 rounded-xl shadow bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
              >
                {editingId === mood._id ? (
                  <div>
                    <div className="flex gap-2 items-center mb-2">
                      <select
                        value={editMood}
                        onChange={(e) => setEditMood(e.target.value)}
                        className="border p-2 rounded"
                      >
                        <option value="">Select Mood</option>
                        <option value="happy">😊 Happy</option>
                        <option value="sad">😢 Sad</option>
                        <option value="angry">😠 Angry</option>
                        <option value="excited">🤩 Excited</option>
                        <option value="neutral">😐 Neutral</option>
                      </select>
                      <input
                        type="text"
                        value={editNote}
                        onChange={(e) => setEditNote(e.target.value)}
                        className="border p-2 rounded flex-1"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(mood._id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold capitalize text-blue-700 dark:text-blue-300">
                        {mood.mood}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(mood)}
                          className="text-yellow-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteMood(mood._id)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="mt-2 text-lg text-gray-700 dark:text-gray-200">
                      {mood.note}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(mood.date).toLocaleString()}
                    </p>
                  </>
                )}

                {/* Music Recommendations Section */}
                <div className="mt-4">
                  <button
                    onClick={() => getMusic(mood._id)}
                    disabled={loading}
                    className={`mt-3 bg-gradient-to-r from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 text-white px-4 py-2 rounded shadow ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading && selectedMoodId === mood._id
                      ? "Loading..."
                      : "Get Music Recommendations"}
                  </button>

                  {error && selectedMoodId === mood._id && (
                    <div className="mt-4 text-red-500">
                      ⚠️ {error}
                    </div>
                  )}

                  {music && selectedMoodId === mood._id && !error && (
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2 text-blue-600 dark:text-blue-200">
                        Music for "{mood.mood}"
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {music.recommendations.map((track, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 border p-2 rounded hover:shadow bg-blue-50 dark:bg-gray-800 transition"
                          >
                            {track.image && (
                              <img
                                src={track.image}
                                alt={track.name}
                                className="w-12 h-12 rounded"
                              />
                            )}
                            <div>
                              <div className="font-semibold text-white">{track.name}</div>
                              <div className="text-sm text-gray-600 dark:text-gray-300">
                                {track.artist}
                              </div>
                              {track.preview ? (
                                <audio
                                  controls
                                  src={track.preview}
                                  className="mt-2"
                                  style={{ width: 180 }}
                                >
                                  Your browser does not support the audio element.
                                </audio>
                              ) : (
                                <div className="text-xs text-gray-400">
                                  No preview available
                                </div>
                              )}
                              <a
                                href={track.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 dark:text-blue-300 underline mt-1 inline-block"
                              >
                                Open in Spotify
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
