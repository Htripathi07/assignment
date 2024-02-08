// taskService.js
const client = require('./redisClient');
const Task = require('./models/Task');

async function getTaskFromCacheOrDatabase(taskId) {
  // Check if task data is cached
  const cachedData = await new Promise((resolve, reject) => {
    client.get(`task:${taskId}`, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });

  if (cachedData) {
    console.log('Task data retrieved from cache');
    return JSON.parse(cachedData);
  } else {
    console.log('Task data retrieved from database');
    // Fetch task data from the database
    const task = await Task.findById(taskId);
    // Cache task data for 5 minutes
    client.setex(`task:${taskId}`, 300, JSON.stringify(task));
    return task;
  }
}

module.exports = { getTaskFromCacheOrDatabase };
