import { kvDatabase, handleCors } from './_utils/kv.js';

export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) {
    return; // Early return for OPTIONS request
  }

  try {
    if (req.method === 'GET') {
      // Get all onboardlandnums
      const onboardlandnums = await kvDatabase.findAll('onboardlandnums');
      
      if (onboardlandnums.length === 0) {
        return res.status(404).json({ error: 'No documents found in the collection' });
      }

      console.log('📊 Onboardlandnums data:', onboardlandnums);
      return res.status(200).json(onboardlandnums);

    } else if (req.method === 'PUT') {
      // GLOBAL QUEUE SYSTEM: Increment global counter and update ALL onboardshows
      console.log('📝 Request body:', req.body);
      const { idshow, idshowtype, idshowtext } = req.body;

      if (!idshow || !idshowtype) {
        return res.status(400).json({ error: 'idshow and idshowtype are required' });
      }

      try {
        // Step 1: Get and increment global counter (onboardlandnums)
        console.log('🌐 Incrementing GLOBAL queue counter');
        
        const landnums = await kvDatabase.findAll('onboardlandnums');
        let globalCounter;
        
        if (landnums.length === 0) {
          // Create initial global counter
          globalCounter = await kvDatabase.upsert('onboardlandnums', '1', { numland: 1 });
        } else {
          // Increment existing global counter
          globalCounter = await kvDatabase.increment('onboardlandnums', '1', 'numland', 1);
        }

        const newGlobalQueueNumber = globalCounter.numland;
        console.log(`📈 Global queue counter incremented to: ${newGlobalQueueNumber}`);

        // Step 2: Update ALL onboardshows with the same global queue number
        console.log('🔄 Updating ALL onboardshows with global queue number');
        const allOnboardshows = await kvDatabase.findAll('onboardshows');
        
        const updatePromises = allOnboardshows.map(async (show) => {
          const showDocId = show._key.split(':')[1];
          return await kvDatabase.setField('onboardshows', showDocId, 'numbershow', newGlobalQueueNumber);
        });

        await Promise.all(updatePromises);
        console.log(`✅ Updated ${allOnboardshows.length} onboardshows with global queue number ${newGlobalQueueNumber}`);

        // Step 3: Update the specific onboardland that called this (for display purposes)
        console.log(`📝 Updating onboardland ${idshow} for display`);
        const onboardland = await kvDatabase.findOneByField('onboardlands', 'idshow', parseInt(idshow));
        
        if (!onboardland) {
          return res.status(404).json({ error: `Onboardland with idshow ${idshow} not found` });
        }

        // Update onboardlands with new global queue number, reset qcall, and set ab
        const landDocId = onboardland._key.split(':')[1];
        
        await kvDatabase.setField('onboardlands', landDocId, 'numbershow', newGlobalQueueNumber);
        await kvDatabase.setField('onboardlands', landDocId, 'qcall', false);
        if (idshowtext) {
          await kvDatabase.setField('onboardlands', landDocId, 'ab', idshowtext);
        }

        console.log(`✅ Updated onboardland ${idshow} with global queue number: ${newGlobalQueueNumber}`);

        return res.status(200).json({ 
          success: true,
          globalQueueNumber: newGlobalQueueNumber,
          message: `Global queue advanced to ${newGlobalQueueNumber}`,
          updatedOnboardshows: allOnboardshows.length,
          updatedOnboardland: idshow
        });

      } catch (error) {
        console.error('❌ Error in global queue increment:', error);
        throw error;
      }

    } else {
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }

  } catch (error) {
    console.error('❌ Error in onboardlandnums API:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
} 