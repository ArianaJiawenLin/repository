import { type Category, type InsertCategory, type Dataset, type InsertDataset, type Solution, type InsertSolution } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: string): Promise<boolean>;

  // Datasets
  getDatasets(categoryId: string): Promise<Dataset[]>;
  getDataset(id: string): Promise<Dataset | undefined>;
  createDataset(dataset: InsertDataset): Promise<Dataset>;
  deleteDataset(id: string): Promise<boolean>;

  // Solutions
  getSolutions(categoryId: string): Promise<Solution[]>;
  getSolution(id: string): Promise<Solution | undefined>;
  createSolution(solution: InsertSolution): Promise<Solution>;
  updateSolution(id: string, solution: Partial<InsertSolution>): Promise<Solution | undefined>;
  deleteSolution(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private categories: Map<string, Category>;
  private datasets: Map<string, Dataset>;
  private solutions: Map<string, Solution>;

  constructor() {
    this.categories = new Map();
    this.datasets = new Map();
    this.solutions = new Map();
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Screen Description Category
    const screenDescId = randomUUID();
    const screenDescCategory: Category = {
      id: screenDescId,
      name: "Screen Description",
      description: "Screen description ontology focuses on the semantic representation of visual interface elements and their relationships within digital environments.",
      icon: "fas fa-desktop",
      specification: {
        definition: "Screen description ontology focuses on the semantic representation of visual interface elements and their relationships within digital environments.",
        coreConcepts: ["Visual Elements", "Layout Structure", "Interaction Patterns", "Accessibility"],
        properties: ["hasComponent", "containsElement", "hasPosition", "hasSize", "hasColor"]
      },
      createdAt: new Date()
    };
    this.categories.set(screenDescId, screenDescCategory);

    // Robot Meet World Category
    const robotId = randomUUID();
    const robotCategory: Category = {
      id: robotId,
      name: "Robot Meet World",
      description: "Robot Meet World ontology defines the semantic relationships between robotic systems and their physical environment interactions.",
      icon: "fas fa-robot",
      specification: {
        definition: "Robot Meet World ontology defines the semantic relationships between robotic systems and their physical environment interactions.",
        coreConcepts: ["Robot Agents", "Physical Objects", "Environment", "Actions", "Sensors"],
        properties: ["canPerform", "hasLocation", "interactsWith", "hasCapability", "observes"]
      },
      createdAt: new Date()
    };
    this.categories.set(robotId, robotCategory);

    // Default datasets
    const screenDataset1: Dataset = {
      id: randomUUID(),
      categoryId: screenDescId,
      name: "screen_elements.owl",
      filename: "screen_elements.owl",
      size: "2.4 MB",
      uploadedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
    };
    
    const screenDataset2: Dataset = {
      id: randomUUID(),
      categoryId: screenDescId,
      name: "ui_components.rdf",
      filename: "ui_components.rdf",
      size: "1.8 MB",
      uploadedAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
    };

    const robotDataset1: Dataset = {
      id: randomUUID(),
      categoryId: robotId,
      name: "robot_actions.owl",
      filename: "robot_actions.owl",
      size: "3.2 MB",
      uploadedAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
    };

    const robotDataset2: Dataset = {
      id: randomUUID(),
      categoryId: robotId,
      name: "environment_model.rdf",
      filename: "environment_model.rdf",
      size: "5.1 MB",
      uploadedAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
    };

    this.datasets.set(screenDataset1.id, screenDataset1);
    this.datasets.set(screenDataset2.id, screenDataset2);
    this.datasets.set(robotDataset1.id, robotDataset1);
    this.datasets.set(robotDataset2.id, robotDataset2);

    // Default solutions
    const screenSolution: Solution = {
      id: randomUUID(),
      categoryId: screenDescId,
      title: "SPARQL Query Example",
      language: "sparql",
      code: `# SPARQL Query Example
PREFIX ui: <http://example.org/ui#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>

SELECT ?element ?type ?position
WHERE {
  ?element rdf:type ?type .
  ?element ui:hasPosition ?position .
  FILTER(?type = ui:Button)
}`,
      type: "query"
    };

    const robotSolution: Solution = {
      id: randomUUID(),
      categoryId: robotId,
      title: "Robot Action Query",
      language: "sparql",
      code: `# Robot Action Query
PREFIX robot: <http://example.org/robot#>
PREFIX geo: <http://www.w3.org/2003/01/geo/wgs84_pos#>

SELECT ?robot ?action ?object
WHERE {
  ?robot robot:canPerform ?action .
  ?action robot:appliesTo ?object .
  ?robot geo:location ?location .
}`,
      type: "query"
    };

    this.solutions.set(screenSolution.id, screenSolution);
    this.solutions.set(robotSolution.id, robotSolution);
  }

  // Categories
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategory(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = {
      ...insertCategory,
      id,
      createdAt: new Date()
    };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(id: string, updateData: Partial<InsertCategory>): Promise<Category | undefined> {
    const category = this.categories.get(id);
    if (!category) return undefined;

    const updatedCategory = { ...category, ...updateData };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Datasets
  async getDatasets(categoryId: string): Promise<Dataset[]> {
    return Array.from(this.datasets.values()).filter(dataset => dataset.categoryId === categoryId);
  }

  async getDataset(id: string): Promise<Dataset | undefined> {
    return this.datasets.get(id);
  }

  async createDataset(insertDataset: InsertDataset): Promise<Dataset> {
    const id = randomUUID();
    const dataset: Dataset = {
      ...insertDataset,
      id,
      uploadedAt: new Date()
    };
    this.datasets.set(id, dataset);
    return dataset;
  }

  async deleteDataset(id: string): Promise<boolean> {
    return this.datasets.delete(id);
  }

  // Solutions
  async getSolutions(categoryId: string): Promise<Solution[]> {
    return Array.from(this.solutions.values()).filter(solution => solution.categoryId === categoryId);
  }

  async getSolution(id: string): Promise<Solution | undefined> {
    return this.solutions.get(id);
  }

  async createSolution(insertSolution: InsertSolution): Promise<Solution> {
    const id = randomUUID();
    const solution: Solution = {
      ...insertSolution,
      id
    };
    this.solutions.set(id, solution);
    return solution;
  }

  async updateSolution(id: string, updateData: Partial<InsertSolution>): Promise<Solution | undefined> {
    const solution = this.solutions.get(id);
    if (!solution) return undefined;

    const updatedSolution = { ...solution, ...updateData };
    this.solutions.set(id, updatedSolution);
    return updatedSolution;
  }

  async deleteSolution(id: string): Promise<boolean> {
    return this.solutions.delete(id);
  }
}

export const storage = new MemStorage();
