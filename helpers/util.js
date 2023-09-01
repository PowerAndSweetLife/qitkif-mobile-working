import axios from 'axios';
import {
  setUnreadMessage,
  setUnreadNotification,
} from '../store/slices/unread_slice';
import {api_url} from './url';
import {store} from '../store/store';
import {colors} from './colors';
import moment from 'moment';
import {Appearance, PermissionsAndroid, Platform} from 'react-native';
import QTWebsocket from './websocket';

const colorScheme = Appearance.getColorScheme();

export const capitalize = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// export const state_offre = {
//   WAIT_VALIDATION: 0,
//   WAIT_VALIDATION_CONTRE: 1,
//   ACCEPTED: 2,
//   PAIEMENT: 3,
//   PREPARE_CMD: 4,
//   LIVRAISON: 5,
//   CANCEL: 6,
//   CLOSE: 7,
// };

export const state_offre = {
  WAIT_VALIDATION: 100,

  WAIT_VALIDATION_CONTRE: 110,

  ACCEPTED: 200,

  ACCEPTED_AND_PAY_ACTIVE: 250,

  PAY_ACTIVE: 300,

  PAY_SUCCESS: 310,

  PREPARATION: 400,

  LIVRAISON: 500,

  CLOSE_SUCCESS: 600,

  CLOSE_NOT_SUCCESS: 610,

  LITIGE: 700,
};

export function getUnreadMessage() {
  axios.get(api_url('messages/unreadCount')).then(res => {
    store.dispatch(setUnreadMessage(Number(res.data.count)));
  });
}
export function getUnreadNotification() {
  axios.get(api_url('notification/getUnread')).then(response => {
    store.dispatch(setUnreadNotification(response.data.count));
  });
}

export function getStars(profil) {
  const notes = profil.total_note;
  const avis = profil.nbre_avis;
  if (avis === 0) {
    return [
      {name: 'star-o', color: colors.gray, id: 0},
      {name: 'star-o', color: colors.gray, id: 1},
      {name: 'star-o', color: colors.gray, id: 2},
      {name: 'star-o', color: colors.gray, id: 3},
      {name: 'star-o', color: colors.gray, id: 4},
    ];
  }
  const moyenne = notes / avis;
  const min = Math.floor(moyenne);
  const max = Math.round(moyenne);
  let icons = [];
  for (let i = 0; i < 5; i++) {
    if (i < min) {
      icons.push({name: 'star', color: colors.gold, id: i});
    } else {
      if (min !== max) {
        icons.push({name: 'star-half-full', color: colors.gold, id: i});
      } else {
        icons.push({name: 'star-o', color: colors.gray, id: i});
      }
    }
  }
  return icons;
}

export const axiosConfig = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  },
};

export const shortDate = date => {
  return moment(date).format('DD/MM/YYYY');
};
export const longDate = date => {
  return (
    moment(date).format('DD/MM/YYYY') + ' à ' + moment(date).format('HH:mm')
  );
};
export const price = amount => {
  let x = '0';
  if (amount) {
    x = amount.toString();
  }
  const pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x)) {
    x = x.replace(pattern, '$1 $2');
  }
  return x;
};

export const requestPermission = {
  camera: async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true;
    }
  },
  externalStorage: async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
      }
      return false;
    } else {
      return true;
    }
  },
};

export const CODE_PAYS = '+225';

export const headearNavigation = title => {
  return {
    title: title,
    headerStyle: {
      backgroundColor: colorScheme === 'dark' ? colors.dark : colors.light,
    },
    headerTintColor: colorScheme === 'dark' ? colors.light : colors.dark,
  };
};

export function sendNotification(idUser) {
  const conn = QTWebsocket.getInstance();
  conn.send(
    JSON.stringify({
      userId: store.getState().logged.id,
      to: idUser,
      type: 'notification',
    }),
  );
}
