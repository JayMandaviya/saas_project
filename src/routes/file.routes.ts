import multer from 'multer'
import path from 'path'
import type { Request } from 'express'
import { Router } from 'express'
import { fileController } from '../controllers/file.controller'
import { asyncHandler } from '../middleware/asyncHandler'
import { authenticate } from '../middleware/authenticate'
import { env } from '../config/env'

const router = Router()
const storage = multer.diskStorage({
  destination: path.resolve(env.FILE_UPLOAD_DIR),
  filename(_req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`
    cb(null, fileName)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 },
})

router.use(authenticate)

router.post('/upload', upload.single('file'), asyncHandler(fileController.upload.bind(fileController)))
router.get('/', asyncHandler(fileController.list.bind(fileController)))

export default router
