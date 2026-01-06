import { z } from "zod/v4";

export const calendarQuerySchema = z.object({
  year: z.coerce.number().int().min(2020).max(2100),
  month: z.coerce.number().int().min(1).max(12),
});

export type CalendarQueryInput = z.infer<typeof calendarQuerySchema>;
