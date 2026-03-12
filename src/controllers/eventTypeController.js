import { asyncHandler } from '../middleware/asyncHandler.js';
import {
  listEventTypes,
  createEventType,
  updateEventType,
  deleteEventType,
  getEventTypeById
} from '../models/eventTypeModel.js';
import { validate, eventTypeSchema } from '../utils/validate.js';

export const getEventTypes = asyncHandler(async (req, res) => {
  const eventTypes = await listEventTypes();
  res.json(eventTypes);
});

export const createEventTypeHandler = asyncHandler(async (req, res) => {
  const data = validate(eventTypeSchema, {
    name: req.body.name,
    durationMinutes: Number(req.body.durationMinutes),
    slug: req.body.slug
  });
  const created = await createEventType(data);
  res.status(201).json(created);
});

export const updateEventTypeHandler = asyncHandler(async (req, res) => {
  const data = validate(eventTypeSchema, {
    name: req.body.name,
    durationMinutes: Number(req.body.durationMinutes),
    slug: req.body.slug
  });
  const updated = await updateEventType(Number(req.params.id), data);
  res.json(updated);
});

export const deleteEventTypeHandler = asyncHandler(async (req, res) => {
  await deleteEventType(Number(req.params.id));
  res.status(204).send();
});

export const getEventTypeByIdHandler = asyncHandler(async (req, res) => {
  const eventType = await getEventTypeById(Number(req.params.id));
  if (!eventType) {
    res.status(404).json({ message: 'Event type not found' });
    return;
  }
  res.json(eventType);
});
