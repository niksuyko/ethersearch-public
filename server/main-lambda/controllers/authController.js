import * as db from './dbController.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWTSECRET;

export const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).send('Missing fields.');
  }

  try {
      const user = await db.getUserByUsername(username);
      if (!user) {
          return res.status(404).send('User not found.');
      }

      const isPasswordValid = await bcryptjs.compare(password, user.hashed_password);
      if (!isPasswordValid) {
          return res.status(401).send('Invalid credentials.');
      }

      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
      res.status(200).json({ token });
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal server error');
  }
};

export const register = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).send('Missing fields.');
    }
    console.log("REGISTERING")
    try {
        const existingUser = await db.findUserByUsernameOrEmail(username, email);
        if (existingUser) {
            return res.status(409).send('User already exists.');
        }

        const hashedPassword = await bcryptjs.hash(password, 10);
        const userId = await db.addUser(username, email);
        await db.addAuth(userId, hashedPassword);
        res.status(201).json({ id: userId, username, email });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal server error');
    }
};


