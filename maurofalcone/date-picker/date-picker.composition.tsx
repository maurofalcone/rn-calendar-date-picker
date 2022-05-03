import React, { useState } from 'react';
import { View } from 'react-native';
import { DatePicker } from './date-picker';
const minDate = new Date();
minDate.setDate(minDate.getDate() - 500);
const maxDate = new Date();
maxDate.setDate(maxDate.getDate() - 1);

export const BasicDatePicker = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  return (
    <View style={{ width: 250, height: 250 }}>
      <DatePicker
        onDateChange={setSelectedDate}
        minDate={minDate}
        maxDate={maxDate}
        selectedDate={selectedDate}
        hideDiffMonthDays={false}
        hideHeader
      />
    </View>
  );
};
