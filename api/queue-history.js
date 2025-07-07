import { kvDatabase, handleCors } from './_utils/kv.js';

export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) {
    return; // Early return for OPTIONS request
  }

  try {
    if (req.method === 'GET') {
      // Get global queue history (latest 4 called queues)
      console.log('📺 Getting global queue history for OnTV');
      
      const queueHistory = await kvDatabase.findAll('queueHistory');
      
      // Sort by timestamp (newest first) and return only latest 4
      const sortedHistory = queueHistory
        .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
        .slice(0, 4);

      console.log('📋 Global queue history:', sortedHistory);
      return res.status(200).json(sortedHistory);

    } else if (req.method === 'POST') {
      // Add new queue to global history
      const { queueNumber, counterNumber, calledAt } = req.body;

      if (!queueNumber || !counterNumber) {
        return res.status(400).json({ error: 'queueNumber and counterNumber are required' });
      }

      const timestamp = calledAt || Date.now();
      const historyId = `${timestamp}_${queueNumber}_${counterNumber}`;

      const queueEntry = {
        id: historyId,
        queueNumber: parseInt(queueNumber),
        counterNumber: parseInt(counterNumber),
        timestamp: timestamp,
        calledAt: new Date(timestamp).toISOString(),
        timeString: new Date(timestamp).toLocaleTimeString('th-TH', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        status: 'called'
      };

      // Add to queue history
      await kvDatabase.upsert('queueHistory', historyId, queueEntry);

      // Clean up old entries (keep only last 20 for performance)
      const allHistory = await kvDatabase.findAll('queueHistory');
      if (allHistory.length > 20) {
        const sortedAll = allHistory.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        const toDelete = sortedAll.slice(20); // Remove oldest entries
        
        for (const oldEntry of toDelete) {
          const oldId = oldEntry._key.split(':')[1];
          await kvDatabase.delete('queueHistory', oldId);
        }
      }

      console.log(`📋 Added queue ${queueNumber} from counter ${counterNumber} to global history`);
      return res.status(200).json({ 
        success: true, 
        message: `Queue ${queueNumber} from counter ${counterNumber} added to history`,
        entry: queueEntry
      });

    } else if (req.method === 'DELETE') {
      // Clear all queue history (for testing/reset)
      const allHistory = await kvDatabase.findAll('queueHistory');
      
      for (const entry of allHistory) {
        const entryId = entry._key.split(':')[1];
        await kvDatabase.delete('queueHistory', entryId);
      }

      console.log('🗑️ Cleared all queue history');
      return res.status(200).json({ success: true, message: 'Queue history cleared' });

    } else {
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }

  } catch (error) {
    console.error('❌ Error in queue-history API:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
} 