import { Router } from "express";
import { downloadLimiter } from "../Middlewares/securityMiddleware.js";
import documentController from "../Controllers/documentControllers.js";

const router = Router();

router.get("/", documentController.getAllDocuments);

router.get("/:filename", downloadLimiter, documentController.downloadDocument);

export default router;
