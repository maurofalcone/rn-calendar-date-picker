import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  InteractionManager,
} from 'react-native';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const missingDates = {
  Sun: {
    pastDates: 0,
    nextDates: 6,
  },
  Mon: {
    pastDates: 1,
    nextDates: 5,
  },
  Tue: {
    pastDates: 2,
    nextDates: 4,
  },
  Wed: {
    pastDates: 3,
    nextDates: 3,
  },
  Thu: {
    pastDates: 4,
    nextDates: 2,
  },
  Fri: {
    pastDates: 5,
    nextDates: 1,
  },
  Sat: {
    pastDates: 6,
    nextDates: 0,
  },
};

const now = new Date();

export type DatePickerProps = {
  /**
   * a text to be rendered in the component.
   */
  text: string;
  monthIndex: number;
  year: number;
  maxDate: Date;
  minDate: Date;
  selectedDate: Date;
  onDayPress: (selectedDate: Date) => void;
  hideDiffMonthDays?: boolean;
};

const getDaysInMonth = (year, monthIdx, minDate, maxDate) => {
  const date = new Date(year, monthIdx, 1);
  const days = [];
  while (date.getMonth() === monthIdx) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  const daysInCurrentMonth = days;
  const firstDayOfMonth = new Date(year, monthIdx, 1);

  const firstDayOfMonthDay = weekDays[firstDayOfMonth.getDay()];

  const previousDates = [];
  if (missingDates[firstDayOfMonthDay]) {
    for (let i = 1; i < missingDates[firstDayOfMonthDay].pastDates + 1; i++) {
      const x = new Date(year, monthIdx, 1);
      x.setDate(x.getDate() - i);
      previousDates.push(new Date(x));
    }
  }

  const lastDay = new Date(year, monthIdx + 1, 0);

  const lastDayName = weekDays[lastDay.getDay()];
  const futureDates = [];
  if (missingDates[lastDayName]) {
    for (let i = 1; i < missingDates[lastDayName].nextDates + 1; i++) {
      const x = new Date(year, monthIdx + 1, 0);
      x.setDate(x.getDate() + i);
      futureDates.push(new Date(x));
    }
  }

  const result = [...previousDates, ...daysInCurrentMonth, ...futureDates];
  const mappedDates = result.reduce((acc, date) => {
    const disabled = isDisabled(date, minDate, maxDate);
    const isToday = date.toDateString() === now.toDateString();
    const isSameMonth = date.getMonth() === monthIdx;
    acc[weekDays[date.getDay()]]
      ? acc[weekDays[date.getDay()]].push({
          date,
          disabled,
          isToday,
          isSameMonth,
        })
      : (acc[weekDays[date.getDay()]] = [
          { date, disabled, isToday, isSameMonth },
        ]);
    return acc;
  }, {});
  return mappedDates;
};

const getDayStyle = (isDisabled, isSelected, isToday, isSameMonth) => {
  return {
    width: 30,
    height: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: isSelected ? 'green' : 'transparent',
    borderColor: isToday ? (isDisabled ? 'gray' : 'green') : 'transparent',
    borderRadius: 100,
    borderWidth: 1,
  };
};

const getDayContainerStyle = (isSelected, isSameMonth) => {
  return {
    width: '100%',
    backgroundColor: !isSameMonth ? '#808080' : 'transparent',
    // borderRadius: !isSameMonth ? 0 : 100,
  };
};

const getDayFontStyle = (isDisabled, isSelected, isToday, isSameMonth) => {
  let color = 'black';
  if (isSelected) {
    color = 'white';
  }
  if (isDisabled) {
    color = 'gray';
  }
  if (!isSelected && !isDisabled && isToday && isSameMonth) {
    color = 'green';
  }
  if (!isSameMonth) {
    color = '#AAAAAA';
  }
  return {
    color,
  };
};

const isDisabled = (date: Date, minDate: Date, maxDate: Date) => {
  return (
    date.getTime() > maxDate.getTime() || date.getTime() < minDate.getTime()
  );
};

export const DatePicker = ({
  monthIndex,
  year,
  maxDate,
  minDate,
  selectedDate,
  onDayPress,
  hideDiffMonthDays = false,
}) => {
  const [mappedDatesByDayName, setMappedDatesByDayName] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(() => true);
    InteractionManager.runAfterInteractions(() => {
      const result = getDaysInMonth(year, monthIndex, minDate, maxDate);
      setMappedDatesByDayName(() => result);
      setIsLoading(() => false);
    });
  }, [year, monthIndex, maxDate, minDate]);
  if (isLoading) {
    return (
      <View
        style={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text>Loading...</Text>
      </View>
    );
  } else {
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}
        >
          {weekDays.map((wd) => (
            <View
              key={wd}
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                flex: 1,
              }}
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '10%',
                }}
              >
                <Text>{wd}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'column',
                  justifyContent: 'space-around',
                  height: '90%',
                }}
              >
                {mappedDatesByDayName[wd]?.map(
                  ({ date, disabled, isSameMonth, isToday }) => {
                    const isSelected =
                      !isDisabled(selectedDate, minDate, maxDate) &&
                      selectedDate.toDateString() === date.toDateString();
                    return (
                      <View
                        key={date}
                        style={getDayContainerStyle(isSelected, isSameMonth)}
                      >
                        <TouchableOpacity
                          style={
                            getDayStyle(
                              disabled,
                              isSelected,
                              isToday,
                              isSameMonth
                            ) as any
                          }
                          onPress={() => !disabled && onDayPress(date)}
                          disabled={disabled || !isSameMonth}
                          hitSlop={{
                            top: 10,
                            left: 8,
                            right: 8,
                            bottom: 10,
                          }}
                        >
                          <Text
                            style={getDayFontStyle(
                              disabled,
                              isSelected,
                              isToday,
                              isSameMonth
                            )}
                          >
                            {!hideDiffMonthDays
                              ? date.getDate()
                              : isSameMonth
                              ? date.getDate()
                              : ''}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    );
                  }
                )}
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  text: {},
});
