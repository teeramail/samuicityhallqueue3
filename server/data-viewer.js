require('dotenv').config();
const kvDatabase = require('./kv');

async function viewAllData() {
  try {
    console.log('🔍 Viewing all data in Vercel KV Database...\n');

    // Get all collections
    const collections = ['regisshows', 'onboardshows', 'onboardlands', 'onboardlandnums'];
    
    for (const collection of collections) {
      console.log(`📊 Collection: ${collection.toUpperCase()}`);
      console.log('=' .repeat(50));
      
      const data = await kvDatabase.findAll(collection);
      
      if (data.length === 0) {
        console.log('  (No data found)');
      } else {
        data.forEach((item, index) => {
          console.log(`  ${index + 1}. Key: ${item._key}`);
          delete item._key; // Remove _key for cleaner display
          console.log(`     Data:`, JSON.stringify(item, null, 6));
          console.log('');
        });
      }
      console.log('\n');
    }

    // Show all keys in the database
    console.log('🔑 All Keys in Database:');
    console.log('=' .repeat(30));
    const { kv } = require('@vercel/kv');
    const allKeys = await kv.keys('*');
    allKeys.forEach((key, index) => {
      console.log(`  ${index + 1}. ${key}`);
    });

    console.log(`\n📈 Total Keys: ${allKeys.length}`);
    
  } catch (error) {
    console.error('❌ Error viewing data:', error);
  }
}

// Run the viewer
viewAllData().then(() => {
  console.log('\n✅ Data viewing completed!');
  process.exit(0);
}).catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});

module.exports = { viewAllData }; 