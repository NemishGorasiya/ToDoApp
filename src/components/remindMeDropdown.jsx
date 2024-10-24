import React from 'react';
import {Dropdown} from 'react-native-element-dropdown';

import TimerIcon from '../assets/icons/timer.svg';
import ForwardIcon from '../assets/icons/forward.svg';
import ArrowRightIcon from '../assets/icons/arrowRightCircle.svg';
import ClockIcon from '../assets/icons/clock.svg';
import {Text, View} from 'react-native';
import {formatRelative} from 'date-fns';

const RemindMeDropdown = ({onChange, notifyAtTime = null}) => {
  const formattedNotifyAtTime = notifyAtTime
    ? formatRelative(notifyAtTime, new Date())
    : '';
  return (
    <Dropdown
      placeholder={
        notifyAtTime ? `Notify me ${formattedNotifyAtTime}` : 'Remind me'
      }
      placeholderStyle={{color: '#AFAFAF'}}
      containerStyle={{
        backgroundColor: '#2c2c2c',
        borderWidth: 0,
      }}
      labelField="label"
      valueField="value"
      style={{flex: 1}}
      onChange={onChange}
      renderItem={item => {
        return (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 8,
              gap: 8,
              backgroundColor: '#2c2c2c',
            }}>
            {item.icon && <item.icon height={24} width={24} color="#AFAFAF" />}
            <Text
              style={{
                color: '#AFAFAF',
              }}>
              {item.label}
            </Text>
          </View>
        );
      }}
      data={[
        {
          label: 'Later today at 8:00 PM',
          value: 'laterTodayEvening',
          icon: ClockIcon,
        },
        {
          label: 'Tomorrow at 9:00 AM',
          value: 'tomorrowMorning',
          icon: ArrowRightIcon,
        },
        {
          label: 'Next week sunday at 9:00 AM',
          value: 'onNextSunday',
          icon: ForwardIcon,
        },
        {
          label: 'Pick a date & time',
          value: 'pickDateAndTime',
          icon: TimerIcon,
        },
      ]}
    />
  );
};

export default RemindMeDropdown;
