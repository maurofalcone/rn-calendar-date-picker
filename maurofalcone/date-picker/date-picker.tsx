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

const isDisabled = (date: Date, minDate?: Date, maxDate?: Date) => {
  if (maxDate && !minDate) {
    return date.getTime() > maxDate.getTime();
  }
  if (minDate && !maxDate) {
    return date.getTime() < minDate.getTime();
  }
  if (maxDate && minDate) {
    return (
      date.getTime() > maxDate.getTime() || date.getTime() < minDate.getTime()
    );
  }
  return false;
};

const getDaysInMonth = (
  year: number,
  monthIdx: number,
  minDate?: Date,
  maxDate?: Date
): Record<
  string,
  {
    date: Date;
    disabled: boolean;
    isSameMonth: boolean;
    isToday: boolean;
  }[]
> => {
  const firstDayOfMonth = new Date(year, monthIdx, 1);
  const firstDayOfMonthDay = weekDays[firstDayOfMonth.getDay()];
  const lastDayOfMonth = new Date(year, monthIdx + 1, 0);
  const lastDayOfMonthDay = weekDays[lastDayOfMonth.getDay()];
  const currentMonthDaysQty = new Date(year, monthIdx + 1, 0).getDate();

  const daysToLoop =
    missingDates[firstDayOfMonthDay].pastDates +
    currentMonthDaysQty +
    missingDates[lastDayOfMonthDay].nextDates;

  const dates: Record<
    string,
    {
      date: Date;
      disabled: boolean;
      isSameMonth: boolean;
      isToday: boolean;
    }[]
  > = {
    Sun: [],
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
  };
  const date = new Date(year, monthIdx, 1);

  if (missingDates[firstDayOfMonthDay]) {
    date.setDate(
      date.getDate() - missingDates[firstDayOfMonthDay].pastDates - 1
    );
    for (let i = 1; i <= daysToLoop; i++) {
      const newDate = new Date(date.setDate(date.getDate() + 1));
      const disabled = isDisabled(newDate, minDate, maxDate);
      const isToday = newDate?.toDateString() === now.toDateString();
      const isSameMonth = newDate?.getMonth() === monthIdx;
      const obj: {
        date: Date;
        disabled: boolean;
        isSameMonth: boolean;
        isToday: boolean;
      } = {
        date: newDate,
        disabled,
        isToday,
        isSameMonth,
      };
      dates[weekDays[obj.date.getDay()]].push(obj);
    }
  }
  return dates;
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

export const DatePicker = ({
  maxDate,
  minDate,
  selectedDate,
  onDateChange,
  hideDiffMonthDays = false,
  hideHeader = false,
}: {
  maxDate?: Date;
  minDate?: Date;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  hideDiffMonthDays?: boolean;
  hideHeader?: boolean;
}) => {
  const [mappedDatesByDayName, setMappedDatesByDayName] = useState({
    Sun: [],
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
    Sat: [],
  });

  useEffect(() => {
    if (selectedDate) {
      const result = getDaysInMonth(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        minDate,
        maxDate
      );
      setMappedDatesByDayName(() => result);
    }
  }, [selectedDate, maxDate, minDate]);

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      {!hideHeader && (
        <View
          style={{
            height: '50px',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 10,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              onDateChange(
                new Date(selectedDate.setMonth(selectedDate.getMonth() - 1))
              )
            }
          >
            <Text>{'<'}</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>
              {selectedDate.toLocaleString('default', { month: 'long' })}{' '}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>{selectedDate.getFullYear()}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              onDateChange(
                new Date(selectedDate.setMonth(selectedDate.getMonth() + 1))
              )
            }
          >
            <Text>{'>'}</Text>
          </TouchableOpacity>
        </View>
      )}
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
                        onPress={() => !disabled && onDateChange(date)}
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
};

const styles = StyleSheet.create({
  text: {},
});
