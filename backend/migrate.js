const mongoose = require('mongoose');
require('dns').setServers(['8.8.8.8', '8.8.4.4']);

const localUri = 'mongodb://localhost:27017/inventory';
const remoteUri = 'mongodb+srv://shikhar_db_user:harsh%401404@cluster0.joacmsf.mongodb.net/Stockify?appName=Cluster0';

async function migrate() {
    console.log("Connecting to local database...");
    const localConn = await mongoose.createConnection(localUri).asPromise();
    
    console.log("Connecting to remote Atlas database...");
    const remoteConn = await mongoose.createConnection(remoteUri).asPromise();
    
    const collections = await localConn.db.listCollections().toArray();
    console.log(`Found ${collections.length} collections.`);

    for (const collInfo of collections) {
        const collectionName = collInfo.name;
        if (collectionName === 'system.profile') continue;

        console.log(`Migrating collection: ${collectionName}...`);
        
        const localCollection = localConn.collection(collectionName);
        const remoteCollection = remoteConn.collection(collectionName);
        
        const data = await localCollection.find({}).toArray();
        console.log(`   Fetched ${data.length} documents from ${collectionName}.`);
        
        if (data.length > 0) {
            try {
                await remoteCollection.drop();
                console.log(`   Dropped existing remote collection ${collectionName}`);
            } catch (e) {
                // Ignore if doesn't exist
            }
            await remoteCollection.insertMany(data);
            console.log(`   Inserted ${data.length} documents into remote ${collectionName}.`);
        }
    }
    
    console.log("Migration completed successfully!");
    
    await localConn.close();
    await remoteConn.close();
    process.exit(0);
}

migrate().catch(err => {
    console.error("Migration failed:", err);
    process.exit(1);
});
