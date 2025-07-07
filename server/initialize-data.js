require('dotenv').config();
const kvDatabase = require('./kv');

// Sample data for initialization
const sampleData = {
  regisshows: [
    { idshow: 1, nameservice: "General Registration", numbershow: 0 },
    { idshow: 2, nameservice: "Premium Registration", numbershow: 0 },
    { idshow: 3, nameservice: "VIP Registration", numbershow: 0 }
  ],
  onboardshows: [
    { idshow: 1, nameservice: "General Onboarding", numbershow: 0 },
    { idshow: 2, nameservice: "Premium Onboarding", numbershow: 0 },
    { idshow: 3, nameservice: "VIP Onboarding", numbershow: 0 }
  ],
  onboardlands: [
    { idshow: 1, numbershow: 0 },
    { idshow: 2, numbershow: 0 },
    { idshow: 3, numbershow: 0 }
  ],
  onboardlandnums: [
    { numland: 0 }
  ]
};

async function initializeData() {
  try {
    console.log('Initializing KV database with sample data...');

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
      await kvDatabase.upsert('onboardlands', item.idshow, item);
      console.log(`Created onboardland: ${item.idshow}`);
    }

    // Initialize Onboardlandnums (counter)
    console.log('Initializing onboardlandnums...');
    await kvDatabase.upsert('onboardlandnums', '1', sampleData.onboardlandnums[0]);
    console.log('Created onboardlandnums counter');

    console.log('✅ Data initialization completed successfully!');
    
    // Verify data
    console.log('\nVerifying data...');
    const regisshows = await kvDatabase.findAll('regisshows');
    const onboardshows = await kvDatabase.findAll('onboardshows');
    const onboardlands = await kvDatabase.findAll('onboardlands');
    const onboardlandnums = await kvDatabase.findAll('onboardlandnums');

    console.log(`Regisshows: ${regisshows.length} documents`);
    console.log(`Onboardshows: ${onboardshows.length} documents`);
    console.log(`Onboardlands: ${onboardlands.length} documents`);
    console.log(`Onboardlandnums: ${onboardlandnums.length} documents`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing data:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  initializeData();
}

module.exports = { initializeData, sampleData }; 