import { Request, Response, NextFunction } from 'express';
import { ProcurementService } from './procurement.service';
import { sendResponse } from '@utils/response.util';
import { 
  createProcurementRequestSchema, 
  updateProcurementRequestSchema, 
  createPurchaseOrderSchema, 
  updatePurchaseOrderSchema 
} from './procurement.dto';

export class ProcurementController {
  private service: ProcurementService;

  constructor() {
    this.service = new ProcurementService();
  }

  // --- Procurement Request Handlers ---

  getAllRequests = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getAllRequests(req.user!.company_id);
      sendResponse(res, 200, 'Procurement requests fetched successfully', data);
    } catch (error) {
      next(error);
    }
  };

  getRequestById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getRequestById(req.params.id as string, req.user!.company_id);
      sendResponse(res, 200, 'Procurement request fetched successfully', data);
    } catch (error) {
      next(error);
    }
  };

  createRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = createProcurementRequestSchema.parse(req.body);
      const data = await this.service.createRequest(req.user!.company_id, req.user!.id, validatedData);
      sendResponse(res, 201, 'Procurement request created successfully', data);
    } catch (error) {
      next(error);
    }
  };

  updateRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = updateProcurementRequestSchema.parse(req.body);
      const data = await this.service.updateRequest(req.params.id as string, req.user!.company_id, validatedData);
      sendResponse(res, 200, 'Procurement request updated successfully', data);
    } catch (error) {
      next(error);
    }
  };

  deleteRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.deleteRequest(req.params.id as string, req.user!.company_id);
      sendResponse(res, 200, 'Procurement request deleted successfully');
    } catch (error) {
      next(error);
    }
  };

  approveRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.approveRequest(req.params.id as string, req.user!.company_id, req.user!.id);
      sendResponse(res, 200, 'Procurement request approved successfully', data);
    } catch (error) {
      next(error);
    }
  };

  // --- Purchase Order Handlers ---

  getAllPurchaseOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await this.service.getAllPurchaseOrders(req.user!.company_id);
      sendResponse(res, 200, 'Purchase orders fetched successfully', data);
    } catch (error) {
      next(error);
    }
  };

  createPurchaseOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = createPurchaseOrderSchema.parse(req.body);
      const data = await this.service.createPurchaseOrder(req.user!.company_id, validatedData);
      sendResponse(res, 201, 'Purchase order created successfully', data);
    } catch (error) {
      next(error);
    }
  };

  updatePurchaseOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = updatePurchaseOrderSchema.parse(req.body);
      const data = await this.service.updatePurchaseOrder(req.params.id as string, req.user!.company_id, validatedData);
      sendResponse(res, 200, 'Purchase order updated successfully', data);
    } catch (error) {
      next(error);
    }
  };

  deletePurchaseOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.service.deletePurchaseOrder(req.params.id as string, req.user!.company_id);
      sendResponse(res, 200, 'Purchase order deleted successfully');
    } catch (error) {
      next(error);
    }
  };
}
