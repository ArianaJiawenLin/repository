import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { type Category } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Plus, Menu, Projector } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import OntologyGraph from "@/components/ontology-graph";
import SpecificationSection from "@/components/specification-section";
import DatasetSection from "@/components/dataset-section";
import SolutionSection from "@/components/solution-section";

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (categoryData: { name: string; description: string; icon: string; specification: any }) => {
      const response = await apiRequest("POST", "/api/categories", categoryData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({
        title: "Success",
        description: "Category created successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-slate-600">Loading ontology repository...</p>
        </div>
      </div>
    );
  }

  const handleAddCategory = () => {
    // For demo, add a simple new category
    const newCategory = {
      name: "New Category",
      description: "A new ontology category",
      icon: "fas fa-folder",
      specification: {
        definition: "New category definition",
        coreConcepts: ["Concept 1", "Concept 2"],
        properties: ["property1", "property2"]
      }
    };
    createCategoryMutation.mutate(newCategory);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-inter text-slate-800">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <Projector className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">Ontology Repository</h1>
                <p className="text-sm text-slate-500">Research Platform</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="outline" size="sm" onClick={() => setSearchOpen(true)}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button size="sm" onClick={handleAddCategory} disabled={createCategoryMutation.isPending}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {categories && categories.length > 0 ? (
          <Tabs defaultValue={categories[0].id} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  <i className={`${category.icon} text-sm`} />
                  {category.name}
                  <Badge variant="secondary" className="ml-2">
                    {category.id === categories[0]?.id ? "12" : "8"}
                  </Badge>
                </TabsTrigger>
              ))}
              <TabsTrigger value="add-new" disabled className="opacity-50">
                <Plus className="h-4 w-4 mr-2" />
                Add New Category
              </TabsTrigger>
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Specification Section */}
                  <div className="lg:col-span-1">
                    <SpecificationSection category={category} />
                  </div>

                  {/* Graph Visualization */}
                  <div className="lg:col-span-2">
                    <OntologyGraph category={category} />
                  </div>
                </div>

                {/* Dataset and Solution Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                  <DatasetSection categoryId={category.id} />
                  <SolutionSection categoryId={category.id} />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-center py-12">
            <Projector className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No categories found</h3>
            <p className="text-slate-500 mb-4">Get started by creating your first ontology category.</p>
            <Button onClick={handleAddCategory} disabled={createCategoryMutation.isPending}>
              <Plus className="h-4 w-4 mr-2" />
              Create Category
            </Button>
          </div>
        )}
      </div>

      {/* Search Modal */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Search Ontology</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Input
                placeholder="Search concepts, properties, or instances..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
              <Search className="h-4 w-4 absolute left-3 top-3 text-slate-400" />
            </div>
            <div className="max-h-96 overflow-y-auto space-y-2">
              <div className="p-3 hover:bg-slate-50 rounded-lg cursor-pointer">
                <div className="font-medium text-sm">Screen Element</div>
                <div className="text-xs text-slate-500">Core concept in Screen Description</div>
              </div>
              <div className="p-3 hover:bg-slate-50 rounded-lg cursor-pointer">
                <div className="font-medium text-sm">Robot Agent</div>
                <div className="text-xs text-slate-500">Main entity in Robot Meet World</div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
