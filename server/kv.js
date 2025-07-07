require('dotenv').config();
const { kv } = require('@vercel/kv');

// Initialize KV client
const kvClient = kv;

// Helper functions for data operations
class KVDatabase {
  constructor() {
    this.kvClient = kvClient;
  }

  // Generate a unique key for documents
  generateKey(collection, id) {
    return `${collection}:${id}`;
  }

  // Get all documents from a collection
  async findAll(collection) {
    try {
      const keys = await this.kvClient.keys(`${collection}:*`);
      if (keys.length === 0) return [];
      
      const values = await this.kvClient.mget(...keys);
      return keys.map((key, index) => ({
        ...values[index],
        _key: key
      }));
    } catch (error) {
      console.error(`Error finding all documents in ${collection}:`, error);
      throw error;
    }
  }

  // Find a single document by ID
  async findOne(collection, id) {
    try {
      const key = this.generateKey(collection, id);
      const document = await this.kvClient.get(key);
      return document ? { ...document, _key: key } : null;
    } catch (error) {
      console.error(`Error finding document ${id} in ${collection}:`, error);
      throw error;
    }
  }

  // Find document by field value
  async findOneByField(collection, field, value) {
    try {
      const allDocs = await this.findAll(collection);
      return allDocs.find(doc => doc[field] === value) || null;
    } catch (error) {
      console.error(`Error finding document by ${field} in ${collection}:`, error);
      throw error;
    }
  }

  // Insert or update a document
  async upsert(collection, id, data) {
    try {
      const key = this.generateKey(collection, id);
      const now = new Date().toISOString();
      
      const document = {
        ...data,
        createdAt: data.createdAt || now,
        updatedAt: now
      };

      await this.kvClient.set(key, document);
      return { ...document, _key: key };
    } catch (error) {
      console.error(`Error upserting document ${id} in ${collection}:`, error);
      throw error;
    }
  }

  // Increment a field value
  async increment(collection, id, field, amount = 1) {
    try {
      const key = this.generateKey(collection, id);
      const document = await this.kvClient.get(key);
      
      if (!document) {
        throw new Error(`Document ${id} not found in ${collection}`);
      }

      const newValue = (document[field] || 0) + amount;
      const updatedDocument = {
        ...document,
        [field]: newValue,
        updatedAt: new Date().toISOString()
      };

      await this.kvClient.set(key, updatedDocument);
      return { ...updatedDocument, _key: key };
    } catch (error) {
      console.error(`Error incrementing ${field} for document ${id} in ${collection}:`, error);
      throw error;
    }
  }

  // Set a field value
  async setField(collection, id, field, value) {
    try {
      const key = this.generateKey(collection, id);
      const document = await this.kvClient.get(key);
      
      if (!document) {
        throw new Error(`Document ${id} not found in ${collection}`);
      }

      const updatedDocument = {
        ...document,
        [field]: value,
        updatedAt: new Date().toISOString()
      };

      await this.kvClient.set(key, updatedDocument);
      return { ...updatedDocument, _key: key };
    } catch (error) {
      console.error(`Error setting ${field} for document ${id} in ${collection}:`, error);
      throw error;
    }
  }

  // Delete a document
  async delete(collection, id) {
    try {
      const key = this.generateKey(collection, id);
      await this.kvClient.del(key);
      return true;
    } catch (error) {
      console.error(`Error deleting document ${id} from ${collection}:`, error);
      throw error;
    }
  }

  // Get counter value and increment it
  async getAndIncrementCounter(counterName) {
    try {
      const key = `counter:${counterName}`;
      const currentValue = await this.kvClient.get(key) || 0;
      const newValue = currentValue + 1;
      await this.kvClient.set(key, newValue);
      return newValue;
    } catch (error) {
      console.error(`Error incrementing counter ${counterName}:`, error);
      throw error;
    }
  }

  // Initialize collections with sample data if needed
  async initializeCollections() {
    try {
      // Check if collections are empty and initialize with sample data
      const regisshows = await this.findAll('regisshows');
      const onboardshows = await this.findAll('onboardshows');
      const onboardlands = await this.findAll('onboardlands');
      const onboardlandnums = await this.findAll('onboardlandnums');

      if (regisshows.length === 0) {
        console.log('Initializing regisshows collection...');
        // Add sample data if needed
      }

      if (onboardshows.length === 0) {
        console.log('Initializing onboardshows collection...');
        // Add sample data if needed
      }

      if (onboardlands.length === 0) {
        console.log('Initializing onboardlands collection...');
        // Add sample data if needed
      }

      if (onboardlandnums.length === 0) {
        console.log('Initializing onboardlandnums collection...');
        await this.upsert('onboardlandnums', '1', { numland: 0 });
      }

      console.log('KV Database initialized successfully');
    } catch (error) {
      console.error('Error initializing KV database:', error);
    }
  }
}

// Export a singleton instance
const kvDatabase = new KVDatabase();

module.exports = kvDatabase; 