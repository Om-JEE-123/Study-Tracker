import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { Save, RefreshCw, Database, Cpu, Shield, Download } from "lucide-react";

interface SettingsPanelProps {
  onSaveSettings?: (settings: SettingsData) => void;
  defaultSettings?: SettingsData;
}

interface SettingsData {
  performance: {
    gpuAcceleration: boolean;
    startWithSystem: boolean;
    minimizeToTray: boolean;
  };
  storage: {
    dataLocation: string;
    autoBackup: boolean;
    backupFrequency: string;
    backupLocation: string;
  };
  security: {
    lockWithPassword: boolean;
    encryptData: boolean;
  };
}

const defaultSettingsData: SettingsData = {
  performance: {
    gpuAcceleration: true,
    startWithSystem: true,
    minimizeToTray: true,
  },
  storage: {
    dataLocation: "C:\\Users\\AppData\\Roaming\\StudyTracker",
    autoBackup: false,
    backupFrequency: "weekly",
    backupLocation: "C:\\Users\\Documents\\StudyTrackerBackup",
  },
  security: {
    lockWithPassword: false,
    encryptData: false,
  },
};

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  onSaveSettings = () => {},
  defaultSettings = defaultSettingsData,
}) => {
  const [settings, setSettings] = useState<SettingsData>(defaultSettings);
  const [activeTab, setActiveTab] = useState("performance");
  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (
    category: keyof SettingsData,
    setting: string,
    value: any,
  ) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSaveSettings = () => {
    onSaveSettings(settings);
    setHasChanges(false);
  };

  const handleResetSettings = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
  };

  return (
    <Card className="w-full h-full bg-white">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold">
              Application Settings
            </CardTitle>
            <CardDescription>
              Configure performance, storage, and security options
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetSettings}
              disabled={!hasChanges}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button
              size="sm"
              onClick={handleSaveSettings}
              disabled={!hasChanges}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger
              value="performance"
              className="flex items-center relative z-10"
            >
              <Cpu className="h-4 w-4 mr-2" />
              Performance
            </TabsTrigger>
            <TabsTrigger
              value="storage"
              className="flex items-center relative z-10"
            >
              <Database className="h-4 w-4 mr-2" />
              Storage
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center relative z-10"
            >
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">GPU Acceleration</h3>
                  <p className="text-sm text-gray-500">
                    Use hardware acceleration for better performance
                  </p>
                </div>
                <Switch
                  checked={settings.performance.gpuAcceleration}
                  onCheckedChange={(checked) =>
                    handleSettingChange(
                      "performance",
                      "gpuAcceleration",
                      checked,
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Start with System</h3>
                  <p className="text-sm text-gray-500">
                    Launch application when your computer starts
                  </p>
                </div>
                <Switch
                  checked={settings.performance.startWithSystem}
                  onCheckedChange={(checked) =>
                    handleSettingChange(
                      "performance",
                      "startWithSystem",
                      checked,
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Minimize to Tray</h3>
                  <p className="text-sm text-gray-500">
                    Keep application running in system tray when closed
                  </p>
                </div>
                <Switch
                  checked={settings.performance.minimizeToTray}
                  onCheckedChange={(checked) =>
                    handleSettingChange(
                      "performance",
                      "minimizeToTray",
                      checked,
                    )
                  }
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="storage" className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Data Storage Location</h3>
                <div className="flex gap-2">
                  <Input
                    value={settings.storage.dataLocation}
                    onChange={(e) =>
                      handleSettingChange(
                        "storage",
                        "dataLocation",
                        e.target.value,
                      )
                    }
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm">
                    Browse...
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Default location where your study data is stored
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Automatic Backup</h3>
                  <p className="text-sm text-gray-500">
                    Regularly backup your study data
                  </p>
                </div>
                <Switch
                  checked={settings.storage.autoBackup}
                  onCheckedChange={(checked) =>
                    handleSettingChange("storage", "autoBackup", checked)
                  }
                />
              </div>

              {settings.storage.autoBackup && (
                <div className="pl-6 border-l-2 border-gray-100 space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Backup Frequency</h3>
                    <Select
                      value={settings.storage.backupFrequency}
                      onValueChange={(value) =>
                        handleSettingChange("storage", "backupFrequency", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Backup Location</h3>
                    <div className="flex gap-2">
                      <Input
                        value={settings.storage.backupLocation}
                        onChange={(e) =>
                          handleSettingChange(
                            "storage",
                            "backupLocation",
                            e.target.value,
                          )
                        }
                        className="flex-1"
                      />
                      <Button variant="outline" size="sm">
                        Browse...
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <Button variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Export All Data
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Lock with Password</h3>
                  <p className="text-sm text-gray-500">
                    Require password to access the application
                  </p>
                </div>
                <Switch
                  checked={settings.security.lockWithPassword}
                  onCheckedChange={(checked) =>
                    handleSettingChange("security", "lockWithPassword", checked)
                  }
                />
              </div>

              {settings.security.lockWithPassword && (
                <div className="pl-6 border-l-2 border-gray-100 space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Set Password</h3>
                    <Input type="password" placeholder="Enter password" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Confirm Password</h3>
                    <Input type="password" placeholder="Confirm password" />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Encrypt Study Data</h3>
                  <p className="text-sm text-gray-500">
                    Add an extra layer of security to your data
                  </p>
                </div>
                <Switch
                  checked={settings.security.encryptData}
                  onCheckedChange={(checked) =>
                    handleSettingChange("security", "encryptData", checked)
                  }
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SettingsPanel;
