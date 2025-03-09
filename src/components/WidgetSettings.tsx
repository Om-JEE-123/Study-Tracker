import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { EyeOff, Move, Palette, Settings } from "lucide-react";

interface WidgetSettingsProps {
  opacity?: number;
  clickThrough?: boolean;
  edgeSnapping?: boolean;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  theme?: "light" | "dark" | "system";
  accentColor?: string;
  onSettingsChange?: (settings: any) => void;
}

const WidgetSettings: React.FC<WidgetSettingsProps> = ({
  opacity = 0.8,
  clickThrough = false,
  edgeSnapping = true,
  position = { x: 20, y: 20 },
  size = { width: 200, height: 100 },
  theme = "system",
  accentColor = "#8884d8",
  onSettingsChange = () => {},
}) => {
  const [currentOpacity, setCurrentOpacity] = useState(opacity);
  const [currentClickThrough, setCurrentClickThrough] = useState(clickThrough);
  const [currentEdgeSnapping, setCurrentEdgeSnapping] = useState(edgeSnapping);
  const [currentTheme, setCurrentTheme] = useState(theme);
  const [currentAccentColor, setCurrentAccentColor] = useState(accentColor);
  const [currentSize, setCurrentSize] = useState(size);

  const handleOpacityChange = (value: number[]) => {
    const newOpacity = value[0];
    setCurrentOpacity(newOpacity);
    onSettingsChange({ ...getSettings(), opacity: newOpacity });
  };

  const handleClickThroughChange = (checked: boolean) => {
    setCurrentClickThrough(checked);
    onSettingsChange({ ...getSettings(), clickThrough: checked });
  };

  const handleEdgeSnappingChange = (checked: boolean) => {
    setCurrentEdgeSnapping(checked);
    onSettingsChange({ ...getSettings(), edgeSnapping: checked });
  };

  const handleThemeChange = (value: string) => {
    setCurrentTheme(value as "light" | "dark" | "system");
    onSettingsChange({
      ...getSettings(),
      theme: value as "light" | "dark" | "system",
    });
  };

  const handleAccentColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentAccentColor(e.target.value);
    onSettingsChange({ ...getSettings(), accentColor: e.target.value });
  };

  const handleSizeChange = (dimension: "width" | "height", value: string) => {
    const numValue = parseInt(value) || 0;
    const newSize = { ...currentSize, [dimension]: numValue };
    setCurrentSize(newSize);
    onSettingsChange({ ...getSettings(), size: newSize });
  };

  const getSettings = () => {
    return {
      opacity: currentOpacity,
      clickThrough: currentClickThrough,
      edgeSnapping: currentEdgeSnapping,
      position,
      size: currentSize,
      theme: currentTheme,
      accentColor: currentAccentColor,
    };
  };

  const resetToDefaults = () => {
    setCurrentOpacity(0.8);
    setCurrentClickThrough(false);
    setCurrentEdgeSnapping(true);
    setCurrentTheme("system");
    setCurrentAccentColor("#8884d8");
    setCurrentSize({ width: 200, height: 100 });
    onSettingsChange({
      opacity: 0.8,
      clickThrough: false,
      edgeSnapping: true,
      position: { x: 20, y: 20 },
      size: { width: 200, height: 100 },
      theme: "system",
      accentColor: "#8884d8",
    });
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings size={18} />
          Widget Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="appearance" className="relative z-10">
              <Palette size={16} className="mr-2" /> Appearance
            </TabsTrigger>
            <TabsTrigger value="behavior" className="relative z-10">
              <Move size={16} className="mr-2" /> Behavior
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="opacity">
                  Widget Opacity: {Math.round(currentOpacity * 100)}%
                </Label>
                <Slider
                  id="opacity"
                  min={0.1}
                  max={1}
                  step={0.05}
                  value={[currentOpacity]}
                  onValueChange={handleOpacityChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select value={currentTheme} onValueChange={handleThemeChange}>
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accent-color">Accent Color</Label>
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full border"
                    style={{ backgroundColor: currentAccentColor }}
                  />
                  <Input
                    id="accent-color"
                    type="color"
                    value={currentAccentColor}
                    onChange={handleAccentColorChange}
                    className="w-24 h-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="width">Width (px)</Label>
                  <Input
                    id="width"
                    type="number"
                    min={100}
                    max={500}
                    value={currentSize.width}
                    onChange={(e) => handleSizeChange("width", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (px)</Label>
                  <Input
                    id="height"
                    type="number"
                    min={50}
                    max={300}
                    value={currentSize.height}
                    onChange={(e) => handleSizeChange("height", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="click-through">Click-Through</Label>
                  <p className="text-sm text-gray-500">
                    Allow clicks to pass through the widget
                  </p>
                </div>
                <Switch
                  id="click-through"
                  checked={currentClickThrough}
                  onCheckedChange={handleClickThroughChange}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="edge-snapping">Edge Snapping</Label>
                  <p className="text-sm text-gray-500">
                    Automatically snap widget to screen edges
                  </p>
                </div>
                <Switch
                  id="edge-snapping"
                  checked={currentEdgeSnapping}
                  onCheckedChange={handleEdgeSnappingChange}
                />
              </div>

              <div className="pt-4">
                <p className="text-sm text-gray-500 mb-2">
                  <EyeOff size={16} className="inline mr-1" />
                  Widget will automatically hide when inactive for 5 seconds
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between mt-6 pt-4 border-t">
          <Button variant="outline" onClick={resetToDefaults}>
            Reset to Defaults
          </Button>
          <Button onClick={() => onSettingsChange(getSettings())}>
            Apply Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WidgetSettings;
