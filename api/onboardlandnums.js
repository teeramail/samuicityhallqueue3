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
      // Increment counter
      console.log('📝 Request body:', req.body);
      
      // The counter document has ID "1" 
      const counterId = "1";
      
      // Find the counter document
      let doc = await kvDatabase.findOne('onboardlandnums', counterId);
      
      if (!doc) {
        // Create initial counter if it doesn't exist
        doc = await kvDatabase.upsert('onboardlandnums', counterId, {
          id: 1,
          counter: 0
        });
      }

      // Increment the counter
      const updatedDoc = await kvDatabase.increment('onboardlandnums', counterId, 'counter', 1);
      
      console.log('✅ Updated counter:', updatedDoc);
      return res.status(200).json(updatedDoc);

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