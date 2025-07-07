import { kvDatabase, handleCors } from './_utils/kv.js';

export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) {
    return; // Early return for OPTIONS request
  }

  try {
    if (req.method === 'POST') {
      console.log('🔄 Starting daily queue reset at 7 PM...');
      
      const resetResults = {
        timestamp: new Date().toISOString(),
        resetTime: '7:00 PM',
        success: true,
        actions: []
      };

      // 1. Reset all regisshows numbershow to 0
      try {
        const regisshows = await kvDatabase.findAll('regisshows');
        for (const doc of regisshows) {
          const documentId = doc._key.split(':')[1];
          await kvDatabase.update('regisshows', documentId, { numbershow: 0 });
          resetResults.actions.push(`Reset regisshows ${doc.idshow} numbershow to 0`);
        }
        console.log('✅ Reset all regisshows numbershow to 0');
      } catch (error) {
        console.error('❌ Error resetting regisshows:', error);
        resetResults.actions.push(`Error resetting regisshows: ${error.message}`);
      }

      // 2. Reset all onboardshows numbershow to 0
      try {
        const onboardshows = await kvDatabase.findAll('onboardshows');
        for (const doc of onboardshows) {
          const documentId = doc._key.split(':')[1];
          await kvDatabase.update('onboardshows', documentId, { 
            numbershow: 0,
            qcall: true 
          });
          resetResults.actions.push(`Reset onboardshows ${doc.idshow} numbershow to 0`);
        }
        console.log('✅ Reset all onboardshows numbershow to 0');
      } catch (error) {
        console.error('❌ Error resetting onboardshows:', error);
        resetResults.actions.push(`Error resetting onboardshows: ${error.message}`);
      }

      // 3. Reset all onboardlandnums numbershow to 0
      try {
        const onboardlandnums = await kvDatabase.findAll('onboardlandnums');
        for (const doc of onboardlandnums) {
          const documentId = doc._key.split(':')[1];
          await kvDatabase.update('onboardlandnums', documentId, { numbershow: 0 });
          resetResults.actions.push(`Reset onboardlandnums ${doc.idshow} numbershow to 0`);
        }
        console.log('✅ Reset all onboardlandnums numbershow to 0');
      } catch (error) {
        console.error('❌ Error resetting onboardlandnums:', error);
        resetResults.actions.push(`Error resetting onboardlandnums: ${error.message}`);
      }

      // 4. Reset all onboardlands to initial state
      try {
        const onboardlands = await kvDatabase.findAll('onboardlands');
        for (const doc of onboardlands) {
          const documentId = doc._key.split(':')[1];
          await kvDatabase.update('onboardlands', documentId, { 
            numbershow: 0,
            qcall: true,
            timestamp: Date.now()
          });
          resetResults.actions.push(`Reset onboardlands ${doc.idshow} to initial state`);
        }
        console.log('✅ Reset all onboardlands to initial state');
      } catch (error) {
        console.error('❌ Error resetting onboardlands:', error);
        resetResults.actions.push(`Error resetting onboardlands: ${error.message}`);
      }

      // 5. Clear queue history
      try {
        const queueHistory = await kvDatabase.findAll('queueHistory');
        for (const doc of queueHistory) {
          const documentId = doc._key.split(':')[1];
          await kvDatabase.delete('queueHistory', documentId);
        }
        resetResults.actions.push(`Cleared ${queueHistory.length} queue history entries`);
        console.log(`✅ Cleared ${queueHistory.length} queue history entries`);
      } catch (error) {
        console.error('❌ Error clearing queue history:', error);
        resetResults.actions.push(`Error clearing queue history: ${error.message}`);
      }

      console.log('🎉 Daily queue reset completed successfully!');
      console.log('📊 Reset summary:', resetResults);

      return res.status(200).json({
        success: true,
        message: 'Daily queue reset completed successfully at 7 PM',
        details: resetResults,
        nextReset: 'Tomorrow at 7:00 PM'
      });

    } else if (req.method === 'GET') {
      // Get reset status/info
      return res.status(200).json({
        message: 'Daily Queue Reset Service',
        schedule: 'Every day at 7:00 PM Thailand time',
        timezone: 'Asia/Bangkok',
        actions: [
          'Reset all regisshows numbershow to 0',
          'Reset all onboardshows numbershow to 0', 
          'Reset all onboardlandnums numbershow to 0',
          'Reset all onboardlands to initial state',
          'Clear queue history'
        ],
        manualTrigger: 'POST to this endpoint'
      });

    } else {
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }

  } catch (error) {
    console.error('❌ Error in daily reset API:', error);
    return res.status(500).json({ 
      success: false,
      error: 'Internal server error during daily reset',
      message: error.message 
    });
  }
} 