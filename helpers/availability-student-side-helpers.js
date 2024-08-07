const dayjs = require('../config/dayjs-config')
const { groupAvailabilityByDate } = require('./availability-teacher-side-helpers')

module.exports = {
  // merge overlapping times (e.g. 9:00 - 10:00 and 10:00 - 11:00)
  mergeOverlappingTimes: (times) => {
    times.sort((a, b) => a.startTime.localeCompare(b.startTime))
    const merged = []
    let current = times[0]

    for (let i = 1; i < times.length; i++) {
      const currentEnd = dayjs(`2000-01-01T${current.endTime}`)
      const nextStart = dayjs(`2000-01-01T${times[i].startTime}`)

      if (nextStart.isSameOrBefore(currentEnd)) {
        const nextEnd = dayjs(`2000-01-01T${times[i].endTime}`)
        current.endTime = currentEnd.isAfter(nextEnd) ? current.endTime : times[i].endTime
      } else {
        merged.push(current)
        current = times[i]
      }
    }
    merged.push(current)
    return merged
  },

  // generate slots according to teacher's lesson duration
  generateSlots: (start, end, lessonDuration) => {
    const slots = []
    let current = dayjs(`2000-01-01T${start}`)
    const endTime = dayjs(`2000-01-01T${end}`)

    while (current.isBefore(endTime)) {
      const slotEnd = current.add(lessonDuration, 'minute')
      if (slotEnd.isSameOrBefore(endTime)) {
        slots.push({
          start: current.format('HH:mm'),
          end: slotEnd.format('HH:mm')
        })
      }
      current = slotEnd
    }

    return slots
  },

  // Check if a slot is booked
  isSlotBooked: (slot, appointments) => {
    const slotStart = dayjs(`2000-01-01T${slot.start}`)
    const slotEnd = dayjs(`2000-01-01T${slot.end}`)
    return appointments.some(appointment => {
      const appointmentStart = dayjs(`2000-01-01T${appointment.startTime}`)
      const appointmentEnd = dayjs(`2000-01-01T${appointment.endTime}`)
      return (
        (slotStart.isSame(appointmentStart) && slotEnd.isSame(appointmentEnd))
      )
    })
  },

  // Process availabilities
  processAvailabilities: (availabilities, lessonDuration, appointments) => {
    const groupedByDate = groupAvailabilityByDate(availabilities)
    const groupedAppointments = groupAvailabilityByDate(appointments)

    const processedAvailability = {}
    let hasAvailableSlots = false // to check if there is any available slots

    for (const [date, times] of Object.entries(groupedByDate)) {
      const mergedTimes = module.exports.mergeOverlappingTimes(times)
      let allSlots = []

      mergedTimes.forEach(time => {
        const slots = module.exports.generateSlots(time.startTime, time.endTime, lessonDuration)
        const dateAppointments = groupedAppointments[date] || []
        const availableSlots = slots.filter(slot => !module.exports.isSlotBooked(slot, dateAppointments))
        allSlots = allSlots.concat(availableSlots)
      })

      // add key: date to value: all slots
      if (allSlots.length > 0) {
        processedAvailability[date] = allSlots
        hasAvailableSlots = true
      }
    }

    return { processedAvailability, hasAvailableSlots }
  }
}
