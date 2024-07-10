import mongoose from 'mongoose';
import EnvConfig from './lib/config/EnvConfig';
import express from 'express';
import userController from './domain/user/controller';
import { authErrorHandler, requestLogger } from './lib/middlewares';
import cors from "cors";
import bodyParser from 'body-parser';
import gameConfigController from './domain/gameConfig/controller';

const mongoConnectionString = `mongodb://${EnvConfig.MONGO_USER}:${EnvConfig.MONGO_PASSWORD}@controllerdb:${EnvConfig.MONGO_PORT}/${EnvConfig.MONGO_DB_NAME}`;

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(requestLogger);

mongoose.connect(mongoConnectionString)
.then(() => console.log("Connected to MongoDB"))
.catch((e) => console.error(e));

app.get('/', (req, res) => {
  res.contentType("application/json")
  res.send('Hello World!')
})

app.use("/user", userController);
app.use("/game-config", gameConfigController);

app.use(authErrorHandler);

app.listen(EnvConfig.PORT, () => {
  console.log(`Server running at http://${EnvConfig.HOST}:${EnvConfig.PORT}/`);
});