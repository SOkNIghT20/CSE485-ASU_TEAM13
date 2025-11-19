const request = require('supertest');
const app = require('../app');
const db = require('../routes/dbconnect');
const jwt = require('../services/jwt');

describe('Authentication Tests', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('Login', () => {
    it('should login admin with valid credentials', async () => {
      // Mock successful database query for admin
      db.getConnection.mockImplementation((callback) => {
        callback(null, {
          query: jest.fn().mockImplementation((query, email, callback) => {
            callback(null, [{
              email: 'admin@example.com',
              password: 'hashedPassword',
              salt: 'salt',
              firstName: 'Admin',
              lastName: 'User'
            }]);
          }),
          end: jest.fn()
        });
      });

      const res = await request(app)
        .post('/login')
        .send({
          email: 'admin@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(202);
      expect(res.body).toHaveProperty('email', 'admin@example.com');
      expect(res.body).toHaveProperty('role', 'Admin');
    });

    it('should login user with valid credentials', async () => {
      // Mock successful database query for user
      db.getConnection.mockImplementation((callback) => {
        callback(null, {
          query: jest.fn()
            .mockImplementationOnce((query, email, callback) => {
              callback(null, []); // No admin found
            })
            .mockImplementationOnce((query, email, callback) => {
              callback(null, [{
                email: 'user@example.com',
                password: 'hashedPassword',
                salt: 'salt',
                firstName: 'Regular',
                lastName: 'User',
                isVerified: 1
              }]);
            }),
          end: jest.fn()
        });
      });

      const res = await request(app)
        .post('/login')
        .send({
          email: 'user@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(202);
      expect(res.body).toHaveProperty('email', 'user@example.com');
      expect(res.body).toHaveProperty('role', 'User');
      expect(res.body).toHaveProperty('token');
    });

    it('should reject unverified user', async () => {
      // Mock database query for unverified user
      db.getConnection.mockImplementation((callback) => {
        callback(null, {
          query: jest.fn()
            .mockImplementationOnce((query, email, callback) => {
              callback(null, []); // No admin found
            })
            .mockImplementationOnce((query, email, callback) => {
              callback(null, [{
                email: 'unverified@example.com',
                password: 'hashedPassword',
                salt: 'salt',
                isVerified: 0
              }]);
            }),
          end: jest.fn()
        });
      });

      const res = await request(app)
        .post('/login')
        .send({
          email: 'unverified@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(401);
      expect(res.text).toBe('Please wait for a verification email');
    });
  });

  describe('Signup', () => {
    it('should register new user', async () => {
      // Mock database pool and queries
      db.getPool.mockReturnValue({
        query: jest.fn()
          .mockImplementationOnce((query, email, callback) => {
            callback(null, []); // No existing user
          })
          .mockImplementationOnce((query, params, callback) => {
            callback(null, { insertId: 1 });
          })
      });

      const res = await request(app)
        .post('/signup')
        .send({
          fname: 'New',
          lname: 'User',
          email: 'newuser@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(200);
      expect(res.text).toContain('User registration successful');
    });

    it('should reject registration with existing email', async () => {
      // Mock database pool and query
      db.getPool.mockReturnValue({
        query: jest.fn().mockImplementation((query, email, callback) => {
          callback(null, [{ id: 1 }]); // Existing user found
        })
      });

      const res = await request(app)
        .post('/signup')
        .send({
          fname: 'Existing',
          lname: 'User',
          email: 'existing@example.com',
          password: 'password123'
        });

      expect(res.status).toBe(400);
      expect(res.text).toBe('Email already exists in the database');
    });
  });
}); 