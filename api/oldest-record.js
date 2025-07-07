import { kvDatabase, handleCors } from './_utils/kv.js';

export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) {
    return; // Early return for OPTIONS request
  }

  try {
    if (req.method === 'GET') {
      // Get all onboardlands to find the oldest record with callonboard = 1
      const onboardlands = await kvDatabase.findAll('onboardlands');
      
      if (onboardlands.length === 0) {
        return res.status(404).json({ 
          error: 'No documents found',
          oldestRecord: null 
        });
      }

      // Find records with callonboard = 1 (called/active records)
      const activeRecords = onboardlands.filter(record => record.callonboard === 1);
      
      if (activeRecords.length === 0) {
        return res.status(404).json({ 
          error: 'No active records found',
          oldestRecord: null 
        });
      }

      // Find the oldest active record based on updatedAt or createdAt
      const oldestRecord = activeRecords.reduce((oldest, current) => {
        const oldestTime = new Date(oldest.updatedAt || oldest.createdAt || 0);
        const currentTime = new Date(current.updatedAt || current.createdAt || 0);
        return currentTime < oldestTime ? current : oldest;
      });

      // Reset the callonboard to 0 after retrieving (so it won't be called again)
      if (oldestRecord) {
        await kvDatabase.setField('onboardlands', oldestRecord.idland, 'callonboard', 0);
      }

      console.log('🔊 Oldest record for sound system:', oldestRecord);
      return res.status(200).json({
        oldestRecord: {
          idshow: oldestRecord.idshow,
          numbershow: oldestRecord.numbershow,
          nameservice: oldestRecord.nameservice,
          idland: oldestRecord.idland
        }
      });

    } else {
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }

  } catch (error) {
    console.error('❌ Error in oldest-record API:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      oldestRecord: null 
    });
  }
} 