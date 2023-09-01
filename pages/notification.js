import {Button, View} from 'react-native';
import notifee, {EventType} from '@notifee/react-native';
import React, {Component} from 'react';
import messaging from '@react-native-firebase/messaging';

export default class Notification extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View>
        <Button
          title="Display Notification"
          onPress={() => this.onDisplayNotification()}
        />
      </View>
    );
  }
  componentDidMount() {
    notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          break;
      }
    });

    //this.getToken();

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', remoteMessage);
      this.displayNotification(remoteMessage.notification);
    });

    return unsubscribe;
  }
  async getToken() {
    // Register the device with FCM
    await messaging().registerDeviceForRemoteMessages();

    // Get the token
    const token = await messaging().getToken();

    console.log(token);
  }

  // async displayNotification(notification) {
  //   // Request permissions (required for iOS)
  //   await notifee.requestPermission();

  //   // Create a channel (required for Android)
  //   const channelId = await notifee.createChannel({
  //     id: Date.now().toString(),
  //     name: 'qitkif',
  //   });

  //   // Display a notification
  //   try {
  //     await notifee.displayNotification({
  //       title: notification.title,
  //       body: notification.body,
  //       android: {
  //         channelId,
  //         smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
  //         // pressAction is needed if you want the notification to open the app when pressed
  //         pressAction: {
  //           id: 'default',
  //         },
  //       },
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }
  async onDisplayNotification() {
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
        title: 'Notification Title',
        body: 'Main body content of the notification',
        android: {
          channelId,
          smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
          // pressAction is needed if you want the notification to open the app when pressed
          pressAction: {
            id: 'default',
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  }
}
