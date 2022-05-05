import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DatePicker } from './date-picker';

const minDate = new Date();
minDate.setDate(minDate.getDate() - 500);

const maxDate = new Date();
maxDate.setDate(maxDate.getDate() + 15);

export const BasicDatePicker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  return (
    <View style={{ width: 250, height: 250, justifyContent: 'center' }}>
      <DatePicker
        onDateChange={(date) => setSelectedDate(date)}
        minDate={minDate}
        maxDate={maxDate}
        selectedDate={selectedDate}
      />
    </View>
  );
};

export const DatePickerWithHiddenHeader = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  return (
    <View style={{ width: 350, height: 350, justifyContent: 'center' }}>
      <DatePicker
        onDateChange={(date) => setSelectedDate(date)}
        minDate={minDate}
        maxDate={maxDate}
        selectedDate={selectedDate}
        hideHeader
      />
    </View>
  );
};

export const WithNextAndPreviousMonthsDaysHidden = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  return (
    <View style={{ width: 250, height: 250, justifyContent: 'center' }}>
      <DatePicker
        onDateChange={(date) => setSelectedDate(date)}
        minDate={minDate}
        maxDate={maxDate}
        selectedDate={selectedDate}
        hideDiffMonthDays
      />
    </View>
  );
};

export const WithCustomWeekDayNameStyle = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  return (
    <View style={{ width: 250, height: 250, justifyContent: 'center' }}>
      <DatePicker
        onDateChange={(date) => setSelectedDate(date)}
        minDate={minDate}
        maxDate={maxDate}
        selectedDate={selectedDate}
        hideDiffMonthDays
        weekDayStyle={{
          fontSize: 15,
          fontWeight: 'bold',
          color: '#f50057',
        }}
      />
    </View>
  );
};

export const WithCustomHeader = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const year = selectedDate.getFullYear();
  const month = selectedDate.toLocaleString('default', { month: 'long' });
  return (
    <View
      style={{
        width: 250,
        height: 300,
        justifyContent: 'center',
      }}
    >
      <View
        style={{
          height: '20%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          backgroundColor: 'red',
          alignItems: 'center',
          borderStyle: 'solid',
          borderColor: 'black',
          borderWidth: 1,
        }}
      >
        <TouchableOpacity
          style={{ width: 30 }}
          onPress={() =>
            setSelectedDate(
              new Date(selectedDate.setMonth(selectedDate.getMonth() - 1))
            )
          }
        >
          <Text
            style={{
              color: 'white',
              fontSize: 18,
              fontWeight: 'bold',
              marginLeft: 10,
            }}
          >
            {'<'}
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            color: 'white',
            fontSize: 18,
            fontWeight: 'bold',
            marginRight: 10,
          }}
        >
          {month} - {year}
        </Text>
        <TouchableOpacity
          style={{ width: 30 }}
          onPress={() =>
            setSelectedDate(
              new Date(selectedDate.setMonth(selectedDate.getMonth() + 1))
            )
          }
        >
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
            {'>'}
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          height: '80%',
          borderStyle: 'solid',
          borderColor: 'black',
          borderWidth: 1,
        }}
      >
        <DatePicker
          onDateChange={(date) => setSelectedDate(date)}
          minDate={minDate}
          maxDate={maxDate}
          selectedDate={selectedDate}
          hideDiffMonthDays
          hideHeader
          weekDayStyle={{ fontSize: 15, fontWeight: 'bold' }}
        />
      </View>
    </View>
  );
};
