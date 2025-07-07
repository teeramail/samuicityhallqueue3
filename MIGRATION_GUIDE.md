# Migration Guide: MongoDB to Vercel KV

## Overview
This project has been migrated from MongoDB to Vercel KV (Redis-based) for better performance and scalability on Vercel platform.

## What Changed

### 1. Database Connection
- **Before**: MongoDB with Mongoose
- **After**: Vercel KV (Redis-based key-value store)

### 2. Files Changed
- `package.json`: Updated dependencies
- `server/server.js`: Updated to use KV database
- `server/kv.js`: New KV database connection file
- `server/models/`: New data access objects (DAOs)
- `.env`: Environment variables for Vercel KV

### 3. New Files Created
- `server/kv.js`: KV database connection and helper functions
- `server/models/regisshows.js`: Regisshows data access object
- `server/models/onboardshows.js`: Onboardshows data access object
- `server/models/onboardlands.js`: Onboardlands data access object
- `server/models/onboardlandnums.js`: Onboardlandnums data access object
- `server/initialize-data.js`: Script to initialize sample data
- `.env`: Environment variables file

## Environment Variables
Make sure you have the following in your `.env` file:
```
KV_URL="rediss://default:AXT1AAIjcDE5NmU3NzdhZTQ2MDE0YjUzOTIyM2IyZTI2Njg2MDAzOXAxMA@active-muskrat-29941.upstash.io:6379"
KV_REST_API_URL="https://active-muskrat-29941.upstash.io"
KV_REST_API_TOKEN="AXT1AAIjcDE5NmU3NzdhZTQ2MDE0YjUzOTIyM2IyZTI2Njg2MDAzOXAxMA"
KV_REST_API_READ_ONLY_TOKEN="AnT1AAIgcDG1lc69ex2xTFMwEc4YBLGNvHvX89XUDxJscwd5mjIVag"
REDIS_URL="rediss://default:AXT1AAIjcDE5NmU3NzdhZTQ2MDE0YjUzOTIyM2IyZTI2Njg2MDAzOXAxMA@active-muskrat-29941.upstash.io:6379"
PORT=50100
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Initialize Data
```bash
npm run init-data
```

### 3. Start the Server
```bash
npm run server
```

## API Endpoints
All existing API endpoints remain the same:

### GET Endpoints
- `GET /regisshow` - Get all regisshows
- `GET /onboardshows` - Get all onboardshows
- `GET /onboardlands` - Get all onboardlands
- `GET /onboardlandnums` - Get onboardlandnums counter

### PUT Endpoints
- `PUT /regisshow` - Increment regisshow numbershow
- `PUT /onboardshows` - Increment onboardshow numbershow
- `PUT /onboardlands` - Increment onboardland numbershow
- `PUT /onboardshowsminus` - Decrement onboardshow numbershow
- `PUT /onboardlandnums` - Increment counter and update onboardland

## Data Structure
The data structure remains the same as MongoDB:

### Regisshows
```json
{
  "idshow": 1,
  "nameservice": "General Registration",
  "numbershow": 0,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Onboardshows
```json
{
  "idshow": 1,
  "nameservice": "General Onboarding",
  "numbershow": 0,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Onboardlands
```json
{
  "idshow": 1,
  "numbershow": 0,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Onboardlandnums
```json
{
  "numland": 0,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Key Benefits

1. **Performance**: Redis-based KV store is faster than MongoDB for simple operations
2. **Scalability**: Better scaling on Vercel platform
3. **Simplicity**: Reduced complexity without complex queries
4. **Cost**: More cost-effective for simple key-value operations
5. **Integration**: Native Vercel integration

## Troubleshooting

### Common Issues

1. **Environment Variables**: Make sure all KV environment variables are set correctly
2. **Data Initialization**: Run `npm run init-data` to initialize sample data
3. **Connection Issues**: Check if your Vercel KV instance is active

### Testing the Migration

1. Start the server: `npm run server`
2. Test GET endpoints to verify data retrieval
3. Test PUT endpoints to verify data updates
4. Check console logs for any errors

## Notes

- The migration maintains the same API interface, so frontend code should work without changes
- Data is stored in Redis as JSON objects with structured keys
- The counter mechanism for `onboardlandnums` is preserved
- All MongoDB operations ($inc, $set) are emulated in the KV implementation 