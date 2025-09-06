// lib/db.js
import pkg from 'pg';

const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // required for Neon
  },
});
pool.connect()
  .then(() => console.log('✅ PostgreSQL connected successfully'))
  .catch((err) => console.error('❌ Database connection error:', err));
const query = (text, params) => pool.query(text, params);

export default query;