import { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, CloudUpload, Download, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { type Dataset } from "@shared/schema";

interface DatasetSectionProps {
  categoryId: string;
}

export default function DatasetSection({ categoryId }: DatasetSectionProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { data: datasets, isLoading } = useQuery<Dataset[]>({
    queryKey: ["/api/categories", categoryId, "datasets"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch(`/api/categories/${categoryId}/datasets`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories", categoryId, "datasets"] });
      toast({
        title: "Success",
        description: "Dataset uploaded successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload dataset",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (datasetId: string) => {
      const response = await fetch(`/api/datasets/${datasetId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Delete failed');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories", categoryId, "datasets"] });
      toast({
        title: "Success",
        description: "Dataset deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete dataset",
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      uploadMutation.mutate(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Updated less than an hour ago";
    if (diffInHours === 1) return "Updated 1 hour ago";
    if (diffInHours < 24) return `Updated ${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return "Updated 1 day ago";
    return `Updated ${diffInDays} days ago`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <i className="fas fa-database text-primary" />
            Dataset
          </CardTitle>
          <Button size="sm" onClick={handleUploadClick} disabled={uploadMutation.isPending}>
            <Upload className="h-3 w-3 mr-1" />
            Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* File Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer ${
            isDragOver ? "border-primary/50 bg-primary/5" : "border-slate-300 hover:border-primary/50"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleUploadClick}
        >
          <div className="text-center">
            <CloudUpload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm text-slate-600 mb-1">Drop files here or click to upload</p>
            <p className="text-xs text-slate-400">Supports: .owl, .rdf, .ttl, .json-ld</p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept=".owl,.rdf,.ttl,.json-ld,.jsonld"
          onChange={(e) => handleFileSelect(e.target.files)}
        />

        {/* Dataset Files */}
        {isLoading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : datasets && datasets.length > 0 ? (
          <div className="space-y-3">
            {datasets.map((dataset) => (
              <div key={dataset.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <i className="fas fa-file-alt text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">{dataset.name}</p>
                    <p className="text-xs text-slate-500">
                      {dataset.size} • {formatTimeAgo(dataset.uploadedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" className="p-1 h-auto">
                    <Download className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-1 h-auto text-red-500 hover:text-red-700"
                    onClick={() => deleteMutation.mutate(dataset.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-slate-500">
            <p className="text-sm">No datasets uploaded yet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
