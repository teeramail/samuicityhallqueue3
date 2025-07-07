const kvDatabase = require('../kv');

class OnboardlandnumsDAO {
  constructor() {
    this.collection = 'onboardlandnums';
  }

  // Find all onboardlandnums
  async find(query = {}) {
    try {
      const allDocs = await kvDatabase.findAll(this.collection);
      
      // If no query, return all documents
      if (Object.keys(query).length === 0) {
        return allDocs;
      }

      // Filter by query parameters
      return allDocs.filter(doc => {
        return Object.keys(query).every(key => doc[key] === query[key]);
      });
    } catch (error) {
      console.error('Error finding onboardlandnums:', error);
      throw error;
    }
  }

  // Find one onboardlandnum - typically there's only one counter document
  async findOne(query = {}) {
    try {
      const allDocs = await kvDatabase.findAll(this.collection);
      
      if (Object.keys(query).length === 0) {
        // Return the first document (counter document)
        return allDocs[0] || null;
      }

      return allDocs.find(doc => {
        return Object.keys(query).every(key => doc[key] === query[key]);
      }) || null;
    } catch (error) {
      console.error('Error finding one onboardlandnum:', error);
      throw error;
    }
  }

  // Find one and update
  async findOneAndUpdate(query, update, options = {}) {
    try {
      let doc = await this.findOne(query);
      
      if (!doc) {
        if (options.upsert) {
          // Create new document
          const newDoc = {
            numland: 0,
            ...query,
            ...this.applyUpdate(update, {})
          };
          await kvDatabase.upsert(this.collection, '1', newDoc);
          return newDoc;
        }
        return null;
      }

      // Apply update operations
      const updatedDoc = this.applyUpdate(update, doc);
      await kvDatabase.upsert(this.collection, '1', updatedDoc);
      
      return options.new ? updatedDoc : doc;
    } catch (error) {
      console.error('Error updating onboardlandnum:', error);
      throw error;
    }
  }

  // Apply MongoDB-style update operations
  applyUpdate(update, doc) {
    const result = { ...doc };
    
    if (update.$inc) {
      Object.keys(update.$inc).forEach(key => {
        result[key] = (result[key] || 0) + update.$inc[key];
      });
    }
    
    if (update.$set) {
      Object.keys(update.$set).forEach(key => {
        result[key] = update.$set[key];
      });
    }
    
    return result;
  }

  // Create a new onboardlandnum (counter)
  async create(data) {
    try {
      const newDoc = {
        numland: data.numland || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return await kvDatabase.upsert(this.collection, '1', newDoc);
    } catch (error) {
      console.error('Error creating onboardlandnum:', error);
      throw error;
    }
  }
}

// Export instance to mimic mongoose model usage
module.exports = new OnboardlandnumsDAO(); 