import { kvDatabase, handleCors } from './_utils/kv.js';

export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) {
    return; // Early return for OPTIONS request
  }

  try {
    if (req.method === 'PUT') {
      // Update timestamp for a specific record
      console.log('📝 Request body:', req.body);
      const { idshow } = req.body;

      if (!idshow) {
        return res.status(400).json({ error: 'idshow is required' });
      }

      // Find the document by idshow in onboardlands
      const doc = await kvDatabase.findOneByField('onboardlands', 'idshow', idshow);
      
      if (!doc) {
        return res.status(404).json({ error: 'Document not found' });
      }

      // Update the timestamp (updatedAt)
      const updatedDoc = await kvDatabase.setField('onboardlands', doc.idland, 'updatedAt', new Date().toISOString());
      
      console.log('✅ Updated timestamp for document:', updatedDoc);
      return res.status(200).json(updatedDoc);

    } else {
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }

  } catch (error) {
    console.error('❌ Error in updateatt API:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
} 