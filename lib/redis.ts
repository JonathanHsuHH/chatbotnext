import Redis from 'ioredis'

// break the app if the no REDIS_URL
if (!process.env.REDIS_URL) {
    throw new Error('Missing Environment Variable REDIS_URL')
}

const redis = new Redis(process.env.REDIS_URL)

export default redis