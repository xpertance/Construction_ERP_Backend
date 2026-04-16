import { ProcurementRepository } from './procurement.repository';
import { CreateProcurementRequestDTO, CreatePurchaseOrderDTO, UpdateProcurementRequestDTO, UpdatePurchaseOrderDTO } from './procurement.dto';

export class ProcurementService {
  private repository: ProcurementRepository;

  constructor() {
    this.repository = new ProcurementRepository();
  }

  // --- Procurement Request logic ---

  async getAllRequests(companyId: string) {
    return this.repository.findAllRequests(companyId);
  }

  async getRequestById(id: string, companyId: string) {
    const request = await this.repository.findRequestById(id, companyId);
    if (!request) throw new Error('Procurement request not found');
    return request;
  }

  async createRequest(companyId: string, requestedById: string, data: CreateProcurementRequestDTO) {
    return this.repository.createRequest({ ...data, companyId, requestedById });
  }

  async updateRequest(id: string, companyId: string, data: UpdateProcurementRequestDTO) {
    const request = await this.getRequestById(id, companyId);
    if (request.status !== 'PENDING') {
      throw new Error('Only pending requests can be updated');
    }
    return this.repository.updateRequest(id, companyId, data);
  }

  async deleteRequest(id: string, companyId: string) {
    const request = await this.getRequestById(id, companyId);
    if (request.status === 'APPROVED') {
      throw new Error('Cannot delete an approved request');
    }
    return this.repository.deleteRequest(id, companyId);
  }

  async approveRequest(id: string, companyId: string, approvedById: string) {
    const request = await this.getRequestById(id, companyId);
    if (request.status !== 'PENDING') {
      throw new Error('Request is already ' + request.status.toLowerCase());
    }
    return this.repository.approveRequest(id, companyId, approvedById);
  }

  // --- Purchase Order logic ---

  async getAllPurchaseOrders(companyId: string) {
    return this.repository.findAllPurchaseOrders(companyId);
  }

  async createPurchaseOrder(companyId: string, data: CreatePurchaseOrderDTO) {
    // Generate simple PO number: PO-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const latestPO = await this.repository.getLatestPONumber(companyId);
    let sequence = '0001';
    
    if (latestPO && latestPO.poNumber.includes(dateStr)) {
      const lastSeq = parseInt(latestPO.poNumber.split('-').pop() || '0');
      sequence = (lastSeq + 1).toString().padStart(4, '0');
    }

    const poNumber = `PO-${dateStr}-${sequence}`;
    
    return this.repository.createPurchaseOrder({ ...data, companyId, poNumber });
  }

  async updatePurchaseOrder(id: string, companyId: string, data: UpdatePurchaseOrderDTO) {
    return this.repository.updatePurchaseOrder(id, companyId, data);
  }

  async deletePurchaseOrder(id: string, companyId: string) {
    return this.repository.deletePurchaseOrder(id, companyId);
  }
}
