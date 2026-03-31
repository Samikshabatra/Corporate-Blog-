import 'dotenv/config';
import app from './app';
import { handleMetrics } from './metrics.controller';

// Sentry error handler (optional dependency)
try {
  const { setupExpressErrorHandler } = require('@sentry/node');
  setupExpressErrorHandler(app);
} catch {
  // @sentry/node not installed — skipping
}

// Logging middleware
app.use((req, res, next) => {
  console.log(`📌 ${req.method} ${req.url}`);
  next();
});

// Metrics route
app.get('/metrics', handleMetrics);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 TCB API running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});
