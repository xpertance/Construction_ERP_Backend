import express from 'express';
const router = express.Router();

router.get('/', (req, res) => res.json({ message: 'Placeholder for users module' }));

export default router;
