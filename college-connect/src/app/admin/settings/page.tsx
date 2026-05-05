import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">Platform Settings</h2>
        <p className="text-gray-400">Manage global configurations for College Connect.</p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="bg-gray-800 border-gray-700">
          <TabsTrigger value="general" className="data-[state=active]:bg-gray-700 data-[state=active]:text-slate-900 dark:text-white">General</TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-gray-700 data-[state=active]:text-slate-900 dark:text-white">Security</TabsTrigger>
          <TabsTrigger value="ml" className="data-[state=active]:bg-gray-700 data-[state=active]:text-slate-900 dark:text-white">ML Engine</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card className="bg-gray-800 border-gray-700 text-slate-900 dark:text-white">
            <CardHeader>
              <CardTitle className="text-xl text-gray-200">Site Information</CardTitle>
              <CardDescription className="text-gray-400">Basic details about the platform.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="siteName" className="text-gray-300">Site Name</Label>
                <Input id="siteName" defaultValue="College Connect" className="bg-gray-900 border-gray-700 text-slate-900 dark:text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportEmail" className="text-gray-300">Support Email</Label>
                <Input id="supportEmail" type="email" defaultValue="support@collegeconnect.edu" className="bg-gray-900 border-gray-700 text-slate-900 dark:text-white" />
              </div>
              <div className="flex items-center justify-between border border-gray-700 p-4 rounded-lg bg-gray-900/50">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium text-gray-200">Maintenance Mode</Label>
                  <p className="text-sm text-gray-400">Disable access for standard users.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
           <Card className="bg-gray-800 border-gray-700 text-slate-900 dark:text-white">
            <CardHeader>
              <CardTitle className="text-xl text-gray-200">Authentication</CardTitle>
              <CardDescription className="text-gray-400">Configure how users log in.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center justify-between border border-gray-700 p-4 rounded-lg bg-gray-900/50">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium text-gray-200">Require Email Verification</Label>
                  <p className="text-sm text-gray-400">Users must verify their college email address.</p>
                </div>
                <Switch defaultChecked />
              </div>
               <div className="flex items-center justify-between border border-gray-700 p-4 rounded-lg bg-gray-900/50">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium text-gray-200">Allow Registration</Label>
                  <p className="text-sm text-gray-400">Enable new users to sign up.</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ml" className="space-y-4">
           <Card className="bg-gray-800 border-gray-700 text-slate-900 dark:text-white">
            <CardHeader>
              <CardTitle className="text-xl text-gray-200">Recommendation Engine</CardTitle>
              <CardDescription className="text-gray-400">Configure connection to the FastAPI backend.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mlEndpoint" className="text-gray-300">Backend API URL</Label>
                <Input id="mlEndpoint" defaultValue="http://localhost:8000" className="bg-gray-900 border-gray-700 text-slate-900 dark:text-white font-mono text-sm" />
              </div>
              <div className="flex items-center gap-2 pt-2">
                 <div className="w-2 h-2 rounded-full bg-green-500"></div>
                 <span className="text-sm text-gray-400">Engine Online</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end pt-4">
        <Button className="bg-blue-600 hover:bg-blue-700 text-slate-900 dark:text-white">
          Save Changes
        </Button>
      </div>
    </div>
  );
}
