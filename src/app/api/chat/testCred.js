import fs from 'fs';

const path = process.env.GOOGLE_APPLICATION_CREDENTIALS;

console.log('Path to credential:', path);

if (!path) {
  console.error('Environment variable GOOGLE_APPLICATION_CREDENTIALS is not set!');
  process.exit(1);
}

try {
  const content = fs.readFileSync(path, 'utf-8');
  console.log('Credential file content:', content.substring(0, 100) + '...');
} catch (error) {
  console.error('Error reading credential file:', error.message);
  process.exit(1);
}
