import { prisma } from '@config/prisma.config';
import { CreateBuilderProjectDTO, UpdateBuilderProjectDTO } from './project.dto';

export class BuilderProjectRepository {
  async findAll(companyId: string) {
    return (prisma as any).project.findMany({
      where: { companyId },
      include: {
        _count: {
          select: {
            members: true,
            // Assuming these exist in the actual schema update
            // units: true,
            // bookings: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async findById(id: string, companyId: string) {
    return (prisma as any).project.findFirst({
      where: { id, companyId },
      include: {
        members: { include: { user: { select: { firstName: true, lastName: true, email: true } } } }
      }
    });
  }

  async create(data: CreateBuilderProjectDTO & { companyId: string }) {
    return (prisma as any).project.create({
      data
    });
  }

  async update(id: string, companyId: string, data: UpdateBuilderProjectDTO) {
    return (prisma as any).project.updateMany({
      where: { id, companyId },
      data
    });
  }

  async delete(id: string, companyId: string) {
    return (prisma as any).project.deleteMany({
      where: { id, companyId }
    });
  }

  // --- Sub-resources ---

  async getUnits(projectId: string, companyId: string) {
    return (prisma as any).unit.findMany({
      where: { projectId, companyId },
      orderBy: { unitNumber: 'asc' }
    });
  }

  async getBookings(projectId: string, companyId: string) {
    return (prisma as any).booking.findMany({
      where: { projectId, companyId },
      include: {
        unit: { select: { unitNumber: true } }
      },
      orderBy: { bookingDate: 'desc' }
    });
  }

  async getDashboardStats(projectId: string, companyId: string) {
    const [units, bookings] = await Promise.all([
      (prisma as any).unit.findMany({ where: { projectId, companyId } }),
      (prisma as any).booking.findMany({ where: { projectId, companyId } })
    ]);

    const totalUnits = units.length;
    const bookedUnits = units.filter((u: any) => u.status === 'BOOKED' || u.status === 'SOLD').length;
    const availableUnits = totalUnits - bookedUnits;
    const totalCollected = bookings.reduce((sum: number, b: any) => sum + b.paidAmount, 0);
    const totalRevenue = bookings.reduce((sum: number, b: any) => sum + b.totalAmount, 0);

    return {
      inventory: {
        total: totalUnits,
        booked: bookedUnits,
        available: availableUnits,
        occupancyRate: totalUnits > 0 ? (bookedUnits / totalUnits) * 100 : 0
      },
      financials: {
        totalRevenue,
        totalCollected,
        pendingCollection: totalRevenue - totalCollected
      }
    };
  }
}
