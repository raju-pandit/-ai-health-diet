import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './db.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-lumina-secret-key';

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ error: 'Unauthorized: No token provided' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden: Invalid token' });
    req.user = user;
    next();
  });
};

// --- AUTH ENDPOINTS ---
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'All fields required' });

    const checkStmt = db.prepare('SELECT id FROM users WHERE email = ?');
    if (checkStmt.get(email)) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertStmt = db.prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)');
    const result = insertStmt.run(name, email, hashedPassword);

    const token = jwt.sign({ id: result.lastInsertRowid, name, email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: result.lastInsertRowid, name, email } });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email);

    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});
// ----------------------


// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/generate-plan', async (req, res) => {
  try {
    const { profile } = req.body;
    
    if (!profile) {
      return res.status(400).json({ error: 'Profile data is required' });
    }

    const prompt = `You are an expert AI nutritionist. Generate a personalized 1-day diet plan in JSON format based on the following user profile:
    
    Gender: ${profile.gender}
    Age: ${profile.age} years
    Weight: ${profile.weight} ${profile.weightUnit}
    Height: ${profile.heightFeet}ft ${profile.heightInches}in
    Goal: ${profile.goal}
    Diet Preference: ${profile.diet}
    Allergies: ${profile.allergies || 'None'}
    Meals Per Day: ${profile.mealsPerDay}
    
    The response MUST be a valid JSON object with the following structure:
    {
      "dailyMacros": { "calories": number, "protein": string, "carbs": string, "fats": string },
      "meals": [
        {
          "name": "Breakfast",
          "time": "08:00 AM",
          "description": "Brief description",
          "items": ["item 1", "item 2"],
          "macros": { "calories": number, "protein": string, "carbs": string, "fats": string }
        }
      ],
      "tips": ["tip 1", "tip 2"]
    }
    
    Return ONLY valid JSON. No markdown, no backticks, no explanations.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
          responseMimeType: "application/json",
      }
    });

    const aiText = response.text;
    const planData = JSON.parse(aiText);
    
    res.json(planData);
  } catch (error) {
    console.error('AI Error:', error);
    res.status(500).json({ error: 'Failed to generate diet plan' });
  }
});

app.post('/api/save-plan', authenticateToken, (req, res) => {
  try {
    const { goal, dietType, planData } = req.body;
    const userId = req.user.id;
    const userName = req.user.name;
    
    // Check if plan already exists for this user_id
    const checkStmt = db.prepare('SELECT id FROM diet_plans WHERE user_id = ?');
    const existing = checkStmt.get(userId);
    
    if (existing) {
      // Update existing plan
      const updateStmt = db.prepare('UPDATE diet_plans SET goal = ?, diet_type = ?, plan_data = ?, user_name = ?, created_at = CURRENT_TIMESTAMP WHERE id = ?');
      updateStmt.run(goal, dietType, JSON.stringify(planData), userName, existing.id);
      res.json({ id: existing.id, success: true, updated: true });
    } else {
      // Insert new plan
      const insertStmt = db.prepare('INSERT INTO diet_plans (user_name, user_id, goal, diet_type, plan_data) VALUES (?, ?, ?, ?, ?)');
      const result = insertStmt.run(userName, userId, goal, dietType, JSON.stringify(planData));
      res.json({ id: result.lastInsertRowid, success: true, updated: false });
    }
  } catch (error) {
    console.error('DB Error:', error);
    res.status(500).json({ error: 'Failed to save diet plan' });
  }
});

app.get('/api/plans', authenticateToken, (req, res) => {
  try {
    const { search } = req.query;
    const userId = req.user.id;
    let stmt;
    
    if (search) {
      stmt = db.prepare("SELECT * FROM diet_plans WHERE user_id = ? AND (goal LIKE ? OR diet_type LIKE ?) ORDER BY created_at DESC");
      const plans = stmt.all(userId, `%${search}%`, `%${search}%`);
      res.json(plans);
    } else {
      stmt = db.prepare("SELECT * FROM diet_plans WHERE user_id = ? ORDER BY created_at DESC");
      const plans = stmt.all(userId);
      res.json(plans);
    }
  } catch (error) {
    console.error('DB Error:', error);
    res.status(500).json({ error: 'Failed to fetch diet plans' });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});
