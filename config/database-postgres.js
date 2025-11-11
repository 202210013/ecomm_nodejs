const { Pool } = require('pg');
require('dotenv').config();

// PostgreSQL configuration for Render
const pgConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false,
  max: 10,
  idleTimeoutMillis: 30010,
  connectionTimeoutMillis: 10000,
};

// Create connection pool
const pool = new Pool(pgConfig);

// Test connection function
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL Database connected successfully');
    const result = await client.query('SELECT NOW()');
    console.log(`📍 Connected at: ${result.rows[0].now}`);
    client.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    throw error;
  }
}

// Execute query
async function query(sql, params = []) {
  try {
    const result = await pool.query(sql, params);
    return result.rows;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Execute query and return first row
async function queryOne(sql, params = []) {
  const results = await query(sql, params);
  return results.length > 0 ? results[0] : null;
}

// Begin transaction
async function beginTransaction() {
  const client = await pool.connect();
  await client.query('BEGIN');
  return client;
}

// Commit transaction
async function commitTransaction(client) {
  await client.query('COMMIT');
  client.release();
}

// Rollback transaction
async function rollbackTransaction(client) {
  await client.query('ROLLBACK');
  client.release();
}

// Close all connections
async function closePool() {
  await pool.end();
  console.log('📴 Database connection pool closed');
}

// Export functions
module.exports = {
  pool,
  query,
  queryOne,
  testConnection,
  getConnection: () => pool.connect(),
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
  closePool
};
