"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePassword = void 0;
//import * as passwordValidator from 'password-validator';
var passwordValidator = require('password-validator');
// Create a schema
const schema = new passwordValidator();
// Add properties to it
schema
    .is().min(10) // Minimum length 10
    .has().uppercase() // Must have uppercase letters
    .has().lowercase() // Must have lowercase letters
    .has().digits() // Must have digits
    .has().not().spaces() // Should not have spaces
    .is().not().oneOf(['Passw0rd', 'Password123']); // Blacklist these values
function validatePassword(password) {
    return schema.validate(password, { list: true });
}
exports.validatePassword = validatePassword;
//# sourceMappingURL=password-validation.js.map