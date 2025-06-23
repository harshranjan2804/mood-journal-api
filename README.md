# Mood Journal API

A full-stack web application to log your moods, write notes, and get music recommendations based on your mood using the Spotify API.

---

## Features

- Add, view, edit, and delete mood entries
- Get music recommendations for each mood (Spotify integration)
- View mood statistics
- Modern React frontend with Tailwind CSS
- RESTful Express backend with MongoDB
- [API documentation on Postman](https://documenter.getpostman.com/view/44748007/2sB2xBDADR)

---

## Tech Stack

- **Frontend:** React, Tailwind CSS, Axios
- **Backend:** Node.js, Express, MongoDB, Mongoose, Spotify Web API

---

## Getting Started

### 1. Clone the repository

git clone https://github.com/harshranjan2804/mood-journal-api.git
cd mood-journal-api

text

### 2. Backend Setup

- Install dependencies:
npm install

text
- Create a `.env` file:
PORT=8000
MONGO_URI=mongodb://localhost:27017/moodjournal
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret

text
- Start MongoDB and the backend server:
mongod
node app.js

text

### 3. Frontend Setup

- Go to the frontend directory:
cd frontend

text
- Install dependencies:
npm install

text
- Start the React app:
npm start

text

---

## API Documentation

All API endpoints, sample requests, and responses are documented here:  
👉 **[Mood Journal API – Postman Docs](https://documenter.getpostman.com/view/44748007/2sB2xBDADR)**

---

## Main API Endpoints

| Endpoint                     | Method | Description                      |
|------------------------------|--------|----------------------------------|
| `/api/moods`                 | POST   | Create a new mood entry          |
| `/api/moods`                 | GET    | Get all mood entries             |
| `/api/moods/:id`             | PUT    | Update a mood entry              |
| `/api/moods/:id`             | DELETE | Delete a mood entry              |
| `/api/moods/stats`           | GET    | Get mood statistics              |
| `/api/moods/:id/music`       | GET    | Get music recommendations        |

See [API Docs](https://documenter.getpostman.com/view/44748007/2sB2xBDADR) for detailed request/response samples.

---

## Example Usage

**Add a Mood Entry**
POST /api/moods
{
"mood": "happy",
"note": "Had a great day!"
}

text

**Get Music Recommendations**
GET /api/moods/<MOOD_ID>/music

text

---

## License

MIT

---

## Credits

- Inspired by open source mood journal projects and the Spotify API.
- API documentation generated with [Postman](https://www.postman.com/).

---

**Happy journaling!**
