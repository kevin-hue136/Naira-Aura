import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import bcrypt from 'bcrypt';
import session from 'express-session';
import SQLiteStore from 'connect-sqlite3';
import Database from 'better-sqlite3';

const SQLiteSessionStore = SQLiteStore(session);

interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  phoneNumber: string;
  balance: number;
  trustVelocity: number;
  totalEscrowTrades: number;
  auraPoints: number;
}

// Initialize SQLite Database
const db = new Database('database.db');
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    passwordHash TEXT NOT NULL,
    name TEXT,
    phoneNumber TEXT,
    balance INTEGER,
    trustVelocity INTEGER,
    totalEscrowTrades INTEGER,
    auraPoints INTEGER
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS sessions (
    sid TEXT PRIMARY KEY,
    sess JSON NOT NULL,
    expire DATETIME NOT NULL
  );
`);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // Session middleware
  app.use(session({
    store: new SQLiteSessionStore({ db: 'sessions.db', table: 'sessions' }),
    secret: 'your_secret_key_here', // Replace with a strong secret from .env
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      httpOnly: true,
      sameSite: 'lax',
    },
  }));

  app.use(express.json());

  // API Routes
  app.post('/api/auth/register', async (req, res) => {
    const { email, password, name, phoneNumber } = req.body;

    if (!email || !password || !name || !phoneNumber) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    try {
      const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
      if (existingUser) {
        return res.status(409).json({ message: 'User with this email already exists' });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const id = 'user_' + Math.random().toString(36).substr(2, 9);
      const newUser: User = {
        id,
        email,
        passwordHash,
        name,
        phoneNumber,
        balance: 0,
        trustVelocity: 50,
        totalEscrowTrades: 0,
        auraPoints: 0,
      };

      db.prepare('INSERT INTO users (id, email, passwordHash, name, phoneNumber, balance, trustVelocity, totalEscrowTrades, auraPoints) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
        .run(newUser.id, newUser.email, newUser.passwordHash, newUser.name, newUser.phoneNumber, newUser.balance, newUser.trustVelocity, newUser.totalEscrowTrades, newUser.auraPoints);

      // Log in the user after registration
      req.session.userId = newUser.id;
      res.status(201).json({ message: 'User registered successfully', user: { id: newUser.id, email: newUser.email, name: newUser.name, phoneNumber: newUser.phoneNumber, balance: newUser.balance, trustVelocity: newUser.trustVelocity, totalEscrowTrades: newUser.totalEscrowTrades, auraPoints: newUser.auraPoints } });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
      const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as User | undefined;
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      req.session.userId = user.id;
      res.status(200).json({ message: 'Logged in successfully', user: { id: user.id, email: user.email, name: user.name, phoneNumber: user.phoneNumber, balance: user.balance, trustVelocity: user.trustVelocity, totalEscrowTrades: user.totalEscrowTrades, auraPoints: user.auraPoints } });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get('/api/auth/logout', (req, res) => {
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ message: 'Could not log out' });
      }
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });

  app.get('/api/user/profile', (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
      const user = db.prepare('SELECT id, email, name, phoneNumber, balance, trustVelocity, totalEscrowTrades, auraPoints FROM users WHERE id = ?').get(req.session.userId) as Omit<User, 'passwordHash'> | undefined;
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ user });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*all', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

declare module 'express-session' {
  interface SessionData {
    userId: string;
  }
}

startServer();
