const mysql = require('mysql2/promise');

// Mock config decryption
jest.mock('../configs/decrypt_credentials.js', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    host: 'localhost',
    port: 3306,
    user: 'test_user',
    password: 'test_password'
  })
}));

// Mock database connection
jest.mock('../routes/dbconnect', () => {
  const mockPool = {
    getConnection: jest.fn().mockImplementation(() => 
      Promise.resolve({
        query: jest.fn().mockImplementation((sql, params, callback) => {
          if (callback) {
            callback(null, []);
          }
          return Promise.resolve([]);
        }),
        release: jest.fn(),
        beginTransaction: jest.fn(),
        commit: jest.fn(),
        rollback: jest.fn()
      })
    ),
    query: jest.fn().mockImplementation((sql, params, callback) => {
      if (callback) {
        callback(null, []);
      }
      return Promise.resolve([]);
    }),
    end: jest.fn()
  };

  const mockConnection = {
    query: jest.fn().mockImplementation((sql, params, callback) => {
      if (callback) {
        callback(null, []);
      }
      return Promise.resolve([]);
    }),
    end: jest.fn()
  };

  return {
    getConnection: jest.fn().mockImplementation((callback) => {
      if (callback) {
        callback(null, mockConnection);
      }
      return mockConnection;
    }),
    getPool: jest.fn().mockReturnValue(mockPool),
    query: jest.fn().mockImplementation((sql, params, callback) => {
      if (callback) {
        callback(null, []);
      }
      return Promise.resolve([]);
    })
  };
});

// Mock JWT verification
jest.mock('../services/jwt', () => ({
  verify: jest.fn().mockImplementation((token) => {
    if (token === 'test-token') {
      return { email: 'user@example.com', role: 'User' };
    } else if (token === 'guest-token') {
      return { email: 'guest@example.com', role: 'Guest', searchCount: 5 };
    }
    return null;
  }),
  issueJWT: jest.fn().mockReturnValue('test-token')
}));

// Mock Passport and JWT Strategy
jest.mock('passport', () => ({
  use: jest.fn(),
  authenticate: jest.fn(() => (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token === 'test-token') {
      req.user = { email: 'user@example.com', role: 'User' };
    } else if (token === 'guest-token') {
      req.user = { email: 'guest@example.com', role: 'Guest', searchCount: 5 };
    }
    next();
  }),
  initialize: jest.fn(() => (req, res, next) => next())
}));

jest.mock('passport-jwt', () => {
  return {
    Strategy: jest.fn().mockImplementation(() => {
      return {
        name: 'jwt',
        authenticate: jest.fn((req, options) => {
          const token = req.headers.authorization?.split(' ')[1];
          if (token === 'test-token') {
            req.user = { email: 'user@example.com', role: 'User' };
          } else if (token === 'guest-token') {
            req.user = { email: 'guest@example.com', role: 'Guest', searchCount: 5 };
          }
          return true;
        })
      };
    })
  };
});

// Mock AWS SDK
jest.mock('aws-sdk', () => ({
  S3: jest.fn(() => ({
    upload: jest.fn().mockReturnThis(),
    promise: jest.fn()
  })),
  SES: jest.fn(() => ({
    sendEmail: jest.fn().mockReturnThis(),
    promise: jest.fn()
  }))
}));

// Mock file system operations
jest.mock('fs', () => ({
  ...jest.requireActual('fs'),
  writeFileSync: jest.fn(),
  readFileSync: jest.fn(),
  unlinkSync: jest.fn()
}));

// Mock Pug and related dependencies
jest.mock('pug', () => ({
  compile: jest.fn(),
  render: jest.fn()
}));

jest.mock('pug-filters', () => ({
  runFilter: jest.fn()
}));

jest.mock('uglify-js', () => ({
  minify: jest.fn()
}));

// Mock email service
jest.mock('../services/emailService', () => ({
  sendEmailPendingUser: jest.fn(),
  sendEmail: jest.fn()
}));

// Mock HTML service
jest.mock('../services/htmlService', () => ({
  generateHtml: jest.fn()
}));

// Mock passport service
jest.mock('../services/passport', () => {
  return jest.fn().mockImplementation(() => {
    return {
      use: jest.fn(),
      initialize: jest.fn(),
      authenticate: jest.fn()
    };
  });
});

// Global test timeout
jest.setTimeout(10000);
