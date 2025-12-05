# Three-Letter Month Input Enhancement

## Overview

The date input form has been updated to accept three-letter month abbreviations (e.g., "Jan", "Feb", "Mar") instead of requiring numeric months. The system now supports both formats for flexibility.

## Changes Made

### 1. Updated Date Validation (`server/utils/dateValidation.ts`)

Added a `parseMonth()` function that accepts:
- **Numeric format**: 1-12 (e.g., "1" for January, "12" for December)
- **Three-letter abbreviation**: Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec
  - Case-insensitive (e.g., "jan", "JAN", "Jan" all work)
  - Whitespace is trimmed automatically

**Month Abbreviations Supported:**
```
jan → January (0)
feb → February (1)
mar → March (2)
apr → April (3)
may → May (4)
jun → June (5)
jul → July (6)
aug → August (7)
sep → September (8)
oct → October (9)
nov → November (10)
dec → December (11)
```

### 2. Updated Form Template (`server/views/pages/dates.njk`)

- Updated hint text from "27 3 2024" to "27 Mar 2024"
- Changed month input width from `govuk-input--width-2` to `govuk-input--width-3` to accommodate 3 characters
- Examples now show three-letter months:
  - Start date: "27 Mar 2024"
  - End date: "15 Jun 2024"

### 3. Enhanced Error Messages

More specific error messages for different validation failures:
- "start date day must be a number" - when day is not numeric
- "start date month must be a valid month (e.g., Jan, Feb, or 1, 2)" - when month is invalid
- "start date year must be a number" - when year is not numeric

## Usage Examples

### Valid Inputs

**Three-letter abbreviations:**
- 5 Dec 2025
- 1 jan 2024 (case-insensitive)
- 15 JUN 2024 (case-insensitive)

**Numeric format (still supported):**
- 5 12 2025
- 1 1 2024
- 15 6 2024

### Invalid Inputs

These will be rejected with appropriate error messages:
- 5 Dece 2025 (not a 3-letter abbreviation)
- 5 D 2025 (not recognized)
- 5 13 2025 (month out of range)
- 31 Feb 2024 (invalid date)

## Benefits

✅ More user-friendly input format
✅ Reduces ambiguity (no confusion about month vs day order)
✅ Maintains backward compatibility with numeric input
✅ Case-insensitive for better user experience
✅ Clear error messages guide users to correct format

## Technical Details

The `parseMonth()` function:
1. First attempts to parse the input as a number (1-12)
2. If that fails, converts to lowercase and checks against month abbreviations
3. Returns the 0-indexed month number for JavaScript Date constructor
4. Returns NaN if the month is invalid

This approach ensures both formats work seamlessly while maintaining proper validation.

