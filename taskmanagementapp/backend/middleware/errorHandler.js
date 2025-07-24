const errorHandler=(err,req,res,next)=>{
let error = { ...err };
  error.message = err.message;
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }
 // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }
// Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error'
  });

}

module.exports = errorHandler;