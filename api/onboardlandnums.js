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
      // OPTIMIZED GLOBAL QUEUE SYSTEM: Fast increment with minimal operations
      const { idshow, idshowtype, idshowtext } = req.body;

      if (!idshowtype) {
        return res.status(400).json({ error: 'idshowtype is required' });
      }

      try {
        console.log(`🚀 Fast queue increment for counter ${idshowtype}`);
        
        // Step 1: Increment global counter (optimized - single operation)
        const landnums = await kvDatabase.findAll('onboardlandnums');
        let newGlobalQueueNumber;
        
        if (landnums.length === 0) {
          // Create initial global counter
          const globalCounter = await kvDatabase.upsert('onboardlandnums', '1', { numland: 1 });
          newGlobalQueueNumber = 1;
        } else {
          // Fast increment - single atomic operation
          const globalCounter = await kvDatabase.increment('onboardlandnums', '1', 'numland', 1);
          newGlobalQueueNumber = globalCounter.numland;
        }

        console.log(`⚡ Global queue: ${newGlobalQueueNumber}`);

        // Step 2: Batch update ALL onboardshows (optimized with Promise.all)
        const allOnboardshows = await kvDatabase.findAll('onboardshows');
        
        // Parallel updates for maximum speed
        const updatePromises = allOnboardshows.map(async (show) => {
          const showDocId = show._key.split(':')[1];
          return kvDatabase.setField('onboardshows', showDocId, 'numbershow', newGlobalQueueNumber);
        });

        await Promise.all(updatePromises);

        // Step 3: Quick update onboardland (only if idshow provided)
        if (idshow) {
          const onboardland = await kvDatabase.findOneByField('onboardlands', 'idshow', parseInt(idshow));
          
          if (onboardland) {
            const landDocId = onboardland._key.split(':')[1];
            
            // Batch update for efficiency
            const landUpdates = [
              kvDatabase.setField('onboardlands', landDocId, 'numbershow', newGlobalQueueNumber),
              kvDatabase.setField('onboardlands', landDocId, 'qcall', false)
            ];
            
            if (idshowtext) {
              landUpdates.push(kvDatabase.setField('onboardlands', landDocId, 'ab', idshowtext));
            }
            
            await Promise.all(landUpdates);
          }
        }

        console.log(`✅ Fast update complete: Queue ${newGlobalQueueNumber}, Updated ${allOnboardshows.length} shows`);

        // Minimal response for speed
        return res.status(200).json({ 
          success: true,
          queue: newGlobalQueueNumber,
          counter: idshowtype
        });

      } catch (error) {
        console.error('❌ Fast increment error:', error);
        throw error;
      }

    } else {
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }

  } catch (error) {
    console.error('❌ API Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
} 