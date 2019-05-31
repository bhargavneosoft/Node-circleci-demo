import model from '../../schema';
import apiHandler from '../../../services/api-handler';
import function_constant from '../../helpers/function-constant';

/**
 * API to create the entry for the pre-defined functions
 * @param {*} req 
 * @param {*} res 
 */
export const createFunctions = (req, res) => {
    if (req.user.isAdmin) {
        const functions = [
            { name: 'Initial Client Set Up', function_no: 'Function 1.1', privileges: ['Admin', 'Operator'] },
            { name: 'Update Client Details', function_no: 'Function 1.2', privileges: ['Admin', 'Operator'] },
            { name: 'Initial CTOS Set Up', function_no: 'Function 2.1', privileges: ['Admin', 'Operator'] },
            { name: 'Update CTOS Details', function_no: 'Function 2.2', privileges: ['Admin', 'Operator'] },
            {
                name: 'Advanced Shipping Notice (ASN)',
                function_no: 'Function 3.0',
                privileges: ['Admin', 'Operator']
            },
            {
                name: 'Inwards Receipt (Receive Material)',
                function_no: 'Function 4.1',
                privileges: ['Admin', 'Operator']
            },
            {
                name: 'Inwards Receipt (Evaluate & Relocate Material)',
                function_no: 'Function 4.2',
                privileges: ['Admin', 'Operator']
            },
            {
                name: 'Inwards Receipt & Verify - Non critical Labels (E -NCLT, PNCL)',
                function_no: 'Function 5.0',
                privileges: ['Admin', 'Operator']
            },
            { name: 'Print IA CTOS', function_no: 'Function 6.1', privileges: ['Admin', 'Operator'] },
            {
                name: 'Prepare Inbound Audit Checklist',
                function_no: 'Function 6.2',
                privileges: ['Admin', 'Operator']
            },
            {
                name: 'Inbound Audit Data entry to IMS',
                function_no: 'Function 6.3',
                privileges: ['Admin', 'Operator']
            },
            {
                name: 'Prepare Component Audit Checklist',
                function_no: 'Function 6.4',
                privileges: ['Admin', 'Operator']
            }
        ];
        model.functions.createFunctions(functions, (err, created) => {
            if (err) {
                apiHandler.setErrorResponse('UNKNOWN_ERROR', res, req);
            } else {
                apiHandler.setSuccessResponse({ message: 'Functions created successfully' }, res, req);
            }
        });
    } else {
        apiHandler.setErrorResponse('NOT_ADMIN', res, req);
    }
};


export const initializeFunction = (req, res) => {
    if (validator.isEmpty(req.body.function_type)) {
        apiHandler.setErrorResponse('FIELD_MISSING', res, req);
    }

    const type = req.body.function_type;

    switch (type) {
        case function_constant.FUNCTION_1_1:
          

            break;
    }

}