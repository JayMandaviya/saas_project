import { Request, Response } from 'express'
import { fileService } from '../services/file.service'

export class FileController {
  async upload(req: Request, res: Response): Promise<void> {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'Missing file upload' })
      return
    }

    const upload = await fileService.saveUpload(req.file, req.user!.id)

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: upload,
    })
  }

  async list(req: Request, res: Response): Promise<void> {
    const page = Number(req.query.page ?? 1)
    const limit = Number(req.query.limit ?? 20)
    const result = await fileService.listUserFiles(req.user!.id, page, limit)

    res.json({
      success: true,
      data: result,
    })
  }
}

export const fileController = new FileController()
