
"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Type } from "lucide-react";

interface FontSelectorProps {
  onFontChange: (font: string) => void;
  onBoldChange: (isBold: boolean) => void;
  defaultFont?: string;
  defaultBold?: boolean;
}

const fonts = [
  { name: "Default", value: "Inter, sans-serif" },
  { name: "Serif", value: "Georgia, serif" },
  { name: "Classic", value: "'Times New Roman', serif" },
  { name: "Modern", value: "Lato, sans-serif" },
];

export default function FontSelector({ 
  onFontChange, 
  onBoldChange, 
  defaultFont = "Inter, sans-serif", 
  defaultBold = false 
}: FontSelectorProps) {
  const [font, setFont] = useState(defaultFont);
  const [isBold, setIsBold] = useState(defaultBold);

  const handleFontChange = (newFont: string) => {
    setFont(newFont);
    onFontChange(newFont);
  };
  
  const handleBoldChange = (checked: boolean) => {
    setIsBold(checked);
    onBoldChange(checked);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Type className="mr-2 h-4 w-4" />
          Font Style
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60 p-4">
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="font-family-select" className="font-semibold">Font Family</Label>
                <Select value={font} onValueChange={handleFontChange}>
                    <SelectTrigger id="font-family-select">
                        <SelectValue placeholder="Select a font" />
                    </SelectTrigger>
                    <SelectContent>
                        {fonts.map(f => (
                           <SelectItem key={f.value} value={f.value} style={{fontFamily: f.value}}>{f.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex items-center justify-between">
                <Label htmlFor="bold-toggle" className="font-semibold">Bold Text</Label>
                <Switch 
                  id="bold-toggle"
                  checked={isBold}
                  onCheckedChange={handleBoldChange}
                />
            </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
