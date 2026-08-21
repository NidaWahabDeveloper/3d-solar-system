import {validationResult} from 'express-validator';
export const validateRequest = ( req , res , next ) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        const errorList = [];
        const allErrors = errors.array();
        for (let i = 0; i < allErrors.length; i++) {
            const singleError = allErrors[i];
            errorList.push({
                field: singleError.path,
                message: singleError.msg,
            });

        }
        return res.status(400).json({ success: false, errors: errorList});
    }
    next();
};