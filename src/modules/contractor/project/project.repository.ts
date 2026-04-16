import { prisma } from '@config/prisma.config';
import { CreateProjectDTO, UpdateProjectDTO, AddMemberDTO, UpdateProgressDTO } from './project.dto';

export class ProjectRepository {
  async findAll(companyId: string) {
    return prisma.project.findMany({
      where: { companyId },
      include: {
        _count: {
          select: { members: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, companyId: string) {
    return prisma.project.findFirst({
      where: { id, companyId },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        progressUpdates: {
          orderBy: { updatedAt: 'desc' },
          take: 5,
        },
      },
    });
  }

  async create(data: CreateProjectDTO & { companyId: string }) {
    return prisma.project.create({
      data,
    });
  }

  async update(id: string, companyId: string, data: UpdateProjectDTO) {
    return prisma.project.updateMany({
      where: { id, companyId },
      data,
    });
  }

  async delete(id: string, companyId: string) {
    return prisma.project.deleteMany({
      where: { id, companyId },
    });
  }

  async addMember(projectId: string, data: AddMemberDTO) {
    return prisma.projectMember.create({
      data: {
        projectId,
        userId: data.userId,
        role: data.role,
      },
    });
  }

  async removeMember(projectId: string, userId: string) {
    return prisma.projectMember.delete({
      where: {
        projectId_userId: {
          projectId,
          userId,
        },
      },
    });
  }

  async addProgress(projectId: string, data: UpdateProgressDTO) {
    return prisma.projectProgress.create({
      data: {
        projectId,
        percentage: data.percentage,
        statusUpdate: data.statusUpdate,
      },
    });
  }

  async getProgress(projectId: string) {
    return prisma.projectProgress.findMany({
      where: { projectId },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async getStats(companyId: string) {
    const [totalProjects, activeProjects, completedProjects] = await Promise.all([
      prisma.project.count({ where: { companyId } }),
      prisma.project.count({ where: { companyId, status: 'IN_PROGRESS' } }),
      prisma.project.count({ where: { companyId, status: 'COMPLETED' } }),
    ]);

    return {
      totalProjects,
      activeProjects,
      completedProjects,
    };
  }
}
