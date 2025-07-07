import { kvDatabase, handleCors } from './_utils/kv.js';

export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) {
    return; // Early return for OPTIONS request
  }

  try {
    if (req.method === 'GET') {
      // Get data from both collections
      const [onboardshows, onboardlands] = await Promise.all([
        kvDatabase.findAll('onboardshows'),
        kvDatabase.findAll('onboardlands')
      ]);

      // Calculate differences by idshow
      const combinations = [];
      
      // Group lands by idshow
      const landsByIdshow = {};
      onboardlands.forEach(land => {
        if (!landsByIdshow[land.idshow]) {
          landsByIdshow[land.idshow] = [];
        }
        landsByIdshow[land.idshow].push(land);
      });

      // Calculate differences for each show
      onboardshows.forEach(show => {
        const lands = landsByIdshow[show.idshow] || [];
        const totalLandCount = lands.length;
        const currentShowNumber = show.numbershow || 0;
        
        // Calculate difference (how many people are waiting)
        const difference = Math.max(0, totalLandCount - currentShowNumber);
        
        combinations.push({
          idshow: show.idshow,
          nameservice: show.nameservice,
          currentNumber: currentShowNumber,
          totalInQueue: totalLandCount,
          difference: difference,
          updatedAt: new Date().toISOString()
        });
      });

      console.log('📊 Combine record data:', combinations);
      return res.status(200).json(combinations);

    } else {
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }

  } catch (error) {
    console.error('❌ Error in combine-record API:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
} 