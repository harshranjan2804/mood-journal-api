Mood Journal API
A full-stack web application to log your moods, write notes, and get music recommendations based on your mood using the Spotify API.

Features
Add, view, edit, and delete mood entries

Get music recommendations for each mood (Spotify integration)

View mood statistics

Modern React frontend with Tailwind CSS

RESTful Express backend with MongoDB

API documentation on Postman

Tech Stack
Frontend: React, Tailwind CSS, Axios

Backend: Node.js, Express, MongoDB, Mongoose, Spotify Web API

Getting Started
1. Clone the repository
bash
git clone https://github.com/harshranjan2804/mood-journal-api.git
cd mood-journal-api
2. Backend Setup
Install dependencies:

bash
npm install
Create a .env file:

text
PORT=8000
MONGO_URI=mongodb://localhost:27017/moodjournal
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
Start MongoDB and the backend server:

bash
mongod
node app.js
3. Frontend Setup
Go to the frontend directory:

bash
cd frontend
Install dependencies:

bash
npm install
Start the React app:

bash
npm start
API Documentation
All API endpoints, sample requests, and responses are documented here:
👉 Mood Journal API – Postman Docs

Main API Endpoints
Endpoint	Method	Description
/api/moods	POST	Create a new mood entry
/api/moods	GET	Get all mood entries
/api/moods/:id	PUT	Update a mood entry
/api/moods/:id	DELETE	Delete a mood entry
/api/moods/stats	GET	Get mood statistics
/api/moods/:id/music	GET	Get music recommendations
See API Docs for detailed request/response samples.

Example Usage
Add a Mood Entry
POST /api/moods

json
{
  "mood": "happy",
  "note": "Had a great day!"
}
Get Music Recommendations
GET /api/moods/<MOOD_ID>/music

Testing and Quality Assurance
Comprehensive automated testing was implemented to ensure the reliability and maintainability of the Mood Journal API backend.

Key Highlights:
Structured tests into unit, integration, and API categories for clear organization.

Used mongodb-memory-server for in-memory database testing to isolate tests from production data.

Mocked external dependencies such as the Spotify API to ensure deterministic and fast tests.

Achieved high test coverage:

📈 Statements: 93.61%

🧩 Branches: 80.76%

⚙️ Functions: 91.17%

📄 Lines: 93.47%

Improved error handling and input validation across all API endpoints.

Automated test coverage reports integrated into the development workflow.

How to Run Tests
bash
npm run test:coverage
This command runs all tests and generates a coverage report, helping maintain code quality as the project evolves.

License
MIT

Credits
Inspired by open source mood journal projects and the Spotify API.

API documentation generated with Postman.

Happy journaling!

