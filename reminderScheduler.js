// Import required modules
const cron = require('node-cron');
const Task = require('./models/Task'); // Import your Task model
const nodemailer = require('nodemailer'); // Example email sending library

// Define reminder function
async function sendReminders() {
  try {
    // Get tasks with due dates within the next 24 hours
    const now = new Date();
    const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const tasks = await Task.find({ dueDate: { $gte: now, $lte: twentyFourHoursLater } });

    // Send reminders for each task
    for (const task of tasks) {
      // Example: Send email reminder
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'testinght068@gmail.com',
          pass: 'testing@07'
        }
      });

      const mailOptions = {
        from: 'tripathihariom34@gmail.com',
        to: task.user.email,
        subject: `Reminder: Task "${task.title}" due soon`,
        text: `Your task "${task.title}" is due on ${task.dueDate}.`
      };

      await transporter.sendMail(mailOptions);
    }
  } catch (error) {
    console.error('Error sending reminders:', error);
  }
}

// Schedule the reminder function to run every hour
cron.schedule('0 * * * *', () => {
  sendReminders();
});
