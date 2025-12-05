# Date Validation Refactoring Summary

## What Was Done

The date validation logic has been extracted from the routes into reusable middleware components.

## Files Created

### 1. `/server/utils/dateValidation.ts`
Contains core validation utility functions:
- `validateDateComponents()` - Validates individual date components and returns a Date object
- `validateDateRange()` - Checks if end date is after start date
- `extractDateComponents()` - Extracts date fields from request body with a given prefix

### 2. `/server/middleware/validateDates.ts`
Contains Express middleware functions:
- `validateDates()` - Validates two dates with optional range checking
- `validateSingleDate()` - Validates a single date field

### 3. `/server/middleware/DATE_VALIDATION.md`
Documentation and usage examples for the validation middleware.

## Files Modified

### `/server/routes/index.ts`
- Removed inline validation logic (40+ lines)
- Added `validateDates` middleware to POST route
- Route handler now simply retrieves validated dates from `res.locals.validatedDates`

### `/server/@types/express/index.d.ts`
- Added `validatedDates` and `validatedDate` to Express Locals interface for type safety

## Benefits

1. **Reusability**: The middleware can now be used on any route that needs date validation
2. **Maintainability**: Validation logic is centralized in one place
3. **Type Safety**: Full TypeScript support with proper interfaces
4. **Testability**: Utility functions can be easily unit tested
5. **Consistency**: All date validation follows the same rules across the application
6. **DRY Principle**: No code duplication for date validation
7. **Flexibility**: Supports both single date and date range validation

## Usage Example

```typescript
router.post(
  '/my-dates',
  validateDates({
    startField: { prefix: 'from', fieldName: 'from date', fieldId: 'from-date' },
    endField: { prefix: 'to', fieldName: 'to date', fieldId: 'to-date' },
    validateRange: true,
  }),
  async (req, res) => {
    const { start, end } = res.locals.validatedDates!
    // Use validated Date objects...
  },
)
```

## Validation Features

- ✅ Checks all date fields are provided
- ✅ Validates fields contain numbers only
- ✅ Validates the date is real (e.g., rejects 31st February)
- ✅ Validates date components match the created Date object
- ✅ Optionally validates end date is after start date
- ✅ Automatically redirects with errors on validation failure
- ✅ Preserves form data for re-display
- ✅ Integrates with GOV.UK Design System error patterns

