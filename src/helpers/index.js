const mongoose = require('mongoose'); 

const successResponse = (req, res, data, code = 200) =>
  res.send({
    code,
    data,
    success: true,
  });

const errorResponse = (
  req,
  res,
  errorMessage = "Something went wrong",
  code = 500,
  error = {}
) =>
  res.status(500).json({
    code,
    errorMessage,
    error,
    data: null,
    success: false,
  });

const validateObjectId = (id, fieldName, res) => {
  if (id && !mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: `${fieldName} không hợp lệ` });
    return false;
  }
  return true;
};
module.exports = { successResponse, errorResponse, validateObjectId };
