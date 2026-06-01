import { ActivityAction, FileUploadStatus, StorageProvider } from '../types/prisma'
import { prisma } from '../lib/prisma'
import { activityService } from './activity.service'
import type { Express } from 'express'

export interface UploadFileResult {
  id: string
  filename: string
  originalName: string
  mimeType: string
  sizeBytes: number
  storageKey: string
  url: string
  status: FileUploadStatus
  createdAt: string
  updatedAt: string
}

export class FileService {
  async saveUpload(file: Express.Multer.File, userId: string) {
    const upload = await prisma.fileUpload.create({
      data: {
        userId,
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        storageProvider: StorageProvider.LOCAL,
        storageKey: file.filename,
        url: `/uploads/${file.filename}`,
      },
    })

    await activityService.logActivity({
      userId,
      action: ActivityAction.UPLOAD,
      entityType: 'FileUpload',
      entityId: upload.id,
      description: `Uploaded file ${upload.originalName}`,
    })

    return upload
  }

  async listUserFiles(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit

    const [files, total] = await Promise.all([
      prisma.fileUpload.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.fileUpload.count({ where: { userId } }),
    ])

    return {
      files,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  }
}

export const fileService = new FileService()
