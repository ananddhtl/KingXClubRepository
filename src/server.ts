import App from '@/app';
import AuthRoute from '@/modules/auth/auth.route';
import UserRoute from './modules/user/user.route';
import TicketRoute from './modules/ticket/ticket.route';
import ResultRoute from './modules/result/result.route';
import ActivityRoute from './modules/activity/activity.route';
import validateEnv from '@/utils/validateEnv';

validateEnv();

const app = new App([new AuthRoute(), new UserRoute(), new TicketRoute(), new ResultRoute(), new ActivityRoute()]);

app.listen();
