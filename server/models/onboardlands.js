const kvDatabase = require('../kv');

class OnboardlandsDAO {
  constructor() {
    this.collection = 'onboardlands';
  }

  // Find all onboardlands
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
      console.error('Error finding onboardlands:', error);
      throw error;
    }
  }

  // Find one onboardland by ID
  async findOne(query) {
    try {
      if (query.idshow) {
        return await kvDatabase.findOneByField(this.collection, 'idshow', query.idshow);
      }
      
      const allDocs = await kvDatabase.findAll(this.collection);
      return allDocs.find(doc => {
        return Object.keys(query).every(key => doc[key] === query[key]);
      }) || null;
    } catch (error) {
      console.error('Error finding one onboardland:', error);
      throw error;
    }
  }

  // Find one and update
  async findOneAndUpdate(query, update, options = {}) {
    try {
      const doc = await this.findOne(query);
      if (!doc) {
        if (options.upsert) {
          // Create new document
          const newDoc = {
            ...query,
            ...this.applyUpdate(update, {})
          };
          await kvDatabase.upsert(this.collection, newDoc.idshow, newDoc);
          return newDoc;
        }
        return null;
      }

      // Apply update operations
      const updatedDoc = this.applyUpdate(update, doc);
      await kvDatabase.upsert(this.collection, doc.idshow, updatedDoc);
      
      return options.new ? updatedDoc : doc;
    } catch (error) {
      console.error('Error updating onboardland:', error);
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

  // Create a new onboardland
  async create(data) {
    try {
      const newDoc = {
        idshow: data.idshow,
        numbershow: data.numbershow || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      return await kvDatabase.upsert(this.collection, newDoc.idshow, newDoc);
    } catch (error) {
      console.error('Error creating onboardland:', error);
      throw error;
    }
  }
}

// Export instance to mimic mongoose model usage
module.exports = new OnboardlandsDAO(); 