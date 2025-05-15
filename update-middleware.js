const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'server', 'routes');
const files = fs.readdirSync(routesDir).filter(file => file.endsWith('.js'));

console.log(`Found ${files.length} route files to process`);

files.forEach(file => {
  const filePath = path.join(routesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Replace import statements
  content = content.replace(
    /const\s*{\s*authenticateToken\s*,\s*isAdmin\s*}\s*=\s*require\(['"]\.\.\/middleware\/auth\.middleware['"]\);/g,
    `const { verifyToken, isAdmin } = require('../middleware/auth.middleware');`
  );

  // Replace middleware usage
  content = content.replace(/authenticateToken/g, 'verifyToken');

  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});

console.log('All route files have been updated!');
