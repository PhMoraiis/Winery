import express from 'express';
import { AppDataSource } from "./data-source";
import { routes } from './routes';

const app = express();

AppDataSource.initialize().then(async () => {

  app.use(express.json());

  app.use(routes)

  
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

}).catch(error => console.log(error))
