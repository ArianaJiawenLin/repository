import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Maximize2, Download, ZoomIn, ZoomOut, Minimize2 } from "lucide-react";
import { type Category } from "@shared/schema";

interface OntologyGraphProps {
  category: Category;
}

export default function OntologyGraph({ category }: OntologyGraphProps) {
  const isScreenDescription = category.name === "Screen Description";
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <i className="fas fa-project-diagram text-primary" />
            Ontology Graph
          </CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Maximize2 className="h-3 w-3 mr-1" />
              Fullscreen
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative bg-slate-50 rounded-lg border-2 border-dashed border-slate-300 p-8 h-96">
          {/* Graph Visualization */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-4">
              {/* Central Node */}
              <div className="relative mx-auto w-32 h-16 bg-primary text-white rounded-lg flex items-center justify-center font-medium text-sm">
                {isScreenDescription ? "Screen Element" : "Robot Agent"}
              </div>
              
              {/* Connected Nodes */}
              <div className="flex justify-center space-x-6 mt-8">
                {isScreenDescription ? (
                  <>
                    <div className="w-20 h-12 bg-accent text-white rounded-lg flex items-center justify-center text-xs">
                      Button
                    </div>
                    <div className="w-20 h-12 bg-accent text-white rounded-lg flex items-center justify-center text-xs">
                      Input
                    </div>
                    <div className="w-20 h-12 bg-accent text-white rounded-lg flex items-center justify-center text-xs">
                      Image
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-20 h-12 bg-orange-500 text-white rounded-lg flex items-center justify-center text-xs">
                      Sensor
                    </div>
                    <div className="w-20 h-12 bg-purple-500 text-white rounded-lg flex items-center justify-center text-xs">
                      Action
                    </div>
                    <div className="w-20 h-12 bg-green-500 text-white rounded-lg flex items-center justify-center text-xs">
                      Object
                    </div>
                    <div className="w-20 h-12 bg-red-500 text-white rounded-lg flex items-center justify-center text-xs">
                      Space
                    </div>
                  </>
                )}
              </div>
              
              {/* Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: -1 }}>
                {isScreenDescription ? (
                  <>
                    <line x1="50%" y1="40%" x2="25%" y2="70%" stroke="#64748b" strokeWidth="2"/>
                    <line x1="50%" y1="40%" x2="50%" y2="70%" stroke="#64748b" strokeWidth="2"/>
                    <line x1="50%" y1="40%" x2="75%" y2="70%" stroke="#64748b" strokeWidth="2"/>
                  </>
                ) : (
                  <>
                    <line x1="50%" y1="40%" x2="20%" y2="70%" stroke="#64748b" strokeWidth="2"/>
                    <line x1="50%" y1="40%" x2="40%" y2="70%" stroke="#64748b" strokeWidth="2"/>
                    <line x1="50%" y1="40%" x2="60%" y2="70%" stroke="#64748b" strokeWidth="2"/>
                    <line x1="50%" y1="40%" x2="80%" y2="70%" stroke="#64748b" strokeWidth="2"/>
                  </>
                )}
              </svg>
            </div>
          </div>
          
          {/* Graph Controls */}
          <div className="absolute top-4 right-4 bg-white rounded-lg shadow-sm border border-slate-200 p-2">
            <div className="flex space-x-1">
              <Button variant="ghost" size="sm" className="p-1 h-auto">
                <ZoomIn className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1 h-auto">
                <ZoomOut className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="sm" className="p-1 h-auto">
                <Minimize2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
