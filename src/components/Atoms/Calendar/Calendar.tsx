import React from 'react';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import DatePicker from 'react-date-picker';

import styles from './Calendar.module.sass';
import type { LooseValue } from 'node_modules/react-date-picker/dist/esm/shared/types';

interface CalendarProps {
  onChange: (value: LooseValue | undefined) => void;
  value: LooseValue | undefined;
  isRange?: boolean;
  className?: string;
  maxDate?: Date;
}

const Calendar: React.FC<CalendarProps> = ({
  onChange,
  value,
  isRange = true,
  maxDate,
  ...rest
}) => {
  return (
    <div className={styles.Calendar}>
      {isRange ? (
        <DateRangePicker
          onChange={onChange}
          value={value}
          locale='es-CO'
          className={styles.dateRangePicker}
          maxDate={maxDate}
          {...rest}
        />
      ) : (
        <DatePicker
          onChange={onChange}
          value={value}
          locale='es-CO'
          className={styles.dateRangePicker}
          maxDate={maxDate}
          {...rest}
        />
      )}
    </div>
  );
};

export default Calendar;
