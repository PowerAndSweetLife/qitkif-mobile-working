import {configureStore} from '@reduxjs/toolkit';
import LoginReducer from './slices/login_slice';
import RegisterReducer from './slices/register_slice';
import LoggedReducer from './slices/logged_slice';
import AchatReducer from './slices/achat_slice';
import ScreenReducer from './slices/screen_slice';
import UnreadReducer from './slices/unread_slice';
import MessageReducer from './slices/message_slice';
import ConnectionReducer from './slices/connection_slice';

export const store = configureStore({
  reducer: {
    login: LoginReducer,
    register: RegisterReducer,
    logged: LoggedReducer,
    achat: AchatReducer,
    screen: ScreenReducer,
    unread: UnreadReducer,
    message: MessageReducer,
    connection: ConnectionReducer,
  },
});
