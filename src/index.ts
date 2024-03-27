import app from './app';
import config from './config/env';
import { connectToDatabase } from './config/mongo';

const startServer = async () => {
  try {
    await connectToDatabase();
    const PORT = config.port;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}.`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();
