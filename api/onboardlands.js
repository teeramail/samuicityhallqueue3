import { kvDatabase, handleCors } from './_utils/kv.js';

export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) {
    return; // Early return for OPTIONS request
  }

  try {
    if (req.method === 'GET') {
      // Get all onboardlands
      const onboardlands = await kvDatabase.findAll('onboardlands');
      
      if (onboardlands.length === 0) {
        return res.status(404).json({ error: 'No documents found in the collection' });
      }

      console.log('📊 Onboardlands data:', onboardlands);
      return res.status(200).json(onboardlands);

    } else if (req.method === 'PUT') {
      // Update onboardland or increment/set fields
      console.log('📝 Request body:', req.body);
      const { idland, idshow, mode } = req.body;

      let doc;
      let documentId;

      // Handle both idland and idshow parameters
      if (idland) {
        // Find by idland (direct lookup)
        doc = await kvDatabase.findOneByField('onboardlands', 'idland', idland);
        documentId = idland;
      } else if (idshow) {
        // Find by idshow (lookup by field)
        doc = await kvDatabase.findOneByField('onboardlands', 'idshow', parseInt(idshow));
        if (!doc) {
          doc = await kvDatabase.findOneByField('onboardlands', 'idshow', idshow);
        }
        if (doc) {
          documentId = doc._key.split(':')[1]; // Extract ID from key
        }
      } else {
        return res.status(400).json({ error: 'Either idland or idshow is required' });
      }
      
      if (!doc) {
        return res.status(404).json({ error: 'Document not found' });
      }

      console.log('🔍 Found document:', doc, 'using documentId:', documentId);

      let updatedDoc;

      if (mode === 'setcall') {
        // Set qcall to false (following original Express logic) AND copy current queue number from onboardshows
        console.log('📢 Setting qcall = false and copying current queue number');
        
        // First, get the current queue number from onboardshows
        const onboardshow = await kvDatabase.findOneByField('onboardshows', 'idshow', parseInt(idshow) || idshow);
        if (!onboardshow) {
          return res.status(404).json({ error: 'Corresponding onboardshow not found' });
        }
        
        console.log('📊 Current onboardshow:', onboardshow);
        const currentQueueNumber = onboardshow.numbershow || 0;
        
        // Update both qcall and numbershow (following original Express updateatt logic)
        await kvDatabase.setField('onboardlands', documentId, 'qcall', false);
        updatedDoc = await kvDatabase.setField('onboardlands', documentId, 'numbershow', currentQueueNumber);
        
        console.log(`✅ Queue ${currentQueueNumber} for counter ${idshow} is now ready for display`);
      } else {
        // Default: increment numbershow
        updatedDoc = await kvDatabase.increment('onboardlands', documentId, 'numbershow', 1);
      }
      
      console.log('✅ Updated onboardland:', updatedDoc);
      return res.status(200).json(updatedDoc);

    } else {
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }

  } catch (error) {
    console.error('❌ Error in onboardlands API:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
} 