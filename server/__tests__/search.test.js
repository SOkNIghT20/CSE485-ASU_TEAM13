const request = require('supertest');
const app = require('./mocks/app');
const db = require('../routes/dbconnect');
const jwt = require('../services/jwt');

describe('Search Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Simple Search', () => {
    it('should perform search with media type filters', async () => {
      const res = await request(app)
        .get('/simpleSearch')
        .query({
          searchQuery: 'test query',
          language: 'English',
          mediaType: JSON.stringify({ television: true })
        })
        .set('Authorization', 'Bearer test-token');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('results');
      expect(res.body).toHaveProperty('tvResultsSize');
      expect(res.body).toHaveProperty('newsResults');
      expect(res.body).toHaveProperty('radioResults');
      expect(res.body).toHaveProperty('magResults');
    });

    it('should handle guest search limit', async () => {
      const res = await request(app)
        .get('/simpleSearch')
        .query({
          searchQuery: 'test query',
          language: 'English',
          mediaType: JSON.stringify({ television: true })
        })
        .set('Authorization', 'Bearer guest-token');

      expect(res.status).toBe(403);
      expect(res.body).toHaveProperty('error', 'Search limit reached');
      expect(res.body).toHaveProperty('searchesLeft', 0);
    });

    it('should handle date range filtering', async () => {
      const res = await request(app)
        .get('/simpleSearch')
        .query({
          searchQuery: 'test query',
          language: 'English',
          mediaType: JSON.stringify({ television: true }),
          startDate: '2024-03-01',
          endDate: '2024-03-20',
          startTime: '09:00:00',
          endTime: '17:00:00'
        })
        .set('Authorization', 'Bearer test-token');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('results');
    });
  });

  describe('Media Search', () => {
    it('should search for videos', async () => {
      const res = await request(app)
        .get('/video/search')
        .query({ type: 'video' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('videos');
      expect(Array.isArray(res.body.videos)).toBe(true);
    });

    it('should handle media type filtering', async () => {
      const res = await request(app)
        .get('/search')
        .query({ type: 'video' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('results');
      expect(Array.isArray(res.body.results)).toBe(true);
    });
  });

  describe('Advanced Search', () => {
    it('should handle source filtering', async () => {
      const res = await request(app)
        .get('/search')
        .query({ source: 'newspaper' });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('results');
      expect(Array.isArray(res.body.results)).toBe(true);
    });
  });
}); 