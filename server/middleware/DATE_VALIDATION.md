# Date Validation Middleware

This project includes reusable date validation middleware that can be used across different routes.

## Features

- Validates GOV.UK Design System date inputs
- Supports single date or date range validation
- Checks for valid date formats
- Validates that dates are real (e.g., catches 31st February)
- Validates date ranges (end date after start date)
- Automatically redirects with error messages
- Stores validated dates in `res.locals` for route handlers

## Usage

### Validating a Date Range

```typescript
import { validateDates } from '../middleware/validateDates'

router.post(
  '/dates',
  validateDates({
    startField: {
      prefix: 'start',        // Form field prefix (creates start-day, start-month, start-year)
      fieldName: 'start date', // Display name for error messages
      fieldId: 'start-date',   // ID for error links
    },
    endField: {
      prefix: 'end',
      fieldName: 'end date',
      fieldId: 'end-date',
    },
    validateRange: true,      // Ensures end date is after start date
  }),
  async (req, res) => {
    // Validated dates are available in res.locals.validatedDates
    const { start, end, startComponents, endComponents } = res.locals.validatedDates!

    // start and end are Date objects
    // startComponents and endComponents have { day, month, year } strings

    res.render('success', { startDate: startComponents, endDate: endComponents })
  },
)
```

### Validating a Single Date

```typescript
import { validateSingleDate } from '../middleware/validateDates'

router.post(
  '/single-date',
  validateSingleDate({
    prefix: 'birth',
    fieldName: 'date of birth',
    fieldId: 'birth-date',
  }),
  async (req, res) => {
    // Validated date is available in res.locals.validatedDate
    const { date, components } = res.locals.validatedDate!

    res.render('success', { birthDate: components })
  },
)
```

## Utility Functions

The validation utilities can also be used directly:

```typescript
import { validateDateComponents, extractDateComponents } from '../utils/dateValidation'

const components = extractDateComponents(req.body, 'start')
const result = validateDateComponents(components, 'start date')

if (result.isValid) {
  const date: Date = result.date!
  // Use the date...
} else {
  const error: string = result.error!
  // Handle the error...
}
```

## Form Template

Your Nunjucks template should use the GOV.UK Design System date input component:

```nunjucks
{{ govukDateInput({
  id: "start-date",
  namePrefix: "start",
  fieldset: {
    legend: {
      text: "Start date",
      classes: "govuk-fieldset__legend--m"
    }
  },
  hint: {
    text: "For example, 27 3 2024"
  },
  items: [
    {
      classes: "govuk-input--width-2",
      name: "day",
      value: formData['start-day']
    },
    {
      classes: "govuk-input--width-2",
      name: "month",
      value: formData['start-month']
    },
    {
      classes: "govuk-input--width-4",
      name: "year",
      value: formData['start-year']
    }
  ]
}) }}
```

## Error Handling

Validation errors are automatically:
1. Added to flash messages
2. Form data is preserved in flash
3. User is redirected back to the form

In your GET route, retrieve errors and form data:

```typescript
router.get('/dates', async (req, res) => {
  return res.render('pages/dates', {
    errors: req.flash('errors'),
    formData: req.flash('formData')[0] || {},
  })
})
```

