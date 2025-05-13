// Email configuration
module.exports = {
  EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'gmail',
  EMAIL_USER: process.env.EMAIL_USER || 'your-email@gmail.com',
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || 'your-email-password',
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@pischetola.com'
}; 