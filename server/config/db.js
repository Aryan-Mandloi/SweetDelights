const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000 // Timeout quickly if remote fails
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Remote DB Connection Failed: ${error.message}`);
        console.log('Falling back to local in-memory MongoDB for development...');
        
        try {
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongoServer = await MongoMemoryServer.create();
            const memoryUri = mongoServer.getUri();
            
            await mongoose.connect(memoryUri);
            console.log(`In-Memory MongoDB Connected: ${memoryUri}`);
            
            // Automatically seed the memory database with cakes and admin
            console.log('Seeding local database with default cakes and admin account...');
            const seedDB = require('../seedEndpoint');
            await seedDB();
            console.log('Local database seeded successfully!');
        } catch (memError) {
            console.error('Failed to start in-memory database:', memError.message);
            process.exit(1);
        }
    }
};

module.exports = connectDB;
