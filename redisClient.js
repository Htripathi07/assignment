// redisClient.js
const redis = require('redis');

// Create Redis client
const client = redis.createClient();

// Handle connection errors
client.on('error', (err) => {
  console.error('Redis connection error:', err);
});

module.exports = client;
