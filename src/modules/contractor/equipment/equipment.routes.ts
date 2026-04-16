import express from 'express';
const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'Placeholder for equipment module' }));

export default router;
