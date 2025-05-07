// Form validation rules and functions
export const validationRules = {
    // Car validation rules
    cars: {
        car_name: {
            required: true,
            minLength: 2,
            maxLength: 50,
            pattern: /^[a-zA-Z0-9\s-]+$/,
            message: "Car name must be 2-50 characters long and contain only letters, numbers, spaces, and hyphens"
        },
        manufacturer: {
            required: true,
            minLength: 2,
            maxLength: 50,
            pattern: /^[a-zA-Z\s-]+$/,
            message: "Manufacturer must be 2-50 characters long and contain only letters, spaces, and hyphens"
        },
        model: {
            required: true,
            minLength: 1,
            maxLength: 50,
            pattern: /^[a-zA-Z0-9\s-]+$/,
            message: "Model must be 1-50 characters long and contain only letters, numbers, spaces, and hyphens"
        },
        year: {
            required: true,
            pattern: /^(19|20)\d{2}$/,
            message: "Year must be between 1900 and current year"
        },
        daily_rate: {
            required: true,
            pattern: /^\d+(\.\d{1,2})?$/,
            min: 0,
            message: "Daily rate must be a positive number with up to 2 decimal places"
        },
        image_url: {
            required: true,
            pattern: /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i,
            message: "Please enter a valid image URL (jpg, jpeg, png, gif, or webp)"
        }
    },
    // User validation rules
    users: {
        user_name: {
            required: true,
            minLength: 2,
            maxLength: 50,
            pattern: /^[a-zA-Z\s-]+$/,
            message: "Name must be 2-50 characters long and contain only letters, spaces, and hyphens"
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Please enter a valid email address"
        },
        password: {
            required: true,
            minLength: 8,
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            message: "Password must be at least 8 characters long and contain uppercase, lowercase, number, and special character"
        }
    },
    // Booking validation rules
    bookings: {
        from_date: {
            required: true,
            validate: (value) => {
                const date = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date >= today;
            },
            message: "From date must be today or later"
        },
        to_date: {
            required: true,
            validate: (value, form) => {
                const toDate = new Date(value);
                const fromDate = new Date(form.from_date.value);
                return toDate > fromDate;
            },
            message: "To date must be after from date"
        }
    }
};

// Function to validate a single field
export function validateField(field, rules) {
    const value = field.value.trim();
    const fieldName = field.id;
    let isValid = true;
    let errorMessage = '';

    // Check if field has validation rules
    if (rules[fieldName]) {
        const rule = rules[fieldName];

        // Required check
        if (rule.required && !value) {
            isValid = false;
            errorMessage = 'This field is required';
        }
        // Pattern check
        else if (rule.pattern && !rule.pattern.test(value)) {
            isValid = false;
            errorMessage = rule.message;
        }
        // Min length check
        else if (rule.minLength && value.length < rule.minLength) {
            isValid = false;
            errorMessage = rule.message;
        }
        // Max length check
        else if (rule.maxLength && value.length > rule.maxLength) {
            isValid = false;
            errorMessage = rule.message;
        }
        // Min value check
        else if (rule.min !== undefined && Number(value) < rule.min) {
            isValid = false;
            errorMessage = rule.message;
        }
        // Custom validation function
        else if (rule.validate && !rule.validate(value, field.form)) {
            isValid = false;
            errorMessage = rule.message;
        }
    }

    // Update field validation state
    field.classList.toggle('is-invalid', !isValid);
    field.classList.toggle('is-valid', isValid && value !== '');

    // Update or create feedback message
    let feedbackElement = field.nextElementSibling;
    if (!feedbackElement || !feedbackElement.classList.contains('invalid-feedback')) {
        feedbackElement = document.createElement('div');
        feedbackElement.className = 'invalid-feedback';
        field.parentNode.insertBefore(feedbackElement, field.nextSibling);
    }
    feedbackElement.textContent = errorMessage;

    return isValid;
}

// Function to validate an entire form
export function validateForm(form, formType) {
    const rules = validationRules[formType];
    if (!rules) return true;

    let isValid = true;
    const fields = form.querySelectorAll('input, select, textarea');

    fields.forEach(field => {
        if (!validateField(field, rules)) {
            isValid = false;
        }
    });

    return isValid;
}

// Function to attach validation to a form
export function attachFormValidation(form, formType) {
    const fields = form.querySelectorAll('input, select, textarea');

    fields.forEach(field => {
        // Validate on blur
        field.addEventListener('blur', () => {
            validateField(field, validationRules[formType]);
        });

        // Validate on input for immediate feedback
        field.addEventListener('input', () => {
            if (field.classList.contains('is-invalid')) {
                validateField(field, validationRules[formType]);
            }
        });
    });

    // Validate entire form on submit
    form.addEventListener('submit', (e) => {
        if (!validateForm(form, formType)) {
            e.preventDefault();
        }
    });
} 