const request = require('supertest');
const app = require('../../app');
const Mood = require('../../models/Mood');

describe('Moods API', () => {
  let testMood;

  beforeEach(async () => {
    testMood = await Mood.create({ mood: 'excited', note: 'Initial note' });
  });

  it('GET /api/moods - should fetch all moods', async () => {
    const res = await request(app).get('/api/moods');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('POST /api/moods - should create a mood', async () => {
    const res = await request(app)
      .post('/api/moods')
      .send({ mood: 'neutral', note: 'New mood' });
    expect(res.statusCode).toEqual(201);
    expect(res.body.mood).toBe('neutral');
  });

  it('PUT /api/moods/:id - should update a mood', async () => {
    const res = await request(app)
      .put(`/api/moods/${testMood._id}`)
      .send({ mood: 'excited', note: 'Updated note' });
    expect(res.statusCode).toEqual(200);
    expect(res.body.note).toBe('Updated note');
  });

  it('DELETE /api/moods/:id - should delete a mood', async () => {
    const res = await request(app)
      .delete(`/api/moods/${testMood._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toContain('deleted');
  });
});
