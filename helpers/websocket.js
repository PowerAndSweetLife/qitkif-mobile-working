import {api_url, ws_url} from './url';
import {store} from '../store/store';
import {setSocket} from '../store/slices/connection_slice';
import {getUnreadMessage, getUnreadNotification} from './util';
import axios from 'axios';
import {pushContent} from '../store/slices/message_slice';

export default class QTWebsocket {
  static socket = null;
  static getInstance() {
    if (!this.socket) {
      this.socket = new WebSocket(ws_url());
      console.log('new instance socket...');
    }
    return this.socket;
  }
  static initialize() {
    const ws = QTWebsocket.getInstance();
    ws.onopen = e => {
      store.dispatch(setSocket(true));
      const msg = {
        type: 'register',
        userId: store.getState().logged.id,
      };
      ws.send(JSON.stringify(msg));
    };
    ws.onmessage = e => {
      const data = JSON.parse(e.data);
      if (data.type === 'message') {
        if (
          store.getState().screen.message &&
          store.getState().screen.message_service_id === Number(data.idService)
        ) {
          QTWebsocket.getReceivedMessage(data);
        }
        getUnreadMessage();
      } else {
        getUnreadNotification();
      }
    };

    ws.onclose = () => {
      store.dispatch(setSocket(null));
    };

    ws.onerror = () => {
      store.dispatch(setSocket(null));
    };
  }

  static getReceivedMessage(data) {
    axios.get(api_url('messages/getLast/' + data.idService)).then(res => {
      store.dispatch(pushContent(res.data));
    });
  }
}
