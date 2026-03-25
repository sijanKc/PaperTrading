const { validationResult } = require('express-validator');

/**
 * Middleware to check validation results from express-validator
 * Returns 400 with error details if validation fails
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path || err.param,
                message: err.msg,
                value: err.value
            }))
        });
    }

    next();
};

module.exports = validate;
