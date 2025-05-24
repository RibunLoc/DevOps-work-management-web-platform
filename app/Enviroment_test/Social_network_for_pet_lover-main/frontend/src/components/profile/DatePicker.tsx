import React, { useState } from 'react'
import DateTimePicker from 'react-datetime-picker'
import './css/DateTimePicker.module.css'

function DatePicker() {
    const [value,setValue] = useState<Date|null>(new Date());
  return (
    <div className="date-picker-container">
      <DateTimePicker onChange={setValue} value={value}  format="dd/MM/yyyy"  className="custom-datetime-picker"/>
    </div>
  )
}

export default DatePicker
