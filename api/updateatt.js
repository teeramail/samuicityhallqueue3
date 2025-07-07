import { kvDatabase, handleCors } from './_utils/kv.js';

export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) {
    return; // Early return for OPTIONS request
  }

  try {
    if (req.method === 'PUT') {
      // Set qcall to false (following original Express updateatt logic)
      console.log('📝 Request body:', req.body);
      const { idshow } = req.body;

      if (!idshow) {
        return res.status(400).json({ error: 'idshow is required' });
      }

      // Find the document by idshow in onboardlands
      const doc = await kvDatabase.findOneByField('onboardlands', 'idshow', parseInt(idshow));
      
      if (!doc) {
        return res.status(404).json({ error: 'Document not found' });
      }

      // Extract document ID from key
      const documentId = doc._key.split(':')[1];

      // Set qcall to false (original Express logic: makes queue ready for display)
      const updatedDoc = await kvDatabase.setField('onboardlands', documentId, 'qcall', false);
      
      console.log('✅ Set qcall=false for queue display:', updatedDoc);
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