import express from 'express';
import { FinanceController } from './finance.controller';
import { authMiddleware } from '@middleware/auth.middleware';
import { checkERPType } from '@middleware/erp.middleware';
import { allowPermissions } from '@middleware/rbac.middleware';

const router = express.Router();
const controller = new FinanceController();

const contractorGuard = checkERPType(['CONTRACTOR', 'BUILDER']);

/**
 * @swagger
 * tags:
 *   name: Finance
 *   description: Financial transactions, invoices and payments management
 */

// --- Transactions ---

/**
 * @swagger
 * /api/v1/contractor/finance/transactions:
 *   get:
 *     summary: Get all financial transactions
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of transactions
 */
router.get('/transactions', authMiddleware, contractorGuard, allowPermissions('finance.transactions.view'), controller.getAllTransactions);

/**
 * @swagger
 * /api/v1/contractor/finance/transactions:
 *   post:
 *     summary: Record a new financial transaction
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [type, amount]
 *             properties:
 *               type: { type: string, enum: [INCOME, EXPENSE] }
 *               category: { type: string }
 *               amount: { type: number }
 *               description: { type: string }
 *               date: { type: string, format: date-time }
 *               reference: { type: string }
 *     responses:
 *       201:
 *         description: Transaction recorded
 */
router.post('/transactions', authMiddleware, contractorGuard, allowPermissions('finance.transactions.create'), controller.createTransaction);


// --- Invoices ---

/**
 * @swagger
 * /api/v1/contractor/finance/invoices:
 *   get:
 *     summary: Get all invoices
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of invoices
 */
router.get('/invoices', authMiddleware, contractorGuard, allowPermissions('finance.invoices.view'), controller.getAllInvoices);

/**
 * @swagger
 * /api/v1/contractor/finance/invoices:
 *   post:
 *     summary: Create a new invoice
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [projectId, dueDate, items]
 *             properties:
 *               projectId: { type: string, format: uuid }
 *               clientName: { type: string }
 *               dueDate: { type: string, format: date-time }
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [description, quantity, unitPrice]
 *                   properties:
 *                     description: { type: string }
 *                     quantity: { type: number }
 *                     unitPrice: { type: number }
 *     responses:
 *       201:
 *         description: Invoice created
 */
router.post('/invoices', authMiddleware, contractorGuard, allowPermissions('finance.invoices.create'), controller.createInvoice);

/**
 * @swagger
 * /api/v1/contractor/finance/invoices/{id}:
 *   patch:
 *     summary: Update an invoice
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Invoice updated
 */
router.patch('/invoices/:id', authMiddleware, contractorGuard, allowPermissions('finance.invoices.update'), controller.updateInvoice);

/**
 * @swagger
 * /api/v1/contractor/finance/invoices/{id}:
 *   delete:
 *     summary: Delete an invoice
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Invoice deleted
 */
router.delete('/invoices/:id', authMiddleware, contractorGuard, allowPermissions('finance.invoices.delete'), controller.deleteInvoice);


// --- Payments ---

/**
 * @swagger
 * /api/v1/contractor/finance/payments:
 *   get:
 *     summary: Get all payments
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200:
 *         description: List of payments
 */
router.get('/payments', authMiddleware, contractorGuard, allowPermissions('finance.payments.view'), controller.getAllPayments);

/**
 * @swagger
 * /api/v1/contractor/finance/payments:
 *   post:
 *     summary: Record a payment (Links to transaction and invoice)
 *     tags: [Finance]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, paymentMethod]
 *             properties:
 *               invoiceId: { type: string, format: uuid }
 *               amount: { type: number }
 *               paymentDate: { type: string, format: date-time }
 *               paymentMethod: { type: string }
 *               notes: { type: string }
 *     responses:
 *       201:
 *         description: Payment recorded and transaction generated
 */
router.post('/payments', authMiddleware, contractorGuard, allowPermissions('finance.payments.create'), controller.recordPayment);

export default router;
