import { kv } from '@vercel/kv';

// Helper functions for data operations in Vercel API functions
export class KVDatabase {
  constructor() {
    this.kvClient = kv;
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
}

// CORS headers for API responses
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Helper to handle CORS
export function handleCors(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  
  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
  
  return false;
}

// Export a singleton instance
export const kvDatabase = new KVDatabase(); 