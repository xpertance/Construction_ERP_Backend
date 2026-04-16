import { Request, Response, NextFunction } from 'express';
import { BuilderProjectService } from './project.service';
import { sendResponse } from '@utils/response.util';
import { createBuilderProjectSchema, updateBuilderProjectSchema } from './project.dto';

export class BuilderProjectController {
  private service: BuilderProjectService;

  constructor() {
    this.service = new BuilderProjectService();
  }

  getAllProjects = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getAllProjects(req.user!.company_id);
      sendResponse(res, 200, 'Projects fetched successfully', data);
    } catch (error) {
      next(error);
    }
  };

  getProjectById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getProjectById(req.params.id as string, req.user!.company_id);
      sendResponse(res, 200, 'Project details fetched successfully', data);
    } catch (error) {
      next(error);
    }
  };

  createProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = createBuilderProjectSchema.parse(req.body);
      const data = await this.service.createProject(req.user!.company_id, validatedData);
      sendResponse(res, 201, 'Project created successfully', data);
    } catch (error) {
      next(error);
    }
  };

  updateProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = updateBuilderProjectSchema.parse(req.body);
      await this.service.updateProject(req.params.id as string, req.user!.company_id, validatedData);
      sendResponse(res, 200, 'Project updated successfully');
    } catch (error) {
      next(error);
    }
  };

  deleteProject = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.deleteProject(req.params.id as string, req.user!.company_id);
      sendResponse(res, 200, 'Project deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  getDashboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getProjectDashboard(req.params.id as string, req.user!.company_id);
      sendResponse(res, 200, 'Project dashboard data fetched successfully', data);
    } catch (error) {
      next(error);
    }
  };

  getUnits = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getProjectUnits(req.params.id as string, req.user!.company_id);
      sendResponse(res, 200, 'Project units fetched successfully', data);
    } catch (error) {
      next(error);
    }
  };

  getBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getProjectBookings(req.params.id as string, req.user!.company_id);
      sendResponse(res, 200, 'Project bookings fetched successfully', data);
    } catch (error) {
      next(error);
    }
  };
}
