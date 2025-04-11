
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

// NR options with descriptions
const nrOptions = [
  { id: "nr-01", label: "NR-01", title: "Disposições Gerais", description: "Estabelece o campo de aplicação de todas as NRs" },
  { id: "nr-02", label: "NR-02", title: "Inspeção Prévia", description: "Estabelece requisitos técnicos para inspeção prévia" },
  { id: "nr-03", label: "NR-03", title: "Embargo ou Interdição", description: "Condições para embargo ou interdição" },
  { id: "nr-04", label: "NR-04", title: "SESMT", description: "Serviços Especializados em Eng. de Segurança e Medicina do Trabalho" },
  { id: "nr-05", label: "NR-05", title: "CIPA", description: "Comissão Interna de Prevenção de Acidentes" },
  { id: "nr-06", label: "NR-06", title: "EPI", description: "Equipamento de Proteção Individual" },
  { id: "nr-07", label: "NR-07", title: "PCMSO", description: "Programa de Controle Médico de Saúde Ocupacional" },
  { id: "nr-08", label: "NR-08", title: "Edificações", description: "Requisitos técnicos para edificações" },
  { id: "nr-09", label: "NR-09", title: "PPRA", description: "Programa de Prevenção de Riscos Ambientais" },
  { id: "nr-10", label: "NR-10", title: "Segurança em Instalações Elétricas", description: "Segurança em instalações e serviços em eletricidade" },
  { id: "nr-11", label: "NR-11", title: "Transporte e Materiais", description: "Transporte, movimentação, armazenagem e manuseio de materiais" },
  { id: "nr-12", label: "NR-12", title: "Máquinas e Equipamentos", description: "Segurança no trabalho em máquinas e equipamentos" },
  { id: "nr-13", label: "NR-13", title: "Caldeiras e Vasos de Pressão", description: "Caldeiras, vasos de pressão e tubulações" },
  { id: "nr-14", label: "NR-14", title: "Fornos", description: "Fornos industriais" },
  { id: "nr-15", label: "NR-15", title: "Atividades Insalubres", description: "Atividades e operações insalubres" },
  { id: "nr-16", label: "NR-16", title: "Atividades Perigosas", description: "Atividades e operações perigosas" },
  { id: "nr-17", label: "NR-17", title: "Ergonomia", description: "Ergonomia no ambiente de trabalho" },
  { id: "nr-18", label: "NR-18", title: "Construção Civil", description: "Condições e meio ambiente de trabalho na indústria da construção" },
  { id: "nr-19", label: "NR-19", title: "Explosivos", description: "Explosivos e inflamáveis" },
  { id: "nr-20", label: "NR-20", title: "Líquidos Combustíveis", description: "Segurança e saúde no trabalho com inflamáveis e combustíveis" },
  { id: "nr-21", label: "NR-21", title: "Trabalho a Céu Aberto", description: "Trabalho a céu aberto" },
  { id: "nr-22", label: "NR-22", title: "Mineração", description: "Segurança e saúde ocupacional na mineração" },
  { id: "nr-23", label: "NR-23", title: "Proteção Contra Incêndios", description: "Proteção contra incêndios" },
  { id: "nr-24", label: "NR-24", title: "Condições Sanitárias", description: "Condições sanitárias e de conforto nos locais de trabalho" },
  { id: "nr-25", label: "NR-25", title: "Resíduos Industriais", description: "Resíduos industriais" },
  { id: "nr-26", label: "NR-26", title: "Sinalização de Segurança", description: "Sinalização de segurança" },
  { id: "nr-27", label: "NR-27", title: "Registro Profissional", description: "Registro profissional do técnico de segurança" },
  { id: "nr-28", label: "NR-28", title: "Fiscalização e Penalidades", description: "Fiscalização e penalidades" },
  { id: "nr-29", label: "NR-29", title: "Portuários", description: "Segurança e saúde no trabalho portuário" },
  { id: "nr-30", label: "NR-30", title: "Aquaviários", description: "Segurança e saúde no trabalho aquaviário" },
  { id: "nr-31", label: "NR-31", title: "Agricultura e Pecuária", description: "Segurança e saúde no trabalho na agricultura, pecuária" },
  { id: "nr-32", label: "NR-32", title: "Serviços de Saúde", description: "Segurança e saúde no trabalho em serviços de saúde" },
  { id: "nr-33", label: "NR-33", title: "Espaços Confinados", description: "Segurança e saúde nos trabalhos em espaços confinados" },
  { id: "nr-34", label: "NR-34", title: "Naval", description: "Condições e meio ambiente de trabalho na indústria da construção e reparação naval" },
  { id: "nr-35", label: "NR-35", title: "Trabalho em Altura", description: "Trabalho em altura" },
  { id: "nr-36", label: "NR-36", title: "Frigoríficos", description: "Segurança e saúde no trabalho em empresas de abate e processamento de carnes" },
  { id: "nr-37", label: "NR-37", title: "Plataformas de Petróleo", description: "Segurança e saúde em plataformas de petróleo" },
  { id: "nr-38", label: "NR-38", title: "Mineração Subterrânea", description: "Segurança no Trabalho na Indústria da Mineração Subterrânea" }
];

