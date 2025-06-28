"use client";

import { Paintbrush } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const colors = [
  { name: "Blue", hsl: "210 67% 53%" },
  { name: "Green", hsl: "142 76% 36%" },
  { name: "Purple", hsl: "262 83% 58%" },
  { name: "Orange", hsl: "25 95% 53%" },
  { name: "Slate", hsl: "215 28% 47%" },
  { name: "Red", hsl: "0 72% 51%" },
];

export default function ThemeCustomizer() {
  const { toast } = useToast();

  const handleColorChange = (hsl: string, name: string) => {
    document.documentElement.style.setProperty("--primary", hsl);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Paintbrush className="mr-2 h-4 w-4" />
          Color
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="space-y-2">
            <Label className="font-semibold">Accent Color</Label>
            <div className="flex items-center gap-2 pt-2">
            {colors.map((color) => (
                <button
                    key={color.name}
                    onClick={() => handleColorChange(color.hsl, color.name)}
                    className="h-8 w-8 rounded-full border-2 border-transparent transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    style={{ backgroundColor: `hsl(${color.hsl})` }}
                    aria-label={`Set color to ${color.name}`}
                />
            ))}
            </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
