const mongoose = require('mongoose')

const dbConnect = async () => {
    try{
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI)
        console.log('DB connnected successfully')
    } catch(e) {
        console.log(`DB ERROR: ${e}`)
    }
}

module.exports = dbConnect