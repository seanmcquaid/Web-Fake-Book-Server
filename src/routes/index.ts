import { Router } from 'express';
import ChartsRouter from './ChartsRouter';
// Init router and path
const router = Router();

// Add sub-routes

router.use('/charts', ChartsRouter);

// Export the base-router
export default router;
