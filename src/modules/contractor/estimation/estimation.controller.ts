import { Request, Response, NextFunction } from 'express';
import { EstimationService } from './estimation.service';
import { sendResponse } from '@utils/response.util';
import { createEstimationSchema, addEstimationItemSchema, updateEstimationItemSchema } from './estimation.dto';

export class EstimationController {
  private estimationService: EstimationService;

  constructor() {
    this.estimationService = new EstimationService();
  }

  getAllEstimations = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const estimations = await this.estimationService.getAllEstimations(req.user!.company_id);
      sendResponse(res, 200, 'Estimations fetched successfully', estimations);
    } catch (error) {
      next(error);
    }
  };

  getEstimationById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const estimation = await this.estimationService.getEstimationById(req.params.id as string, req.user!.company_id);
      sendResponse(res, 200, 'Estimation fetched successfully', estimation);
    } catch (error) {
      next(error);
    }
  };

  createEstimation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = createEstimationSchema.parse(req.body);
      const estimation = await this.estimationService.createEstimation(req.user!.company_id, validatedData);
      sendResponse(res, 201, 'Estimation created successfully', estimation);
    } catch (error) {
      next(error);
    }
  };

  deleteEstimation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.estimationService.deleteEstimation(req.params.id as string, req.user!.company_id);
      sendResponse(res, 200, 'Estimation deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  addItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = addEstimationItemSchema.parse(req.body);
      const item = await this.estimationService.addItem(req.params.id as string, req.user!.company_id, validatedData);
      sendResponse(res, 201, 'Item added successfully', item);
    } catch (error) {
      next(error);
    }
  };

  updateItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = updateEstimationItemSchema.parse(req.body);
      const item = await this.estimationService.updateItem(
        req.params.id as string,
        req.params.itemId as string,
        req.user!.company_id,
        validatedData
      );
      sendResponse(res, 200, 'Item updated successfully', item);
    } catch (error) {
      next(error);
    }
  };

  deleteItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.estimationService.deleteItem(
        req.params.id as string,
        req.params.itemId as string,
        req.user!.company_id
      );
      sendResponse(res, 200, 'Item removed successfully');
    } catch (error) {
      next(error);
    }
  };

  approveEstimation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.estimationService.approveEstimation(req.params.id as string, req.user!.company_id);
      sendResponse(res, 200, 'Estimation approved successfully');
    } catch (error) {
      next(error);
    }
  };

  getVersions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const versions = await this.estimationService.getVersions(req.params.id as string, req.user!.company_id);
      sendResponse(res, 200, 'Estimation versions fetched successfully', versions);
    } catch (error) {
      next(error);
    }
  };

  createNewVersion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newVersion = await this.estimationService.createNewVersion(req.params.id as string, req.user!.company_id);
      sendResponse(res, 201, 'New version created successfully', newVersion);
    } catch (error) {
      next(error);
    }
  };
}
