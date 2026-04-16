import express from 'express';
import { ProjectController } from './project.controller';
import { authMiddleware } from '@middleware/auth.middleware';
import { checkERPType } from '@middleware/erp.middleware';
import { allowPermissions } from '@middleware/rbac.middleware';

const router = express.Router();
const controller = new ProjectController();

// All project routes require CONTRACTOR ERP type
const contractorGuard = checkERPType(['CONTRACTOR']);

/**
 * @swagger
 * tags:
 *   name: Contractor Projects
 *   description: Project management for contractors
 */

/**
 * @swagger
 * /api/v1/contractor/projects:
 *   get:
 *     summary: Get all projects
 *     tags: [Contractor Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of projects
 */
router.get('/', authMiddleware, contractorGuard, allowPermissions('projects.view'), controller.getAllProjects);

/**
 * @swagger
 * /api/v1/contractor/projects/dashboard:
 *   get:
 *     summary: Get project dashboard data
 *     tags: [Contractor Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics and recent projects
 */
router.get('/dashboard', authMiddleware, contractorGuard, allowPermissions('projects.view'), controller.getDashboardData);

/**
 * @swagger
 * /api/v1/contractor/projects/{id}:
 *   get:
 *     summary: Get project by ID
 *     tags: [Contractor Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Project details
 */
router.get('/:id', authMiddleware, contractorGuard, allowPermissions('projects.view'), controller.getProjectById);

/**
 * @swagger
 * /api/v1/contractor/projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Contractor Projects]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name: { type: string }
 *               description: { type: string }
 *               status: { type: string, enum: [PLANNED, IN_PROGRESS, COMPLETED, ON_HOLD] }
 *               budget: { type: number }
 *     responses:
 *       201:
 *         description: Project created
 */
router.post('/', authMiddleware, contractorGuard, allowPermissions('projects.create'), controller.createProject);

/**
 * @swagger
 * /api/v1/contractor/projects/{id}:
 *   patch:
 *     summary: Update project details
 *     tags: [Contractor Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Project updated
 */
router.patch('/:id', authMiddleware, contractorGuard, allowPermissions('projects.update'), controller.updateProject);

/**
 * @swagger
 * /api/v1/contractor/projects/{id}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Contractor Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Project deleted
 */
router.delete('/:id', authMiddleware, contractorGuard, allowPermissions('projects.delete'), controller.deleteProject);

/**
 * @swagger
 * /api/v1/contractor/projects/{id}/members:
 *   post:
 *     summary: Add member to project
 *     tags: [Contractor Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId]
 *             properties:
 *               userId: { type: string, format: uuid }
 *               role: { type: string }
 *     responses:
 *       201:
 *         description: Member added
 */
router.post('/:id/members', authMiddleware, contractorGuard, allowPermissions('projects.update'), controller.addMember);

/**
 * @swagger
 * /api/v1/contractor/projects/{id}/members/{userId}:
 *   delete:
 *     summary: Remove member from project
 *     tags: [Contractor Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Member removed
 */
router.delete('/:id/members/:userId', authMiddleware, contractorGuard, allowPermissions('projects.update'), controller.removeMember);

/**
 * @swagger
 * /api/v1/contractor/projects/{id}/progress:
 *   post:
 *     summary: Update project progress
 *     tags: [Contractor Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [percentage]
 *             properties:
 *               percentage: { type: number, minimum: 0, maximum: 100 }
 *               statusUpdate: { type: string }
 *     responses:
 *       201:
 *         description: Progress updated
 */
router.post('/:id/progress', authMiddleware, contractorGuard, allowPermissions('projects.update'), controller.updateProgress);

/**
 * @swagger
 * /api/v1/contractor/projects/{id}/progress:
 *   get:
 *     summary: Get progress history
 *     tags: [Contractor Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: List of progress updates
 */
router.get('/:id/progress', authMiddleware, contractorGuard, allowPermissions('projects.view'), controller.getProjectProgress);

export default router;
