import { ZodError } from 'zod';

export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

function logError(err) {
  const message = err?.message || String(err);
  const status = err?.status;
  const prefix = status ? `[error ${status}]` : '[error]';
  console.error(prefix, message);
  if (err?.stack && process.env.NODE_ENV !== 'production') {
    console.error(err.stack);
  }
}

export function errorHandler(err, req, res, next) {
  logError(err);

  if (err instanceof ZodError || err?.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.issues || err.errors || [],
    });
  }

  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Internal server error' });
}

export function notFound(req, res) {
  res.status(404).json({ error: 'Not found' });
}
