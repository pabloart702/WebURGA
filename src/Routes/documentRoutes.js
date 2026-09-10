import { Router } from "express";
import { downloadLimiter } from "../Middlewares/rateLimitMiddleware.js";
import documentController from "../Controllers/documentControllers.js";

const router = Router();

// Returns the list of all available documents
router.get("/", documentController.getAllDocuments);

// Downloads a specific document with rate limiting applied
router.get("/:filename", downloadLimiter, documentController.downloadDocument);

export default router;
