/**

import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import Slot from '../models/Slot'; // Adjust the path as needed
import Room from '../models/Room'; // Adjust the path as needed

const router = express.Router();

// Utility function to convert time to minutes since midnight
const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Utility function to convert minutes since midnight to time
const minutesToTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

// Create Slot Route
router.post('/api/slots', async (req: Request, res: Response) => {
  const { room, date, startTime, endTime } = req.body;

  // Validate Request
  if (!room || !date || !startTime || !endTime) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  // Validate Time Format
  if (!/^\d{2}:\d{2}$/.test(startTime) || !/^\d{2}:\d{2}$/.test(endTime)) {
    return res.status(400).json({ success: false, message: 'Invalid time format. Use HH:MM' });
  }

  // Convert Times to Minutes
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);

  if (startMinutes >= endMinutes) {
    return res.status(400).json({ success: false, message: 'End time must be after start time' });
  }

  // Slot Duration
  const slotDuration = 60; // minutes

  // Calculate Total Duration and Number of Slots
  const totalDuration = endMinutes - startMinutes;
  const numberOfSlots = Math.floor(totalDuration / slotDuration);

  if (numberOfSlots <= 0) {
    return res.status(400).json({ success: false, message: 'Duration is too short to create slots' });
  }

  try {
    // Check if Room Exists
    const roomExists = await Room.findById(room);
    if (!roomExists) {
      return res.status(404).json({ success: false, message: 'Room not found' });
    }

    // Check for Existing Slots in Database
    const existingSlots = await Slot.find({
      room,
      date,
      $or: [
        { $and: [{ startTime: { $lt: endTime } }, { endTime: { $gt: startTime } }] }
      ]
    });

    if (existingSlots.length > 0) {
      return res.status(409).json({ success: false, message: 'Overlapping slots detected' });
    }

    // Generate Slots
    const slots = [];
    for (let i = 0; i < numberOfSlots; i++) {
      const slotStart = minutesToTime(startMinutes + i * slotDuration);
      const slotEnd = minutesToTime(startMinutes + (i + 1) * slotDuration);

      // Prevent creating slots that exceed the specified end time
      if (timeToMinutes(slotEnd) > endMinutes) break;

      // Additional Check: Prevent creating duplicate slots
      const existingSlot = await Slot.findOne({ room, date, startTime: slotStart, endTime: slotEnd });
      if (existingSlot) {
        return res.status(409).json({ success: false, message: `Slot from ${slotStart} to ${slotEnd} already exists` });
      }

      const newSlot = new Slot({
        room,
        date,
        startTime: slotStart,
        endTime: slotEnd,
        isBooked: false
      });

      await newSlot.save();
      slots.push(newSlot);
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: 'Slots created successfully',
      data: slots
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

export default router;

 */
