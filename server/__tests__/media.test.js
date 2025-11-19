const request = require('supertest');
const app = require('../app');
const db = require('../routes/dbconnect');
const path = require('path');

describe('Media Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Video Upload', () => {
    it('should upload a video file', async () => {
      // Mock successful upload
      db.query.mockResolvedValueOnce([{ insertId: 1 }]);

      const res = await request(app)
        .post('/video/upload')
        .attach('video', path.join(__dirname, 'fixtures/test-video.mp4'))
        .field('title', 'Test Video')
        .field('description', 'Test Description');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('videoId');
    });

    it('should reject invalid file types', async () => {
      const res = await request(app)
        .post('/video/upload')
        .attach('video', path.join(__dirname, 'fixtures/invalid.txt'))
        .field('title', 'Invalid File');

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('Video Streaming', () => {
    it('should stream video content', async () => {
      // Mock video file existence
      jest.spyOn(require('fs'), 'existsSync').mockReturnValue(true);
      
      const res = await request(app)
        .get('/video/stream/1');

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toMatch(/video/);
    });

    it('should handle non-existent video', async () => {
      // Mock video file non-existence
      jest.spyOn(require('fs'), 'existsSync').mockReturnValue(false);

      const res = await request(app)
        .get('/video/stream/999');

      expect(res.status).toBe(404);
    });
  });

  describe('Media Download', () => {
    it('should download media file', async () => {
      // Mock successful download
      db.query.mockResolvedValueOnce([{ 
        id: 1, 
        file_path: '/path/to/file.mp4',
        file_name: 'test-file.mp4'
      }]);

      const res = await request(app)
        .get('/download/1');

      expect(res.status).toBe(200);
      expect(res.headers['content-disposition']).toContain('attachment');
    });

    it('should handle download errors', async () => {
      // Mock database error
      db.query.mockRejectedValueOnce(new Error('Database error'));

      const res = await request(app)
        .get('/download/999');

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('Thumbnail Generation', () => {
    it('should generate video thumbnail', async () => {
      // Mock successful thumbnail generation
      db.query.mockResolvedValueOnce([{ id: 1 }]);

      const res = await request(app)
        .post('/video/thumbnail/1');

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('thumbnailUrl');
    });

    it('should handle thumbnail generation errors', async () => {
      // Mock thumbnail generation error
      db.query.mockRejectedValueOnce(new Error('FFmpeg error'));

      const res = await request(app)
        .post('/video/thumbnail/999');

      expect(res.status).toBe(500);
      expect(res.body).toHaveProperty('error');
    });
  });
}); 