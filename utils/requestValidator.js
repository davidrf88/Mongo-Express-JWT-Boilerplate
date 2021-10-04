
exports.validateRequest = function (req, res, schema) {
    const requestParams = (req.method == 'POST')? req.body: req.query;
    const { error, value } = schema.validate(requestParams)
    if (error) {
        res.status(400).send(
            {
                success:false, message: error.details[0].message
            });
        return { error, value };
    }
    return { error: undefined, value: value };

};