import mongoose from 'mongoose';

class DocumentRepository {
    static getBucket() {
        const db = mongoose.connection.db;
        return new mongoose.mongo.GridFSBucket(db, { bucketName: 'documents' });
    }

    static async findAll() {
        const bucket = DocumentRepository.getBucket();
        return await bucket.find({}).toArray();
    }

    static async findByFilename(filename) {
        const bucket = DocumentRepository.getBucket();
        return await bucket.find({ filename }).toArray();
    }
    
    static getDownloadStream(filename) {
        const bucket = DocumentRepository.getBucket();
        return bucket.openDownloadStreamByName(filename);
    }
}

export default DocumentRepository;
