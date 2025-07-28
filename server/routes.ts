import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCategorySchema, insertDatasetSchema, insertSolutionSchema } from "@shared/schema";
import multer from "multer";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.owl', '.rdf', '.ttl', '.json-ld', '.jsonld'];
    const ext = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only OWL, RDF, TTL, and JSON-LD files are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.get("/api/categories/:id", async (req, res) => {
    try {
      const category = await storage.getCategory(req.params.id);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      res.status(201).json(category);
    } catch (error) {
      res.status(400).json({ message: "Invalid category data" });
    }
  });

  app.put("/api/categories/:id", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.partial().parse(req.body);
      const category = await storage.updateCategory(req.params.id, validatedData);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(400).json({ message: "Invalid category data" });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteCategory(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Datasets
  app.get("/api/categories/:categoryId/datasets", async (req, res) => {
    try {
      const datasets = await storage.getDatasets(req.params.categoryId);
      res.json(datasets);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch datasets" });
    }
  });

  app.post("/api/categories/:categoryId/datasets", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const sizeInMB = (req.file.size / (1024 * 1024)).toFixed(1);
      const datasetData = {
        categoryId: req.params.categoryId,
        name: req.file.originalname,
        filename: req.file.originalname,
        size: `${sizeInMB} MB`
      };

      const validatedData = insertDatasetSchema.parse(datasetData);
      const dataset = await storage.createDataset(validatedData);
      res.status(201).json(dataset);
    } catch (error) {
      res.status(400).json({ message: "Failed to upload dataset" });
    }
  });

  app.delete("/api/datasets/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteDataset(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Dataset not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete dataset" });
    }
  });

  // Solutions
  app.get("/api/categories/:categoryId/solutions", async (req, res) => {
    try {
      const solutions = await storage.getSolutions(req.params.categoryId);
      res.json(solutions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch solutions" });
    }
  });

  app.post("/api/categories/:categoryId/solutions", async (req, res) => {
    try {
      const solutionData = {
        ...req.body,
        categoryId: req.params.categoryId
      };
      const validatedData = insertSolutionSchema.parse(solutionData);
      const solution = await storage.createSolution(validatedData);
      res.status(201).json(solution);
    } catch (error) {
      res.status(400).json({ message: "Invalid solution data" });
    }
  });

  app.put("/api/solutions/:id", async (req, res) => {
    try {
      const validatedData = insertSolutionSchema.partial().parse(req.body);
      const solution = await storage.updateSolution(req.params.id, validatedData);
      if (!solution) {
        return res.status(404).json({ message: "Solution not found" });
      }
      res.json(solution);
    } catch (error) {
      res.status(400).json({ message: "Invalid solution data" });
    }
  });

  app.delete("/api/solutions/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteSolution(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Solution not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete solution" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
