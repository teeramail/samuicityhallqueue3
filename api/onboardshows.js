import { kvDatabase, handleCors } from './_utils/kv.js';

export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) {
    return; // Early return for OPTIONS request
  }

  try {
    if (req.method === 'GET') {
      // Get all onboardshows
      const onboardshows = await kvDatabase.findAll('onboardshows');
      
      if (onboardshows.length === 0) {
        return res.status(404).json({ error: 'No documents found in the collection' });
      }

      console.log('📊 Onboardshows data:', onboardshows);
      return res.status(200).json(onboardshows);

    } else if (req.method === 'PUT') {
      // Update onboardshow or increment numbershow
      console.log('📝 Request body:', req.body);
      const { idshow, mode } = req.body;

      if (!idshow) {
        return res.status(400).json({ error: 'idshow is required' });
      }

      // Find the document by idshow
      const doc = await kvDatabase.findOneByField('onboardshows', 'idshow', idshow);
      
      if (!doc) {
        return res.status(404).json({ error: 'Document not found' });
      }

      let updatedDoc;

      if (mode === 'setcall') {
        // Set callonboard to 1
        updatedDoc = await kvDatabase.setField('onboardshows', idshow, 'callonboard', 1);
      } else {
        // Default: increment numbershow
        updatedDoc = await kvDatabase.increment('onboardshows', idshow, 'numbershow', 1);
      }
      
      console.log('✅ Updated onboardshow:', updatedDoc);
      return res.status(200).json(updatedDoc);

    } else {
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }

  } catch (error) {
    console.error('❌ Error in onboardshows API:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
} 