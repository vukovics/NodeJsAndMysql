import { Router } from 'express';
import * as TestController from './controllers/TestController';
import * as AuthController from './controllers/AuthController';
import * as DashboardController from './controllers/DashboardController';
import * as jwtCheck from './middlewares/jwtCheck';

const routes = Router();

/**
 * GET home page
 */
routes.get('/', (req, res) => {
  res.send({ title: 'Express Babel with JWT' });
});

routes.get('/test', TestController.getTest);

//AUTH
routes.post('/register', AuthController.register);
routes.post('/login', AuthController.login);
routes.get('/dashboard', jwtCheck.guard, DashboardController.index);


export default routes;
