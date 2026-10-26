---
title: 'GB versus GiB: convert storage units without guessing'
description: 'Separate decimal and binary storage units when reading disk usage, quotas and backup sizes.'
category: 'Text & data'
readingTime: '2 min read'
updated: '2026-10-26'
tool: 'storage-unit-converter'
---

A gigabyte and a gibibyte represent different numbers of bytes. The difference is a unit convention, not evidence that a drive has lost data.

## Compare the two systems

| Unit  | Bytes         |
| ----- | ------------- |
| 1 kB  | 1,000         |
| 1 KiB | 1,024         |
| 1 MB  | 1,000,000     |
| 1 MiB | 1,048,576     |
| 1 GB  | 1,000,000,000 |
| 1 GiB | 1,073,741,824 |

SI prefixes use powers of 1000. IEC binary prefixes use powers of 1024 and include the letter `i`. Consequently, `1 GB = 1000 MB` and `1 GiB = 1024 MiB`.

## Convert one value into every unit

Open [Storage Unit Converter](/tools/storage-unit-converter/), enter `1.5` and choose `GiB`. The byte result is `1610612736`, and the MiB result is `1536`. Choose GB instead to see how the same amount label changes the byte count.

For a capacity reported as 500 GB, the corresponding binary quantity is about 465.661287308 GiB. Formatting, filesystem metadata and other reservations can reduce the space available for files further; conversion alone does not calculate those overheads.

## Understand precision and input limits

Enter non-negative ordinary decimal notation, with up to 40 whole digits and 18 decimal places. Commas and exponent notation are rejected. Calculations use integer fractions internally, preserving large whole integers without JavaScript floating-point rounding.

Results round half up to nine decimal places. Positive amounts that round below that precision are shown as `< 0.000000001`; that is a display limit, not zero bytes. These are mathematical conversions, so fractional byte results do not imply a real file can occupy a fraction of one byte.

## Keep bandwidth separate

This tool converts storage bytes. A byte is eight bits, so Mbps and MB/s are different transfer-rate units. A storage conversion does not measure network speed or predict restore performance. Use [Hash & Checksum](/tools/hash-checksum/) when your next task is checking a downloaded or copied file.

## References

- [NIST: Prefixes for binary multiples](https://pml.nist.gov/cuu/Units/binary.html)
