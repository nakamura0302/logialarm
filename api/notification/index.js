import * as  Notifications from 'expo-notifications';
import moment from 'moment';

export async function createNotificationChannel() {
    await Notifications.setNotificationChannelAsync('logi-alarm', {
      name: 'logi-alarm',
      importance: Notifications.AndroidImportance.HIGH,
      sound: 'basic.wav', 
      enableVibrate: true,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      vibrationPattern: [0, 500, 250, 500, 250, 500],
    }).then(res=>{
        return res;
    }).catch(err=>{
        console.log(err);
    });
}

export function sendNotification(alarm) {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await Notifications.scheduleNotificationAsync({
                content: {
                    title: alarm.summary?alarm.summary:'ラベルなし',
                    body:  alarm.day == 0 && moment(alarm.date, 'YYYY-MM-DD').format('YYYY年MM月DD日')  + ' ' + moment(alarm.time, 'HH:mm:ss').format('HH:mm'),
                    sound: 'basic.wav',
                    vibrate: alarm.vibrate ? [0, 500, 250, 500, 250, 500] : undefined,
                    autoDismiss: false,
                    // android: {
                    //     channelId: 'logi-alarm',
                    //     sound: alarm.sound,
                    //     audioContentType: Notifications.AndroidAudioContentType.media, // Specify audio content type
                    //   },
                },
                trigger: getTrigger(alarm),
                // trigger: {
                //     seconds: 5,
                //     channelId: 'logi-alarm'
                // },
                // android: {
                //     priority: Notifications.AndroidNotificationPriority.HIGH,
                //     sticky: true, // Make the notification sticky
                //   },
            });
            resolve(res); // Resolve the promise with the result
        } catch (err) {
            console.log('cannot send notification', err);
            reject(err); // Reject the promise with the error
        }
    });
}

function getTrigger(alarm) {
    if(alarm.day > 0){
        return {
            channelId: 'logi-alarm',
            weekday: alarm.day,
            hour: moment(alarm.time, 'HH:mm:ss').hour(),
            minute: moment(alarm.time, 'HH:mm:ss').minute(),
            repeats: true,
          };
    }else{
        if(alarm.day == -1){
            return{
                channelId: 'logi-alarm',
                hour: moment(alarm.time, 'HH:mm:ss').hour(),
                minute: moment(alarm.time, 'HH:mm:ss').minute(),
                repeats: true,
            };
        }else{
            const current = new Date(moment().format("YYYY-MM-DD") + 'T' + new Date().toLocaleTimeString() + '.000Z');
            const notiTime = new Date(alarm.date + 'T' + alarm.time + '.000Z');
            const timeDiff = (notiTime - current)/1000;
            console.log('Alarm will ring ', timeDiff, 's after');
            return {
                seconds: timeDiff,
                channelId: 'logi-alarm',
            }
        }
    }
  }

export function cancelNotification(identifier) {
    return new Promise(async (resolve, reject) => {
        try {
            let ids = JSON.parse(identifier);
            let length = ids.length;
            for(let i = 0; i < length; i++){
                let res = await Notifications.cancelScheduledNotificationAsync(ids[i]);
            }
            console.log('Notification Cancel Successful!');
            resolve("Notification Cancel Successful"); // Resolve the promise with the result
        } catch (err) {
            console.log(err);
            reject(err); // Reject the promise with the error
        }
    });
}

export async function cancelAllNotifications(){
    Notifications.cancelAllScheduledNotificationsAsync();
}

export async function deleteNotificationChannel(channel) {
    await Notifications.deleteNotificationChannelAsync(channel).then(res=>{
        return res;
    }).catch(err=>{
        console.log(err);
    });
  }

export async function listNotificationChannels() {
    Notifications.getNotificationChannelAsync().then(res=>{
        return res;
    }).catch(err=>{
        console.log(err);
    })
}

export async function updateNotificationChannel(channel) {
    await Notifications.setNotificationChannelAsync(channel, {
      name: 'Updated Channel Name',
      importance: Notifications.AndroidImportance.DEFAULT, // change importance
      sound: 'new-sound', // new sound
    });
}