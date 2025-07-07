import { kvDatabase, handleCors } from './_utils/kv.js';

export default async function handler(req, res) {
  // Handle CORS
  if (handleCors(req, res)) {
    return; // Early return for OPTIONS request
  }

  try {
    if (req.method === 'GET') {
      // Get all data from all collections
      const [regisshows, onboardshows, onboardlands, onboardlandnums] = await Promise.all([
        kvDatabase.findAll('regisshows'),
        kvDatabase.findAll('onboardshows'),
        kvDatabase.findAll('onboardlands'),
        kvDatabase.findAll('onboardlandnums')
      ]);

      const allData = {
        regisshows,
        onboardshows,
        onboardlands,
        onboardlandnums,
        totalKeys: regisshows.length + onboardshows.length + onboardlands.length + onboardlandnums.length,
        timestamp: new Date().toISOString()
      };

      // Return HTML view if Accept header contains text/html
      const acceptHeader = req.headers.accept || '';
      if (acceptHeader.includes('text/html')) {
        const html = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Vercel KV Data Viewer</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .collection { margin: 20px 0; border: 1px solid #ccc; padding: 15px; }
              .collection h2 { color: #333; margin-top: 0; }
              .item { background: #f5f5f5; margin: 10px 0; padding: 10px; border-radius: 5px; }
              .key { font-weight: bold; color: #666; }
              pre { background: #eee; padding: 10px; border-radius: 3px; overflow-x: auto; }
              .stats { background: #e8f4fd; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <h1>🗄️ Vercel KV Database Viewer</h1>
            
            <div class="stats">
              <h3>📊 Database Statistics</h3>
              <p><strong>Total Keys:</strong> ${allData.totalKeys}</p>
              <p><strong>Last Updated:</strong> ${allData.timestamp}</p>
              <p><strong>Collections:</strong></p>
              <ul>
                <li>Regisshows: ${regisshows.length} documents</li>
                <li>Onboardshows: ${onboardshows.length} documents</li>
                <li>Onboardlands: ${onboardlands.length} documents</li>
                <li>Onboardlandnums: ${onboardlandnums.length} documents</li>
              </ul>
            </div>

            ${Object.entries(allData).filter(([key]) => !['totalKeys', 'timestamp'].includes(key)).map(([collectionName, items]) => `
              <div class="collection">
                <h2>📋 ${collectionName.toUpperCase()} (${items.length} items)</h2>
                ${items.length === 0 ? '<p>No data found</p>' : 
                  items.map(item => `
                    <div class="item">
                      <div class="key">Key: ${item._key}</div>
                      <pre>${JSON.stringify(item, null, 2)}</pre>
                    </div>
                  `).join('')
                }
              </div>
            `).join('')}

          </body>
          </html>
        `;
        
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(html);
      }

      // Return JSON for API calls
      console.log('📊 All KV data requested:', allData);
      return res.status(200).json(allData);

    } else {
      return res.status(405).json({ error: `Method ${req.method} not allowed` });
    }

  } catch (error) {
    console.error('❌ Error in view-all-data API:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
} 