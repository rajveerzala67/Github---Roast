import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('Express API Endpoints', () => {
  it('GET /api/health returns 200 and system status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('online');
    expect(res.body.service).toBe('GitHub Roast API');
  });

  it('POST /api/analyze without body returns 400', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Please provide a GitHub profile URL');
  });

  it('POST /api/analyze with invalid domain returns 400', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .send({ githubUrl: 'https://gitlab.com/unknown_person' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Invalid domain');
  });

  it('POST /api/analyze with invalid username format returns 400', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .send({ githubUrl: '-invalid-name-' });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain('Invalid GitHub username format');
  });

  it('GET /api/unknown-route returns 404', async () => {
    const res = await request(app).get('/api/non-existent-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
