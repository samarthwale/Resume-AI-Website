"use client";

import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Text } from "lucide-react";

interface FontSizerProps {
  onSizeChange: (size: number) => void;
  defaultValue?: number;
}

export default function FontSizer({ onSizeChange, defaultValue = 14 }: FontSizerProps) {
  const [size, setSize] = useState(defaultValue);

  const handleSizeChange = (newSize: number[]) => {
    setSize(newSize[0]);
    onSizeChange(newSize[0]);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Text className="mr-2 h-4 w-4" />
          Font Size
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-4">
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Label htmlFor="font-size-slider" className="font-semibold">Adjust Font Size</Label>
                <span className="text-sm font-medium">{size}px</span>
            </div>
            <Slider
                id="font-size-slider"
                defaultValue={[size]}
                min={12}
                max={18}
                step={1}
                onValueChange={handleSizeChange}
              />
        </div>
      </PopoverContent>
    </Popover>
  );
}
