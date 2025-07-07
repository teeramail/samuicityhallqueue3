import { kvDatabase, handleCors } from './_utils/kv.js';

export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) {
    return; // Early return for OPTIONS request
  }

  try {
    if (req.method === 'GET') {
      console.log('⚡ Fast queue status check');
      
      // Get only essential data for maximum speed
      const [onboardshows, regisshows] = await Promise.all([
        kvDatabase.findAll('onboardshows'),
        kvDatabase.findAll('regisshows')
      ]);

      // Calculate global queue status efficiently
      const currentQueue = Math.max(...onboardshows.map(show => show.numbershow || 0), 0);
      const totalRegistered = regisshows.reduce((sum, regis) => sum + (regis.numbershow || 0), 0);
      const waiting = Math.max(0, totalRegistered - currentQueue);
      const canIncrement = totalRegistered > 0 && (currentQueue + 1) <= totalRegistered;

      // Return minimal, fast response
      return res.status(200).json({
        current: currentQueue,
        total: totalRegistered,
        next: currentQueue + 1,
        waiting: waiting,
        canIncrement: canIncrement,
        timestamp: Date.now()
      });

    } else {
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }

  } catch (error) {
    console.error('❌ Queue status error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
} 