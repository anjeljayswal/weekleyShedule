import React, { useState, useEffect } from 'react';

import scheduleData from './scheduleDate.json'

function Assignment() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTimezone, setSelectedTimezone] = useState('UTC');
  const [weeklySchedule, setWeeklySchedule] = useState([]);

  useEffect(() => {
    // Simulate fetching data from JSON file
    setWeeklySchedule(scheduleData);
  }, []);
  const handleCheckboxChange = (day, time) => {
    // Find the index of the checkbox in the weeklySchedule array
    const index = weeklySchedule.findIndex(item => item.Date === currentDate.toISOString().split('T')[0] && item.Time === time);

    // If the checkbox is found, toggle its state
    if (index !== -1) {
      const updatedSchedule = [...weeklySchedule];
      updatedSchedule[index] = { ...updatedSchedule[index], isChecked: !updatedSchedule[index].isChecked };
      setWeeklySchedule(updatedSchedule);
    } else {
      // If the time doesn't exist in the schedule, add it with isChecked set to true
      setWeeklySchedule(prevSchedule => [
        ...prevSchedule,
        { Date: currentDate.toISOString().split('T')[0], Time: time, isChecked: true }
      ]);
    }
  };


  const handlePreviousWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 7);
    setCurrentDate(newDate);

    // Fetch the schedule for the next week
    const nextWeekStartDate = new Date(newDate);
    const nextWeekEndDate = new Date(newDate);
    nextWeekEndDate.setDate(nextWeekEndDate.getDate() + 6); // Next week ends 6 days after the start date

    // Filter the schedule data for the next week
    const nextWeekSchedule = scheduleData.filter(item => {
      const itemDate = new Date(item.Date);
      return itemDate >= nextWeekStartDate && itemDate <= nextWeekEndDate;
    });

    // Update the weekly schedule state with the schedule for the next week
    setWeeklySchedule(nextWeekSchedule);
  };
  const handleDateChange = (event) => {
    setCurrentDate(new Date(event.target.value));
  };
  const handleTimezoneChange = (event) => {
    setSelectedTimezone(event.target.value);
  };

  const loadWeeklySchedule = () => {
    console.log("Loaded Schedule:");
    weeklySchedule.forEach(item => {
      const date = new Date(item.Date);
      const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
      console.log(`Date: ${item.Date}, Day: ${day}, Time: ${item.Time}`);
    });
  };
  const renderWeeklySchedule = () => {
    const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Stayrday'];
    const startTime = 8;
    const endTime = 23;

    const renderCheckboxesForRow = (day) => {
      const currentDayIndex = weekdays.indexOf(day);
      const currentHour = new Date().getHours();

      // Filter the weekly schedule for the current day
      const daySchedule = weeklySchedule.filter(item => {
        const itemDate = new Date(item.Date);
        return itemDate.getDay() === currentDayIndex && item.Date === currentDate.toISOString().split('T')[0];

      });



      return [...Array(endTime - startTime + 1)].map((_, index) => {
        const hour = startTime + index;
        const timeString = `${hour}:00`;
        const checkboxId = `${day}-${timeString}`;
        let isChecked = false;

        // Check if the current hour exists in the day's schedule
        const scheduledTime = daySchedule.find(item => item.Time === timeString);

        if (scheduledTime) {
          isChecked = true;
        }
        return (
          <td key={timeString}>
            <input type="checkbox" id={checkboxId} checked={isChecked} onChange={() => handleCheckboxChange(day, timeString)} />
            <label htmlFor={checkboxId}>{timeString}</label>
          </td>
        );

      });
    };


    const renderDayRow = (day) => {
      return (
        <tr key={day}>
          <td>{day}</td>
          {renderCheckboxesForRow(day)}
        </tr>
      );
    };

    const renderHeaderRow = () => {
      return (
        <tr>
          <th>Day</th>
          {[...Array(endTime - startTime + 1)].map((_, index) => {
            const hour = startTime + index;
            const timeString = `${hour}:00`;
            return <th key={timeString}>{timeString}</th>;
          })}
        </tr>
      );
    };
    return (
      <div className='table-container'>
        <table >
          <thead>{renderHeaderRow()}</thead>
          <tbody>{weekdays.map((day) => renderDayRow(day))}</tbody>
        </table>
      </div>
    );
  };
  return (
    <div className="App">
      <h1>Weekly Scheduler</h1>
      <div>
        <div className='navigation'>
          <button onClick={handlePreviousWeek}>Previous Week</button>
          <input type="date" value={currentDate.toISOString().split('T')[0]} onChange={handleDateChange} />
          <button onClick={handleNextWeek}>Next Week</button>
        </div>
        <div className='timezone'>
          <h3>Timezone</h3>

          <select value={selectedTimezone} onChange={handleTimezoneChange}>
            <option value="UTC">UTC</option>
            <option value="UTC+1">UTC+1</option>

          </select>
        </div>

      </div>
      <div id="schedule">
        {renderWeeklySchedule()}
      </div>
      <button onClick={loadWeeklySchedule}>Load Schedule</button>
    </div>
  );
}

export default Assignment;
