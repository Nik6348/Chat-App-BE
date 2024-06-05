import mongoose from 'mongoose'

export const mongoConnection = async (DB_URL) => {
    try {
        await mongoose.connect(DB_URL)
        console.log('Database Connected Successfully!')
    } catch (error) {
        console.log(`Database Connection Error: ${error}`)
    }
}

