import { asyncHandler } from '../middleware/asyncHandler.js';
import { getAvailability, replaceAvailability } from '../models/availabilityModel.js';
import { getDefaultUser } from '../models/userModel.js';
import { validate, availabilitySchema } from '../utils/validate.js';

export const getAvailabilityHandler = asyncHandler(async (req, res) => {
  const availability = await getAvailability();
  const user = await getDefaultUser();
  res.json({
    timezone: user?.timezone || 'UTC',
    availability
  });
});

export const updateAvailabilityHandler = asyncHandler(async (req, res) => {
  const data = validate(availabilitySchema, req.body);
  await replaceAvailability(data);
  const availability = await getAvailability();
  res.json({ timezone: data.timezone, availability });
});
