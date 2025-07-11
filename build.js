import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';

console.log('Building FarGuard for Vercel deployment...');

// Create dist directory if it doesn't exist
if (!existsSync('dist')) {
  mkdirSync('dist', { recursive: true });
}

// Build the frontend
console.log('Building frontend with Vite...');
try {
  execSync('npx vite build', { stdio: 'inherit' });
  console.log('Frontend build completed successfully!');
} catch (error) {
  console.error('Frontend build failed:', error);
  process.exit(1);
}

console.log('Build completed successfully!');