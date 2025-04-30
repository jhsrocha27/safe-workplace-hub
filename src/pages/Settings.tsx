
import React, { useState } from 'react';
import { useCompanyInfo } from '@/hooks/use-company-info';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, User, Bell, Shield, Lock, Building, FileText, Users } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Define employee interface to ensure type safety
interface Employee {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  position: string;
  department: string;
  status: string;
}

const Settings = () => {
  const { companyInfo, setCompanyInfo } = useCompanyInfo();

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    accidents: true,
    inspections: true,
    trainings: true,
    documents: true
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    passwordExpiry: "90",
    minPasswordLength: "8",
    requireSpecialChars: true
  });

  const [theme, setTheme] = useState("light");

  const [integrationsEnabled, setIntegrationsEnabled] = useState({
    email: true,
    calendar: true,
    sms: false,
    erp: false
  });

  const [logLevel, setLogLevel] = useState("warning");

  // State for employee management with the proper interface
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, name: "João Silva", position: "Engenheiro de Segurança", department: "Engenharia", status: "Ativo" },
    { id: 2, name: "Maria Oliveira", position: "Técnico de Segurança", department: "Operações", status: "Ativo" },
    { id: 3, name: "Carlos Pereira", position: "Técnico de Segurança", department: "Operações", status: "Férias" }
  ]);
  
  const [openEmployeeDialog, setOpenEmployeeDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);

  // Form schema for employee registration
  const employeeFormSchema = z.object({
    name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
    email: z.string().email({ message: "Email inválido" }),
    phone: z.string().min(8, { message: "Telefone inválido" }),
    position: z.string().min(2, { message: "Cargo é obrigatório" }),
    department: z.string().min(2, { message: "Departamento é obrigatório" }),
    status: z.string().min(1, { message: "Status é obrigatório" }),
  });

  // Initialize form
  const employeeForm = useForm<z.infer<typeof employeeFormSchema>>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      position: "",
      department: "",
      status: "Ativo",
    },
  });

  const handleSaveCompanyInfo = () => {
    toast({
      title: "Informações da empresa atualizadas",
      description: "As informações da empresa foram atualizadas com sucesso.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Configurações de notificação atualizadas",
      description: "Suas preferências de notificação foram atualizadas com sucesso.",
    });
  };

  const handleSaveSecurity = () => {
    toast({
      title: "Configurações de segurança atualizadas",
      description: "Suas configurações de segurança foram atualizadas com sucesso.",
    });
  };

  const handleSaveAppearance = () => {
    toast({
      title: "Aparência atualizada",
      description: `Tema alterado para ${theme === 'light' ? 'claro' : 'escuro'}.`,
    });
  };

  const handleSaveIntegrations = () => {
    toast({
      title: "Integrações atualizadas",
      description: "Suas configurações de integrações foram atualizadas com sucesso.",
    });
  };

  const handleSaveAdvanced = () => {
    toast({
      title: "Configurações avançadas atualizadas",
      description: "Suas configurações avançadas foram atualizadas com sucesso.",
    });
  };

  // Function to add or edit employee
  const onEmployeeSubmit = (data: z.infer<typeof employeeFormSchema>) => {
    if (isEditMode && currentEmployee) {
      // Edit existing employee - ensure all required properties are included
      const updatedEmployees = employees.map(emp => 
        emp.id === currentEmployee.id ? { ...emp, ...data } : emp
      );
      setEmployees(updatedEmployees);
      toast({
        title: "Funcionário atualizado",
        description: "Informações do funcionário atualizadas com sucesso.",
      });
    } else {
      // Add new employee - ensure all required properties are included
      const newEmployee: Employee = {
        id: employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1,
        name: data.name,
        email: data.email,
        phone: data.phone,
        position: data.position,
        department: data.department,
        status: data.status
      };
      setEmployees([...employees, newEmployee]);
      toast({
        title: "Funcionário adicionado",
        description: "Novo funcionário cadastrado com sucesso.",
      });
    }
    
    // Reset and close form
    setOpenEmployeeDialog(false);
    setIsEditMode(false);
    setCurrentEmployee(null);
    employeeForm.reset();
  };

  // Function to open form for editing an employee
  const handleEditEmployee = (employee: Employee) => {
    setIsEditMode(true);
    setCurrentEmployee(employee);
    employeeForm.reset({
      name: employee.name,
      email: employee.email || "",
      phone: employee.phone || "",
      position: employee.position,
      department: employee.department,
      status: employee.status,
    });
    setOpenEmployeeDialog(true);
  };

  // Function to delete an employee
  const handleDeleteEmployee = (id: number) => {
    setEmployees(employees.filter(emp => emp.id !== id));
    toast({
      title: "Funcionário removido",
      description: "Funcionário removido com sucesso.",
    });
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Configurações</h1>
          <p className="text-muted-foreground">
            Gerencie as configurações do sistema SafeWork
          </p>
        </div>
      </div>

      <Tabs defaultValue="empresa" className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-7 mb-8">
          <TabsTrigger value="empresa">
            <Building className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Empresa</span>
          </TabsTrigger>
          <TabsTrigger value="notificacoes">
            <Bell className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="seguranca">
            <Lock className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Segurança</span>
          </TabsTrigger>
          <TabsTrigger value="aparencia">
            <User className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Aparência</span>
          </TabsTrigger>
          <TabsTrigger value="integracoes">
            <Shield className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Integrações</span>
          </TabsTrigger>
          <TabsTrigger value="funcionarios">
            <Users className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Funcionários</span>
          </TabsTrigger>
          <TabsTrigger value="avancado">
            <FileText className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Avançado</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="empresa">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Empresa</CardTitle>
              <CardDescription>
                Gerencie as informações básicas da sua empresa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company-name">Nome da Empresa</Label>
                  <Input 
                    id="company-name" 
                    value={companyInfo.name}
                    onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-cnpj">CNPJ</Label>
                  <Input 
                    id="company-cnpj" 
                    value={companyInfo.cnpj}
                    onChange={(e) => setCompanyInfo({...companyInfo, cnpj: e.target.value})}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="company-address">Endereço</Label>
                  <Input 
                    id="company-address" 
                    value={companyInfo.address}
                    onChange={(e) => setCompanyInfo({...companyInfo, address: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-phone">Telefone</Label>
                  <Input 
                    id="company-phone" 
                    value={companyInfo.phone}
                    onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-email">Email</Label>
                  <Input 
                    id="company-email" 
                    value={companyInfo.email}
                    onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company-website">Website</Label>
                  <Input 
                    id="company-website" 
                    value={companyInfo.website}
                    onChange={(e) => setCompanyInfo({...companyInfo, website: e.target.value})}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveCompanyInfo}>Salvar Alterações</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>
                Configure como e quando deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Canais de Notificação</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="email-notifications"
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                    />
                    <Label htmlFor="email-notifications">Notificações por Email</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="sms-notifications"
                      checked={notifications.sms}
                      onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
                    />
                    <Label htmlFor="sms-notifications">Notificações por SMS</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="push-notifications"
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
                    />
                    <Label htmlFor="push-notifications">Notificações Push</Label>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-2">Tipos de Notificação</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="accident-notifications" 
                      checked={notifications.accidents}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, accidents: checked === true})}
                    />
                    <Label htmlFor="accident-notifications">Acidentes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="inspection-notifications"
                      checked={notifications.inspections}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, inspections: checked === true})}
                    />
                    <Label htmlFor="inspection-notifications">Inspeções</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="training-notifications"
                      checked={notifications.trainings}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, trainings: checked === true})}
                    />
                    <Label htmlFor="training-notifications">Treinamentos</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="document-notifications"
                      checked={notifications.documents}
                      onCheckedChange={(checked) => 
                        setNotifications({...notifications, documents: checked === true})}
                    />
                    <Label htmlFor="document-notifications">Documentos</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications}>Salvar Preferências</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="seguranca">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
              <CardDescription>
                Configure as opções de segurança e autenticação
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="two-factor"
                  checked={securitySettings.twoFactor}
                  onCheckedChange={(checked) => setSecuritySettings({...securitySettings, twoFactor: checked})}
                />
                <div>
                  <Label htmlFor="two-factor">Autenticação em Dois Fatores</Label>
                  <p className="text-sm text-muted-foreground">
                    Adicione uma camada extra de segurança à sua conta
                  </p>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Política de Senhas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password-expiry">Expiração de Senha (dias)</Label>
                    <Input 
                      id="password-expiry"
                      type="number"
                      value={securitySettings.passwordExpiry}
                      onChange={(e) => setSecuritySettings({...securitySettings, passwordExpiry: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="min-password">Comprimento Mínimo da Senha</Label>
                    <Input 
                      id="min-password"
                      type="number"
                      value={securitySettings.minPasswordLength}
                      onChange={(e) => setSecuritySettings({...securitySettings, minPasswordLength: e.target.value})}
                    />
                  </div>
                  <div className="flex items-center space-x-2 md:col-span-2">
                    <Checkbox 
                      id="special-chars"
                      checked={securitySettings.requireSpecialChars}
                      onCheckedChange={(checked) => 
                        setSecuritySettings({...securitySettings, requireSpecialChars: checked === true})}
                    />
                    <Label htmlFor="special-chars">Exigir caracteres especiais na senha</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSecurity}>Salvar Configurações</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="aparencia">
          <Card>
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
              <CardDescription>
                Personalize a aparência da sua interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tema</Label>
                <div className="flex space-x-2">
                  <Button 
                    variant={theme === "light" ? "default" : "outline"} 
                    onClick={() => setTheme("light")}
                    className="flex-1"
                  >
                    Claro
                  </Button>
                  <Button 
                    variant={theme === "dark" ? "default" : "outline"}
                    onClick={() => setTheme("dark")}
                    className="flex-1"
                  >
                    Escuro
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveAppearance}>Salvar Preferências</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="integracoes">
          <Card>
            <CardHeader>
              <CardTitle>Integrações</CardTitle>
              <CardDescription>
                Gerencie as integrações com outros sistemas e serviços
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      <h3 className="font-medium">Servidor de Email</h3>
                    </div>
                    <Badge variant={integrationsEnabled.email ? "default" : "outline"}>
                      {integrationsEnabled.email ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Integração com servidor SMTP para envio de notificações por email
                  </p>
                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm">Configurar</Button>
                    <Switch 
                      checked={integrationsEnabled.email}
                      onCheckedChange={(checked) => 
                        setIntegrationsEnabled({...integrationsEnabled, email: checked})}
                    />
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      <h3 className="font-medium">Google Calendar</h3>
                    </div>
                    <Badge variant={integrationsEnabled.calendar ? "default" : "outline"}>
                      {integrationsEnabled.calendar ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Sincronize eventos e lembretes com o Google Calendar
                  </p>
                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm">Configurar</Button>
                    <Switch 
                      checked={integrationsEnabled.calendar}
                      onCheckedChange={(checked) => 
                        setIntegrationsEnabled({...integrationsEnabled, calendar: checked})}
                    />
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5" />
                      <h3 className="font-medium">SMS Gateway</h3>
                    </div>
                    <Badge variant={integrationsEnabled.sms ? "default" : "outline"}>
                      {integrationsEnabled.sms ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Integração para envio de notificações via SMS
                  </p>
                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm">Configurar</Button>
                    <Switch 
                      checked={integrationsEnabled.sms}
                      onCheckedChange={(checked) => 
                        setIntegrationsEnabled({...integrationsEnabled, sms: checked})}
                    />
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <Building className="h-5 w-5" />
                      <h3 className="font-medium">Sistema ERP</h3>
                    </div>
                    <Badge variant={integrationsEnabled.erp ? "default" : "outline"}>
                      {integrationsEnabled.erp ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Integre com seu sistema ERP para sincronizar dados
                  </p>
                  <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm">Configurar</Button>
                    <Switch 
                      checked={integrationsEnabled.erp}
                      onCheckedChange={(checked) => 
                        setIntegrationsEnabled({...integrationsEnabled, erp: checked})}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveIntegrations}>Salvar Integrações</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="funcionarios">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Cadastro de Funcionários</CardTitle>
                <CardDescription>
                  Gerencie os funcionários da sua empresa
                </CardDescription>
              </div>
              <Dialog open={openEmployeeDialog} onOpenChange={setOpenEmployeeDialog}>
                <DialogTrigger asChild>
                  <Button 
                    onClick={() => {
                      setIsEditMode(false);
                      setCurrentEmployee(null);
                      employeeForm.reset({
                        name: "",
                        email: "",
                        phone: "",
                        position: "",
                        department: "",
                        status: "Ativo",
                      });
                    }}
                  >
                    Adicionar Funcionário
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>{isEditMode ? "Editar Funcionário" : "Adicionar Funcionário"}</DialogTitle>
                    <DialogDescription>
                      {isEditMode 
                        ? "Edite as informações do funcionário nos campos abaixo."
                        : "Preencha os dados do novo funcionário nos campos abaixo."}
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...employeeForm}>
                    <form onSubmit={employeeForm.handleSubmit(onEmployeeSubmit)} className="space-y-4">
                      <FormField
                        control={employeeForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome do funcionário" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={employeeForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="Email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={employeeForm.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telefone</FormLabel>
                              <FormControl>
                                <Input placeholder="Telefone" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={employeeForm.control}
                          name="position"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cargo</FormLabel>
                              <FormControl>
                                <Input placeholder="Cargo" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={employeeForm.control}
                          name="department"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Departamento</FormLabel>
                              <FormControl>
                                <Input placeholder="Departamento" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={employeeForm.control}
                        name="status"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione o status" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Ativo">Ativo</SelectItem>
                                <SelectItem value="Inativo">Inativo</SelectItem>
                                <SelectItem value="Férias">Férias</SelectItem>
                                <SelectItem value="Licença">Licença</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <Button type="submit">{isEditMode ? "Salvar Alterações" : "Cadastrar Funcionário"}</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-medium">Nome</TableHead>
                      <TableHead className="font-medium">Cargo</TableHead>
                      <TableHead className="font-medium">Departamento</TableHead>
                      <TableHead className="font-medium">Status</TableHead>
                      <TableHead className="font-medium text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>{employee.name}</TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>
                          <Badge variant={employee.status === "Ativo" ? "default" : "outline"}>
                            {employee.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditEmployee(employee)}
                          >
                            Editar
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleDeleteEmployee(employee.id)}
                          >
                            Excluir
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {employees.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          Nenhum funcionário cadastrado.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="avancado">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Avançadas</CardTitle>
              <CardDescription>
                Configure opções avançadas do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="log-level">Nível de Log</Label>
                <Select 
                  value={logLevel}
                  onValueChange={(value) => setLogLevel(value)}
                >
                  <SelectTrigger id="log-level" className="w-full">
                    <SelectValue placeholder="Selecione o nível de log" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="error">Apenas Erros</SelectItem>
                    <SelectItem value="warning">Avisos e Erros</SelectItem>
                    <SelectItem value="info">Informações</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-css">CSS Personalizado</Label>
                <Textarea 
                  id="custom-css" 
                  placeholder="Insira CSS personalizado aqui" 
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">Redefinir Sistema</h3>
                <p className="text-sm text-muted-foreground">
                  Cuidado: Estas ações são irreversíveis
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline">Limpar Cache</Button>
                  <Button variant="destructive">Redefinir para Padrões</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveAdvanced}>Salvar Configurações</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
