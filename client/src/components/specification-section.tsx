import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit } from "lucide-react";
import { type Category } from "@shared/schema";

interface SpecificationSectionProps {
  category: Category;
}

export default function SpecificationSection({ category }: SpecificationSectionProps) {
  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <i className="fas fa-clipboard-list text-primary" />
            Specification
          </CardTitle>
          <Button variant="ghost" size="sm">
            <Edit className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium text-slate-700 mb-2">Definition</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            {category.specification.definition}
          </p>
        </div>
        
        <div>
          <h3 className="font-medium text-slate-700 mb-2">Core Concepts</h3>
          <div className="flex flex-wrap gap-2">
            {category.specification.coreConcepts.map((concept, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {concept}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="font-medium text-slate-700 mb-2">Properties</h3>
          <ul className="text-sm text-slate-600 space-y-1">
            {category.specification.properties.map((property, index) => (
              <li key={index}>• {property}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
