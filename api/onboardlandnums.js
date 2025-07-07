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
      // Original logic: increment onboardshows, then update onboardlands
      console.log('📝 Request body:', req.body);
      const { idshow, idshowtype, idshowtext } = req.body;

      if (!idshow || !idshowtype) {
        return res.status(400).json({ error: 'idshow and idshowtype are required' });
      }

      try {
        // Step 1: Increment onboardshows where idshow = idshowtype
        console.log(`🔢 Incrementing onboardshows for idshow: ${idshowtype}`);
        const onboardshow = await kvDatabase.findOneByField('onboardshows', 'idshow', parseInt(idshowtype));
        
        if (!onboardshow) {
          return res.status(404).json({ error: `Onboardshow with idshow ${idshowtype} not found` });
        }

        // Increment the numbershow in onboardshows
        const updatedOnboardshow = await kvDatabase.increment('onboardshows', idshowtype, 'numbershow', 1);
        const newNumbershow = updatedOnboardshow.numbershow;

        console.log(`📈 Incremented onboardshow ${idshowtype} to numbershow: ${newNumbershow}`);

        // Step 2: Update onboardlands with the new numbershow
        console.log(`📝 Updating onboardlands for idshow: ${idshow}`);
        const onboardland = await kvDatabase.findOneByField('onboardlands', 'idshow', parseInt(idshow));
        
        if (!onboardland) {
          return res.status(404).json({ error: `Onboardland with idshow ${idshow} not found` });
        }

        // Update onboardlands with new numbershow, reset qcall, and set ab
        const updateData = {
          numbershow: newNumbershow,
          qcall: false,
          ab: idshowtext || 'A'
        };

        // Use the document ID from the key
        const documentId = onboardland._key.split(':')[1];
        
        // Update each field
        await kvDatabase.setField('onboardlands', documentId, 'numbershow', newNumbershow);
        await kvDatabase.setField('onboardlands', documentId, 'qcall', false);
        if (idshowtext) {
          await kvDatabase.setField('onboardlands', documentId, 'ab', idshowtext);
        }

        console.log(`✅ Updated onboardland ${idshow} with numbershow: ${newNumbershow}`);

        return res.status(200).json({ 
          message: "updated successfully",
          newNumbershow: newNumbershow,
          idshow: idshow,
          idshowtype: idshowtype
        });

      } catch (updateError) {
        console.error('❌ Error during update process:', updateError);
        return res.status(500).json({ 
          error: 'Error updating records',
          message: updateError.message 
        });
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