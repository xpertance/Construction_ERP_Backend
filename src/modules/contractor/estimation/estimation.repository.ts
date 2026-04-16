import { prisma } from '@config/prisma.config';
import { CreateEstimationDTO, AddEstimationItemDTO, UpdateEstimationItemDTO } from './estimation.dto';

export class EstimationRepository {
  async findAll(companyId: string) {
    return prisma.estimation.findMany({
      where: { companyId },
      include: {
        project: {
          select: { name: true },
        },
        versions: {
          orderBy: { versionNumber: 'desc' },
          take: 1,
        },
      },
    });
  }

  async findById(id: string, companyId: string) {
    return prisma.estimation.findFirst({
      where: { id, companyId },
      include: {
        project: true,
        versions: {
          include: {
            items: true,
          },
          orderBy: { versionNumber: 'desc' },
        },
      },
    });
  }

  async create(data: CreateEstimationDTO & { companyId: string }) {
    return prisma.estimation.create({
      data: {
        projectId: data.projectId,
        companyId: data.companyId,
        versions: {
          create: {
            versionNumber: 1,
            title: data.title,
            description: data.description,
            status: 'DRAFT',
          },
        },
      },
      include: {
        versions: true,
      },
    });
  }

  async delete(id: string, companyId: string) {
    return prisma.estimation.deleteMany({
      where: { id, companyId },
    });
  }

  async addItem(versionId: string, data: AddEstimationItemDTO) {
    const amount = data.quantity * data.rate;
    return prisma.estimationItem.create({
      data: {
        estimationVersionId: versionId,
        ...data,
        amount,
      },
    });
  }

  async updateItem(itemId: string, data: UpdateEstimationItemDTO) {
    // If quantity or rate is updated, recalculate amount
    const existing = await prisma.estimationItem.findUnique({ where: { id: itemId } });
    if (!existing) throw new Error('Item not found');

    const quantity = data.quantity ?? existing.quantity;
    const rate = data.rate ?? existing.rate;
    const amount = quantity * rate;

    return prisma.estimationItem.update({
      where: { id: itemId },
      data: {
        ...data,
        amount,
      },
    });
  }

  async removeItem(itemId: string) {
    return prisma.estimationItem.delete({
      where: { id: itemId },
    });
  }

  async approve(estimationId: string, companyId: string) {
    return prisma.estimation.updateMany({
      where: { id: estimationId, companyId },
      data: { status: 'APPROVED' },
    });
  }

  async updateVersionStatus(versionId: string, status: string) {
    return prisma.estimationVersion.update({
      where: { id: versionId },
      data: { status },
    });
  }

  async createNewVersion(estimationId: string, previousVersionId: string, versionNumber: number) {
    const prevVersion = await prisma.estimationVersion.findUnique({
      where: { id: previousVersionId },
      include: { items: true },
    });

    if (!prevVersion) throw new Error('Previous version not found');

    return prisma.estimationVersion.create({
      data: {
        estimationId,
        versionNumber,
        title: prevVersion.title,
        description: prevVersion.description,
        totalAmount: prevVersion.totalAmount,
        status: 'DRAFT',
        items: {
          create: prevVersion.items.map(item => ({
            description: item.description,
            quantity: item.quantity,
            unit: item.unit,
            rate: item.rate,
            amount: item.amount,
          })),
        },
      },
    });
  }

  async getVersions(estimationId: string) {
    return prisma.estimationVersion.findMany({
      where: { estimationId },
      include: {
        _count: { select: { items: true } },
      },
      orderBy: { versionNumber: 'desc' },
    });
  }

  async recalculateTotal(versionId: string) {
    const items = await prisma.estimationItem.findMany({
      where: { estimationVersionId: versionId },
    });
    const total = items.reduce((sum, item) => sum + item.amount, 0);
    
    return prisma.estimationVersion.update({
      where: { id: versionId },
      data: { totalAmount: total },
    });
  }
}
