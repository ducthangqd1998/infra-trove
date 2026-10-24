import { CronExpressionParser } from 'cron-parser';
import cronstrue from 'cronstrue';
import { checkSize } from '../../lib/input';
export function previewCron(
  expression: string,
  timezone: string,
  currentDate = new Date(),
) {
  checkSize(expression, 100);
  const fields = expression.trim().split(/\s+/);
  if (
    fields.length !== 5 ||
    fields.some((field) => !/^[\d*,/\-]+$/.test(field))
  )
    throw new Error(
      'Enter five numeric Unix cron fields. Seconds, macros and special dialect syntax are not supported.',
    );
  const interval = CronExpressionParser.parse(expression, {
    tz: timezone,
    currentDate,
  });
  const description = cronstrue.toString(expression, {
    throwExceptionOnParseError: true,
  });
  return {
    description,
    dates: Array.from({ length: 5 }, () =>
      interval.next().toDate().toISOString(),
    ),
  };
}

/** Index (0-4) of the cron field that contains the caret. */
export function fieldAt(expression: string, caret: number) {
  const index = expression.slice(0, caret).trimStart().split(/\s+/).length - 1;
  return Math.min(Math.max(index, 0), 4);
}
