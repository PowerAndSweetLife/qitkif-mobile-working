import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
/**
 * Component login
 */
import Login1 from './pages/login_1';
import Login2 from './pages/login_2';
/**
 * component register
 */
import Register from './pages/register';
import Register2 from './pages/register_2';
import Register3 from './pages/register_3';
import Register4 from './pages/register_4';
/**
 * Page d'accueil
 */
import Welcome from './pages/welcome';
import Home from './pages/home';
/**
 * Page historique
 */
import Historique from './pages/historique';
/**
 * Page Offre en cours + detail
 */
import Encours from './pages/encours';
import EncoursDetail from './pages/encours_detail';
/**
 * Page promotion
 */
import Promotion from './pages/promotion';
import PromotionExterne from './pages/promotion_lien_externe';
/**
 * Page Service client
 */
import ServiceClient from './pages/service_client';
/**
 * Component activité offre: Vente/Achat
 */
import ChoixVendeur from './pages/achat/choix_vendeur';
import VendeurSelected from './pages/achat/vendeur_selected';
import QuestionAchat from './pages/achat/question_achat';
import Montant from './pages/achat/montant';
import CodeAchat from './pages/achat/code_achat';
import DetailAchat from './pages/achat/detail_achat';
/**
 * Page paiement:
 * ** Mode paiement
 * ** Ajout numero
 * ** Effectué une paiement
 */
import Add from './pages/paiement/add';
import Choix from './pages/paiement/choix';
import Confirmation from './pages/paiement/confirmation';
import Code from './pages/paiement/code';

/**
 * Page liste notifications
 */
import NotificationList from './pages/notification/listes';
import WaitValidation from './pages/notification/wait_validation';
import ActivePaiement from './pages/notification/active_paiement';
/**
 * Page action sur l'offre
 */
import ModificationOffre from './pages/modification_offre';

/**
 * Page preparation et mise en livraison de la commande
 */
import Validation from './pages/preparation_cmd/validation';
import Livraison from './pages/preparation_cmd/livraison';
import AttenteLivraison from './pages/preparation_cmd/attente_livraison';
import ConfirmColisRecu from './pages/preparation_cmd/confirm_colis_recu';

/**
 * Page litige/service_client
 */
import NewLitige from './pages/litige/new_litige';
import Messenger from './pages/litige/messenger';
import Assistance from './pages/litige/assistance';
import SelectOffre from './pages/litige/select_offre';

/**
 * Page confidentialité
 */
import Confidentialite from './pages/confidentialite';

/**
 * Page profil
 */
import Profil from './pages/paiement/main';
import Avis from './pages/avis';
import EditProfil from './pages/edit_profil';
import ChangeCode from './pages/change_code';
import Compte from './pages/compte';
import Retrait from './pages/retrait';

import notifee from '@notifee/react-native';

/**
 * Store
 */
import {Provider} from 'react-redux';
import {store} from './store/store';

import messaging from '@react-native-firebase/messaging';
import {headearNavigation} from './helpers/util';
import {AppState} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import QTWebsocket from './helpers/websocket';
import axios from 'axios';
import {api_url} from './helpers/url';
import {setSocket} from './store/slices/connection_slice';

import {setId, setPseudo} from './store/slices/logged_slice';

const Stack = createNativeStackNavigator();
class App extends Component {
  state = {
    appStateListener: null,
    connectionListener: null,
    appState: AppState.currentState,
  };
  componentDidMount() {
    this.appStateListener = AppState.addEventListener('change', nextState => {
      if (
        this.state.appState.match(/inactive|background/) &&
        nextState === 'active'
      ) {
        this.checkConnectionAndSession();
      }
      this.setState({appState: nextState});
    });
    this.connectionListener = NetInfo.addEventListener(state => {
      /**
       * Si la connexion est actif
       */
      if (state.isConnected) {
        /**
         * On verifie si on a accès à internet && la session
         */
        this.checkConnectionAndSession();
      } else {
        /**
         * TO DO on lance une alerte que la connexion n'est pas activé
         */
        store.dispatch(setSocket(null));
      }
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      this.displayNotification(remoteMessage.notification);
    });
    return unsubscribe;
  }

  /**
   * Verifie l'accès à internet et la session utilisateur
   */
  checkConnectionAndSession() {
    if (!store.getState().connection.socket) {
      axios
        .get(api_url('login/session'))
        .then(res => {
          if (res.data.active) {
            store.dispatch(setId(res.data.user.id));
            store.dispatch(setPseudo(res.data.user.pseudo));
            QTWebsocket.initialize();
          } else {
            // Reinitialiser l'application
            // if (store.getState().connection.mounted) {
            //   store.dispatch(setMounted(false));
            //   RNRestart.restart();
            // } else {
            //   store.dispatch(setMounted(true));
            // }
          }
        })
        .catch(err => {
          if (err.code === 'ERR_NETWORK') {
            store.dispatch(setSocket(null));
          }
        });
    }
  }

  async displayNotification(notification) {
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: Date.now().toString(),
      name: 'qitkif',
    });

    // Display a notification
    try {
      await notifee.displayNotification({
        title: notification.title,
        body: notification.body,
        android: {
          channelId,
          smallIcon: 'ic_launcher',
          pressAction: {
            id: 'default',
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
  render() {
    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Welcome">
            <Stack.Screen
              name="Welcome"
              component={Welcome}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Login1"
              component={Login1}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Login2"
              component={Login2}
              options={headearNavigation('Modifier le numéro')}
            />
            <Stack.Screen
              name="Register"
              component={Register}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Register2"
              component={Register2}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Register3"
              component={Register3}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Register4"
              component={Register4}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Home"
              component={Home}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Historique"
              component={Historique}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Encours"
              component={Encours}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="EncoursDetail"
              component={EncoursDetail}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Promotion"
              component={Promotion}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="PromotionExterne"
              component={PromotionExterne}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ServiceClient"
              component={ServiceClient}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ChoixVendeur"
              component={ChoixVendeur}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="VendeurSelected"
              component={VendeurSelected}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="QuestionAchat"
              component={QuestionAchat}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Montant"
              component={Montant}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="CodeAchat"
              component={CodeAchat}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="DetailAchat"
              component={DetailAchat}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="AddPaiement"
              component={Add}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ChoixPaiement"
              component={Choix}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ConfirmationPaiement"
              component={Confirmation}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="CodePaiement"
              component={Code}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="NotificationList"
              component={NotificationList}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="WaitValidation"
              component={WaitValidation}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ActivePaiement"
              component={ActivePaiement}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ModificationOffre"
              component={ModificationOffre}
              options={{headerShown: false}}
            />

            <Stack.Screen
              name="ValidationCommande"
              component={Validation}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="LivraisonCommande"
              component={Livraison}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="AttenteLivraison"
              component={AttenteLivraison}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ColisRecu"
              component={ConfirmColisRecu}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="NewLitige"
              component={NewLitige}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SelectOffre"
              component={SelectOffre}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Assistance"
              component={Assistance}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Messenger"
              component={Messenger}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Confidentialite"
              component={Confidentialite}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Profil"
              component={Profil}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="EditProfil"
              component={EditProfil}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Avis"
              component={Avis}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="ChangeCode"
              component={ChangeCode}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Compte"
              component={Compte}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Retrait"
              component={Retrait}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
  componentWillUnmount() {
    this.appStateListener.remove();
  }
}

export default App;
