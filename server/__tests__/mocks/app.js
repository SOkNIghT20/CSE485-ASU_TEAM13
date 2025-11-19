const express = require('express');
const passport = require('passport');
const app = express();

// Add necessary middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize passport
app.use(passport.initialize());

// Mock routes
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@example.com') {
    res.status(202).json({ email: 'admin@example.com', role: 'Admin' });
  } else if (email === 'user@example.com') {
    res.status(202).json({ 
      email: 'user@example.com', 
      role: 'User',
      token: 'test-token'
    });
  } else if (email === 'unverified@example.com') {
    res.status(401).send('Please wait for a verification email');
  } else {
    res.status(200).json({ message: 'Login endpoint' });
  }
});

app.post('/signup', (req, res) => {
  const { email } = req.body;
  if (email === 'existing@example.com') {
    res.status(400).json({ error: 'Email already exists' });
  } else {
    res.status(200).json({ message: 'User registered successfully' });
  }
});

app.get('/simpleSearch', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { searchCount } = req.user || { searchCount: 0 };
  if (searchCount >= 5) {
    res.status(403).json({
      error: 'Search limit reached',
      searchesLeft: 0
    });
  } else {
    res.status(200).json({
      results: [],
      tvResultsSize: 0,
      newsResults: [],
      radioResults: [],
      magResults: []
    });
  }
});

app.get('/video/search', (req, res) => {
  res.status(200).json({
    videos: [{
      id: 1,
      title: 'Test Video',
      type: 'video'
    }]
  });
});

app.get('/search', (req, res) => {
  const { type, source } = req.query;
  if (type === 'video') {
    res.status(200).json({
      results: [{
        id: 1,
        title: 'Test Video',
        type: 'video'
      }]
    });
  } else if (source === 'newspaper') {
    res.status(200).json({
      results: [{
        id: 1,
        title: 'Test Article',
        source: 'newspaper'
      }]
    });
  } else {
    res.status(404).json({ error: 'Not found' });
  }
});

// Add media routes
app.post('/video/upload', (req, res) => {
  res.status(200).json({ message: 'Video uploaded successfully' });
});

app.get('/video/stream/:id', (req, res) => {
  if (req.params.id === '1') {
    res.status(200).set('content-type', 'video/mp4').send('mock video data');
  } else {
    res.status(404).json({ error: 'Video not found' });
  }
});

app.get('/download/:id', (req, res) => {
  if (req.params.id === '1') {
    res.status(200)
      .set('content-disposition', 'attachment; filename="test.mp4"')
      .send('mock file data');
  } else {
    res.status(404).json({ error: 'File not found' });
  }
});

app.post('/video/thumbnail/:id', (req, res) => {
  if (req.params.id === '1') {
    res.status(200).json({ thumbnailUrl: 'http://example.com/thumbnail.jpg' });
  } else {
    res.status(404).json({ error: 'Video not found' });
  }
});

module.exports = app; 