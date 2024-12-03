import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Switch, Image, ToastAndroid } from 'react-native';
import { colors } from '../util/color-options';
import { Database } from '../../api/Database';
import { sendNotification, cancelNotification } from '../../api/notification';
import moment from 'moment';

const AlarmList = (props) => {
  
  const [alarms, setAlarms] = useState([]);

  useEffect(() => {
    const newAlarms = props.alarms.map((alarm) => ({
      ...alarm,
      checked: alarm.checked ?? false,
      isActived: alarm.isActive?true:false
    }));
    
    setAlarms(newAlarms);
  }, [props.alarms]);

  const toggleChecked = (id) => {
    setAlarms((prevAlarms) =>
      prevAlarms.map((alarm) =>
        alarm.id === id ? { ...alarm, checked: !alarm.checked } : alarm
      )
    );
  };

  const handleLongPress = (id) => {
    props.setIsSelecting(true);
    setAlarms((prevAlarms) =>
      prevAlarms.map((alarm) => alarm.id == id ? { ...alarm, checked: true } : alarm)
    );
  };

  const selectAll = () => {
    setAlarms((prevAlarms) =>
      prevAlarms.map((alarm) => ({ ...alarm, checked: true }))
    );
  };

  const unSelectAll = () => {
    setAlarms((prevAlarms) =>
      prevAlarms.map((alarm) => ({ ...alarm, checked: false }))
    );
  };

  const deleteSelected = async () => {
    try {
        const deletionPromises = alarms.map(async (alarm) => {
            if (alarm.checked) {
                try {
                    if(alarm.identifier) cancelNotification(alarm.identifier)
                    await Database.remove(alarm.id);
                    return null; // Indicate deletion
                } catch (error) {
                    ToastAndroid.show(`${alarm.summary}を削除できません。`);
                    return alarm; // Return the alarm if deletion fails
                }
            } else {
                return alarm; // Keep the alarm if not checked
            }
        });

        // Wait for all deletions to complete
        const results = await Promise.all(deletionPromises);

        // Filter out null values (deleted alarms)
        const newAlarms = results.filter(alarm => alarm !== null);

        setAlarms(newAlarms);
    } catch (error) {
        console.error('Error removing selected alarms:', error);
    } finally {
        props.setIsSelecting(false);
    }
};

    const toggleActive = async (item, e) => {
      let updatedAlarms = [];
      for(const alarm of alarms) {
          if(alarm.id == item.id){
            if (e) {
              let ids = [];
              const frequency = JSON.parse(alarm.frequence);
              for(const item of frequency){
                const id = await sendNotification({date:item.date, time:item.time, sound: JSON.parse(item.sound).value, vibrate:item.vibrate, day:JSON.parse(item.frequence).value[i] , summary: item.summary});
                ids.push(id);
              }
              const identifier = JSON.stringify(ids);
              Database.update(alarm.id, item.date, item.time, item.sound, item.frequence, item.vibrate, item.audtoDelete, item.summary, e?1:0, identifier);
              updatedAlarms.push({ ...alarm, isActived: e, identifier});
            } else {
              if(alarm.identifier) cancelNotification(alarm.identifier);
              Database.update(alarm.id, alarm.date, alarm.time, alarm.sound, alarm.frequence, alarm.vibrate, alarm.audtoDelete, alarm.summary, e?1:0, '');
              updatedAlarms.push({ ...alarm, isActived: e, identifier: ''});
            }
          }else{
            updatedAlarms.push(alarm);
          }
      }

      setAlarms(updatedAlarms);
    };
    
    const toggleSelectAll = () => {
        alarms[0].checked?unSelectAll():selectAll();
    }

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onLongPress={()=>{handleLongPress(item.id)}}
      onPress={() => {props.isSelecting?toggleChecked(item.id):props.editAlarm(item)}}
    >
        <View style={[theme.item,]}>
            <View style={theme.section5}>
                <Text style={theme.time}>{JSON.parse(item.frequence).label == '1回のみ' && moment(item.date, 'YYYY-MM-DD').format('YYYY年MM月DD日   ')}{`${ moment(item.time, 'HH:mm:ss').format('HH:mm')}`}</Text>
                <Text style={theme.summary}>{item.summary?item.summary:'ラベルなし'}</Text>
            </View>
            <View style={theme.section1}>
                {
                    props.isSelecting? (
                        item.checked?(<Image style={theme.image} source={require('../../assets/checked.png')} />)
                        :(<Image style={theme.image} source={require('../../assets/unchecked.png')} />)
                    )
                    :(<Switch 
                        style={theme.switch} 
                        trackColor={{ false: colors.gray, true: colors.darkgray }} 
                        thumbColor={item.isActived ? colors.blue : colors.darkgray} 
                        onValueChange={(e)=>{toggleActive(item, e)}}
                        value={item.isActived}
                    />)
                }
            </View>
        </View>
    </TouchableOpacity>
  );

  return (
    <View style={theme.container}>
        {props.isSelecting && (
            <View style={[theme.header, {}]}>
                <TouchableOpacity style={[theme.button, {}]} onPress={()=>{unSelectAll(); props.setIsSelecting(false);}}>
                    <Image style={theme.image} source={require('../../assets/multiply.png')} />
                </TouchableOpacity>
                <TouchableOpacity style={theme.button} onPress={()=>{toggleSelectAll()}}>
                    <Image style={theme.image} source={require('../../assets/selectall.png')} />
                </TouchableOpacity>
            </View>
        )}
        <FlatList
            data={alarms}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
        />
        {props.isSelecting && (
            <View style={theme.footer}>
                <TouchableOpacity style={theme.button} onPress={()=>{deleteSelected()}}>
                    <Image Image style={theme.image} source={require('../../assets/delete.png')} />
                </TouchableOpacity>
            </View>
        )}
        
    </View>
  );
};

const theme = StyleSheet.create({
  container: {
    flex: 1,
    paddingRight: 5,
    paddingLeft: 5,
  },
  item: {
    flexDirection: 'row',
    height: 100,
    width: '98%',
    padding: 20,
    alignSelf: 'center',
    marginVertical: 5,
    borderRadius: 20,
    backgroundColor: colors.white,
  },
  section1:{
    flex: 1,
    justifyContent: 'center'
  },
  section5:{
    flex: 5,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  time: {
    fontSize: 16,
  },
  summary:{
    fontSize:14,
    color: colors.darkgray,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  header:{
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  button:{
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  switch:{

  },
  image:{
      width: 30,
      height: 30
  }
});

export default AlarmList;
