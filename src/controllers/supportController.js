const emailService = require('../services/emailService');
const ApiError = require('../utils/ApiError');

/**
 * @desc    Submit support inquiry
 * @route   POST /api/support
 * @access  Public
 */
exports.submitInquiry = async (req, res, next) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return next(new ApiError(400, 'Please provide all required fields: name, email, subject, message'));
        }

        // Send email to admin
        await emailService.sendSupportEmail(name, email, subject, message);

        res.status(200).json({
            success: true,
            message: 'Support inquiry sent successfully'
        });
    } catch (error) {
        console.error('Support email error:', error);
        next(new ApiError(500, 'Failed to send support inquiry. Please try again later.'));
    }
};
