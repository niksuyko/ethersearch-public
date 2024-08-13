import { pool } from '../config/dbConfig.js';

export const query = (text, params) => pool.query(text, params);

export const addUser = async (username, email) => {
  const text = 'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING id';
  const values = [username, email];
  const result = await pool.query(text, values);
  return result.rows[0].id;
};

export const addAuth = async (userId, hashedPassword) => {
  const text = 'INSERT INTO auth (user_id, hashed_password) VALUES ($1, $2)';
  const values = [userId, hashedPassword];
  await pool.query(text, values);
};

export const getUserByUsername = async (username) => {
  const text = 'SELECT * FROM users INNER JOIN auth ON users.id = auth.user_id WHERE username = $1';
  const values = [username];
  const result = await pool.query(text, values);
  return result.rows[0];
};

export const addContractToUser = async (userId, contractAddress, contractName) => {
  const text = `
    INSERT INTO user_contracts (user_id, contract_address, contract_name)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [userId, contractAddress, contractName];
  const result = await pool.query(text, values);
  return result.rows[0];
};

export const checkContractAddress = async (userId, contractAddress) => {
  const text = `
    SELECT * FROM user_contracts
    WHERE user_id = $1 AND contract_address = $2;
  `;
  const values = [userId, contractAddress];
  const result = await pool.query(text, values);
  return result.rows.length > 0 ? result.rows[0] : null;
};


export const removeContractFromUser = async (userId, contractAddress) => {
  const text = `
    DELETE FROM user_contracts
    WHERE user_id = $1 AND contract_address = $2
    RETURNING *;
  `;
  const values = [userId, contractAddress];
  const result = await pool.query(text, values);
  return result.rows[0];
};


export const getUserContracts = async (userId) => {
  const text = `
    SELECT contract_address, contract_name
    FROM user_contracts
    WHERE user_id = $1;
  `;
  const values = [userId];
  const result = await pool.query(text, values);
  if (result.rows.length === 0) {
    throw new Error('User not found or no contracts for this user');
  }
  return result.rows;
};

export const findUserByUsernameOrEmail = async (username, email) => {
  const client = await pool.connect();
  try {
    console.log("FINDING USER")
      const result = await client.query(
          'SELECT * FROM users WHERE username = $1 OR email = $2',
          [username, email]
      );
      return result.rows[0]; // returns undefined if no user is found
  } finally {
      client.release();
  }
};
