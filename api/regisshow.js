import { kvDatabase, handleCors } from './_utils/kv.js';

export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) {
    return; // Early return for OPTIONS request
  }

  try {
    if (req.method === 'GET') {
      // Get all regisshows
      const regisshows = await kvDatabase.findAll('regisshows');
      
      if (regisshows.length === 0) {
        return res.status(404).json({ error: 'No documents found in the collection' });
      }

      console.log('📊 Regisshows data:', regisshows);
      return res.status(200).json(regisshows);

    } else if (req.method === 'PUT') {
      // Increment regisshow numbershow
      console.log('📝 Request body:', req.body);
      const { idshow } = req.body;

      if (!idshow) {
        return res.status(400).json({ error: 'idshow is required' });
      }

      // Find the document by idshow
      const doc = await kvDatabase.findOneByField('regisshows', 'idshow', idshow);
      
      if (!doc) {
        return res.status(404).json({ error: 'Document not found' });
      }

      // Increment numbershow
      const updatedDoc = await kvDatabase.increment('regisshows', idshow, 'numbershow', 1);
      
      console.log('✅ Updated regisshow:', updatedDoc);
      return res.status(200).json(updatedDoc);

    } else {
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }

  } catch (error) {
    console.error('❌ Error in regisshow API:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
} 