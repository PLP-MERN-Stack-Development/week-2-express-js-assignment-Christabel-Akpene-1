const CustomError = require("./customError");

class ValidationError extends CustomError {
    constructor(message = "Invalid Input"){
        super(message, 404)
    }
}

module.exports = ValidationError