const formSchema = z.object({
  title: z.string().min(5, { message: "Título deve ter pelo menos 5 caracteres" }),
  description: z.string().min(10, { message: "Descrição deve ter pelo menos 10 caracteres" }),
  duration: z.string().min(1, { message: "Duração é obrigatória" }),
  validity: z.string().min(1, { message: "Validade é obrigatória" }),
  selectedNRs: z.array(z.string()).min(1, { message: "Selecione pelo menos uma NR" })
});

type FormValues = z.infer<typeof formSchema>;

export function NewTrainingDialog() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      duration: "",
      validity: "365",
      selectedNRs: []
    }
  });

  const onSubmit = (data: FormValues) => {
    console.log("Form data submitted:", data);
    
    // Format the NRs for display
    const selectedNRLabels = data.selectedNRs.map(nrId => {
      const nr = nrOptions.find(option => option.id === nrId);
      return nr ? nr.label : nrId;
    }).join(", ");
    
    // Success message
    toast.success("Treinamento cadastrado com sucesso", {
      description: `${data.title} (${selectedNRLabels}) foi adicionado ao catálogo.`
    });
    
    // Reset form
    form.reset();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-safety-blue hover:bg-safety-blue/90 flex items-center gap-2">
          <span>Novo Treinamento</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cadastrar Novo Treinamento</DialogTitle>
          <DialogDescription>
            Preencha os dados para adicionar um novo treinamento ao catálogo.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título do Treinamento</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: NR-35: Trabalho em Altura" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input placeholder="Breve descrição do treinamento" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração (horas)</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Ex: 8 horas" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="validity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Validade</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a validade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="365">1 ano</SelectItem>
                        <SelectItem value="730">2 anos</SelectItem>
                        <SelectItem value="1095">3 anos</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="selectedNRs"
              render={() => (
                <FormItem>
                  <FormLabel>Normas Regulamentadoras (NRs)</FormLabel>
                  <div className="max-h-60 overflow-y-auto border rounded-md p-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {nrOptions.map((option) => (
                        <FormField
                          key={option.id}
                          control={form.control}
                          name="selectedNRs"
                          render={({ field }) => {
                            return (
                              <FormItem key={option.id} className="flex flex-row items-start space-x-3 space-y-0 p-2 hover:bg-gray-50 rounded">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(option.id)}
                                    onCheckedChange={(checked) => {
                                      const updatedSelectedNRs = checked
                                        ? [...field.value, option.id]
                                        : field.value?.filter((value) => value !== option.id);
                                      field.onChange(updatedSelectedNRs);
                                    }}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel className="font-medium">
                                    {option.label}: {option.title}
                                  </FormLabel>
                                  <p className="text-sm text-muted-foreground">
                                    {option.description}
                                  </p>
                                </div>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="submit">Salvar Treinamento</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
