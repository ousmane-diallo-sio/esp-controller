import * as dotenv from 'dotenv'
dotenv.config()

const EnvConfig = {
  NODE_ENV: process.env.NODE_ENV ?? "dev",
  HOST: process.env.HOST ?? "127.0.0.1",
  PORT: process.env.PORT ?? 3005,
  MONGO_DB_NAME: process.env.MONGO_DB_NAME ?? "randomdb",
  MONGO_USER: process.env.MONGO_USER ?? "user",
  MONGO_HOST: process.env.MONGO_HOST ?? "mongohost",
  MONGO_PASSWORD: process.env.MONGO_PASSWORD ?? "password",
  MONGO_PORT: process.env.MONGO_PORT ?? 27017,
  JWT_SECRET: process.env.JWT_SECRET ?? "azerty"
}

export default EnvConfig