import { TimeSlot } from '../types';

// Base time slots template
const baseTimeSlots: Omit<TimeSlot, 'available' | 'isAvailable'>[] = [
  { id: 'morning-1', time: '09:00 - 10:00', period: 'Morning', total: 10 },
  { id: 'morning-2', time: '10:00 - 11:00', period: 'Morning', total: 10 },
  { id: 'morning-3', time: '11:00 - 12:00', period: 'Morning', total: 10 },
  { id: 'afternoon-1', time: '13:00 - 14:00', period: 'Afternoon', total: 10 },
  { id: 'afternoon-2', time: '14:00 - 15:00', period: 'Afternoon', total: 10 },
  { id: 'afternoon-3', time: '15:00 - 16:00', period: 'Afternoon', total: 10 },
  { id: 'evening-1', time: '16:00 - 17:00', period: 'Evening', total: 10 },
  { id: 'evening-2', time: '17:00 - 18:00', period: 'Evening', total: 10 }
];

// Generate availability based on date
export function generateTimeSlotsForDate(dateString: string): TimeSlot[] {
  const date = new Date(dateString);
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  return baseTimeSlots.map((slot, index) => {
    // Use date and slot index to generate consistent but varied availability
    const seed = dayOfYear * 100 + index;
    const random = Math.sin(seed) * 10000;
    const normalizedRandom = Math.abs(random - Math.floor(random));
    
    // Generate availability between 0-10
    const available = Math.floor(normalizedRandom * 11);
    
    return {
      ...slot,
      available,
      isAvailable: available > 0
    };
  });
}