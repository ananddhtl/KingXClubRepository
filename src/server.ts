import App from '@/app';
import AuthRoute from '@/modules/auth/auth.route';
import UserRoute from './modules/user/user.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([new AuthRoute(), new UserRoute()]);

app.listen();
