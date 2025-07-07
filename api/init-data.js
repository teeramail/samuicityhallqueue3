import { kvDatabase, handleCors } from './_utils/kv.js';

// Sample data for initialization
const sampleData = {
  regisshows: [
    { idshow: 1, nameservice: "General Registration", numbershow: 0 },
    { idshow: 2, nameservice: "Premium Registration", numbershow: 0 },
    { idshow: 3, nameservice: "VIP Registration", numbershow: 0 }
  ],
  onboardshows: [
    { idshow: 1, nameservice: "General Onboarding", numbershow: 0, callonboard: 0 },
    { idshow: 2, nameservice: "Premium Onboarding", numbershow: 0, callonboard: 0 },
    { idshow: 3, nameservice: "VIP Onboarding", numbershow: 0, callonboard: 0 }
  ],
  onboardlands: [
    { idland: 1, idshow: 1, numbershow: 0, callonboard: 0, nameservice: "Sample Land 1" },
    { idland: 2, idshow: 2, numbershow: 0, callonboard: 0, nameservice: "Sample Land 2" },
    { idland: 3, idshow: 3, numbershow: 0, callonboard: 0, nameservice: "Sample Land 3" }
  ],
  onboardlandnums: [
    { id: 1, counter: 0 }
  ]
};

export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) {
    return; // Early return for OPTIONS request
  }

  try {
    if (req.method === 'POST') {
      console.log('🔄 Initializing KV database with sample data...');

      // Initialize Regisshows
      console.log('Initializing regisshows...');
      for (const item of sampleData.regisshows) {
        await kvDatabase.upsert('regisshows', item.idshow, item);
        console.log(`Created regisshow: ${item.nameservice}`);
      }

      // Initialize Onboardshows
      console.log('Initializing onboardshows...');
      for (const item of sampleData.onboardshows) {
        await kvDatabase.upsert('onboardshows', item.idshow, item);
        console.log(`Created onboardshow: ${item.nameservice}`);
      }

      // Initialize Onboardlands
      console.log('Initializing onboardlands...');
      for (const item of sampleData.onboardlands) {
        await kvDatabase.upsert('onboardlands', item.idland, item);
        console.log(`Created onboardland: ${item.idland}`);
      }

      // Initialize Onboardlandnums (counter)
      console.log('Initializing onboardlandnums...');
      await kvDatabase.upsert('onboardlandnums', '1', sampleData.onboardlandnums[0]);
      console.log('Created onboardlandnums counter');

      console.log('✅ Data initialization completed successfully!');
      
      // Verify data
      console.log('Verifying data...');
      const [regisshows, onboardshows, onboardlands, onboardlandnums] = await Promise.all([
        kvDatabase.findAll('regisshows'),
        kvDatabase.findAll('onboardshows'),
        kvDatabase.findAll('onboardlands'),
        kvDatabase.findAll('onboardlandnums')
      ]);

      const summary = {
        message: 'Data initialization completed successfully',
        counts: {
          regisshows: regisshows.length,
          onboardshows: onboardshows.length,
          onboardlands: onboardlands.length,
          onboardlandnums: onboardlandnums.length
        },
        data: {
          regisshows,
          onboardshows,
          onboardlands,
          onboardlandnums
        },
        timestamp: new Date().toISOString()
      };

      return res.status(200).json(summary);

    } else {
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }

  } catch (error) {
    console.error('❌ Error initializing data:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
} 