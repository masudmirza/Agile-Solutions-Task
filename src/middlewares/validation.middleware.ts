import { check } from 'express-validator';
import { ErrorCode } from '../domain/enums/error-code.enum';

export const signUpValidation = [
    check('firstName', ErrorCode.FIRSTNAME_IS_REQUIRED).not().isEmpty(),
    check('lastName', ErrorCode.LASTNAME_IS_REQUIRED).not().isEmpty(),
    check('email', ErrorCode.EMAIL_IS_REQUIRED)
    .isEmail().withMessage(ErrorCode.NOT_VALID_EMAIL),
    check('password', ErrorCode.PASSWORD_IS_REQUIRED).isLength({ min: 8 })
    .withMessage(ErrorCode.PASSWORD_SHOULD_BE_MORE_THAN_8_CHARACTERS),
    check('role', ErrorCode.ROLE_IS_REQUIRED).not().isEmpty(),
];

export const signInValidation = [
    check('email',ErrorCode.EMAIL_IS_REQUIRED)
    .isEmail().withMessage(ErrorCode.NOT_VALID_EMAIL),
    check('password', ErrorCode.PASSWORD_IS_REQUIRED).isLength({ min: 8 })
    .withMessage(ErrorCode.PASSWORD_SHOULD_BE_MORE_THAN_8_CHARACTERS),
];

export const updateUserValidation = [
    check('firstName', ErrorCode.FIRSTNAME_IS_REQUIRED).not().isEmpty(),
    check('lastName', ErrorCode.LASTNAME_IS_REQUIRED).not().isEmpty(),
    check('role', ErrorCode.ROLE_IS_REQUIRED).not().isEmpty(),
];
