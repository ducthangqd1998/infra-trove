---
title: 'Read a five-field cron schedule without guessing'
description: 'A quick guide to minutes, hours, day fields and the timezone questions worth checking before a job goes live.'
category: 'Time & scheduling'
readingTime: '4 min read'
updated: '2026-10-24'
tool: 'cron-generator'
---

A conventional Unix cron expression has five fields: minute, hour, day of month, month and day of week. The expression describes a recurring wall-clock schedule. It does not, by itself, specify a timezone.

## Read from left to right

```text
minute  hour  day-of-month  month  day-of-week
*/5     *     *             *      *
```

An asterisk means every allowed value. `*/5` in the minute field selects minutes 0, 5, 10 and so on. It does not mean five minutes after the previous run finishes.

## Common examples

```text
*/5 * * * *     Every five minutes
0 0 * * *       Every day at midnight
0 9 * * 1-5     Weekdays at 09:00
0 0 1 * *       First day of each month at midnight
```

Ranges and comma-separated lists select multiple values. For example, `0 9,17 * * 1-5` selects 09:00 and 17:00 on weekdays.

## Check both day fields

Traditional Unix cron treats restricted day-of-month and day-of-week fields with OR semantics. A schedule such as `0 9 1 * 1` can run at 09:00 on the first day of a month **and** on Mondays. It does not necessarily mean the first Monday. Scheduler dialects differ, so check the actual system you deploy to.

## Timezones and daylight saving matter

A 09:00 job runs according to the scheduler's configured timezone. A local wall-clock time can be skipped or repeated at a daylight saving transition. The policy for those cases belongs to the scheduler. A preview helps inspect behavior, but does not replace a check against your production scheduler.

InfraTrove lets you preview the next five runs in UTC or your browser timezone. UTC avoids daylight saving changes, but the corresponding local time can move seasonally.

## Do not mix dialects

Some systems add a seconds field, year field or special characters. A six-field Quartz expression is not a five-field Unix expression. InfraTrove's current tool accepts numeric five-field syntax only and rejects unsupported forms.

Open the [Cron Generator](/tools/cron-generator/) to try the examples, or use the [Timestamp Converter](/tools/unix-timestamp-converter/) to inspect an execution timestamp.

## References

- [crontab manual](https://man7.org/linux/man-pages/man5/crontab.5.html)
- [cron-parser documentation](https://github.com/harrisiirak/cron-parser)
