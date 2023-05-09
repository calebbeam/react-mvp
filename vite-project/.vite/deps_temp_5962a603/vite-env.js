import { config } from 'dotenv';

// Load the environment variables from .env files
config({ path: '.env' });

// Expose the loaded environment variables to Vite
export default () => {
  return {
    define: {
      'process.env': process.env,
    },
  };
};