import { connect, connection, Connection } from 'mongoose';
require('dotenv').config();

export const setupConnection = async (): Promise<Connection> => {
  connect(process.env.MONGO_URL, { useNewUrlParser: true });

  return new Promise((resolve, reject) => {
    const db = connection;
    db.on('error', (error) => {
      console.error('connection error:', error)
      reject(error);
    });
    db.once('open', function() {
      console.debug('MongoDB connected');
      resolve(db);
    });
  });
};