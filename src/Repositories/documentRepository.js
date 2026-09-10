import mongoose from 'mongoose';

class DocumentRepository {
    getBucket() {
        const db = mongoose.connection.db;
        return new mongoose.mongo.GridFSBucket(db, { bucketName: 'documents' });
    }

    async findAll() {
        const bucket = this.getBucket();
        return await bucket.find({}).toArray();
    }

    async findByFilename(filename) {
        const bucket = this.getBucket();
        return await bucket.find({ filename }).toArray();
    }
    
    getDownloadStream(filename) {
        const bucket = this.getBucket();
        return bucket.openDownloadStreamByName(filename);
    }
}

export default new DocumentRepository();
