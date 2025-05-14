import React from 'react';
import { Construction } from '@/types/construction';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { Building2, CalendarDays, MapPin, FileText, ExternalLink, AlertCircle, Briefcase, Info } from 'lucide-react';

interface ConstructionDetailsProps {
  construction: Construction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ConstructionDetails: React.FC<ConstructionDetailsProps> = ({ 
  construction, 
  open,
  onOpenChange
}) => {
  if (!construction) return null;

  const {
    address,
    status, // 'approved', 'pending', ou poderia ser 'Consulta' etc.
    documentDate,
    // constructionArea, // Não presente no novo card
    // landArea, // Não presente no novo card
    licenseType, // Usado como subtítulo/status principal
    fileName,
    cnpj,
    companyName,
    city,
    latitude,
    longitude
  } = construction;

  // Adaptação para o novo formato de status
  // No exemplo da imagem: "Consulta" e "Não Aplicável"
  // Vamos usar licenseType para o primeiro status e um valor fixo ou de 'status' para o segundo
  const primaryStatus = licenseType || "Não Informado";
  const secondaryStatus = status === 'approved' ? "Aprovada" : status === 'pending' ? "Em Aprovação" : "Não Aplicável"; // Exemplo, pode precisar de mais lógica

  const formattedDate = documentDate ? format(new Date(documentDate), "dd/MM/yyyy", { locale: ptBR }) : "Data não informada";

  const getGoogleMapsLink = () => {
    if (latitude && longitude) {
      return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address + ', ' + city)}`;
  };
  
  // Placeholder para descrição, já que não existe no mockData
  const descriptionText = `Consulta sobre enquadramento ambiental para ${companyName}...`; 

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="text-2xl font-semibold text-gray-800">{companyName || "Nome da Empresa"}</DialogTitle>
          <div className="flex items-center space-x-2 mt-1">
            <Badge variant="outline" className="border-yellow-500 text-yellow-700 bg-yellow-50">
              <AlertCircle className="h-4 w-4 mr-1.5" /> 
              {primaryStatus}
            </Badge>
            <span className="text-sm text-gray-500">{secondaryStatus}</span>
          </div>
        </DialogHeader>
        
        <div className="px-6 pb-6 space-y-5">
          <section>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Informações da Empresa</h4>
            <div className="space-y-1.5">
              <div className="flex items-center text-gray-700">
                <Briefcase className="h-4 w-4 mr-2.5 text-gray-400 flex-shrink-0" />
                <span className="text-sm">CNPJ: {cnpj || "Não informado"}</span>
              </div>
              <div className="flex items-start text-gray-700">
                <MapPin className="h-4 w-4 mr-2.5 text-gray-400 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{address || "Endereço não informado"}, {city || "Cidade não informada"}</span>
              </div>
            </div>
          </section>

          <Separator />

          <section>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Detalhes da Licença</h4>
            <div className="space-y-1.5">
              <div className="flex items-center text-gray-700">
                <CalendarDays className="h-4 w-4 mr-2.5 text-gray-400 flex-shrink-0" />
                <span className="text-sm">Emitida em: {formattedDate}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <FileText className="h-4 w-4 mr-2.5 text-gray-400 flex-shrink-0" />
                <span className="text-sm">{fileName || "Nome do arquivo não informado"}</span>
              </div>
            </div>
          </section>
          
          <Separator />

          <section>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Descrição</h4>
            <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm text-gray-700">{descriptionText}</p>
            </div>
          </section>

          <Separator />

          <section>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Localização</h4>
            <div className="space-y-1.5 mb-3">
                <span className="text-sm text-gray-700">Lat: {latitude || "N/A"}, Lng: {longitude || "N/A"}</span>
            </div>
            <div className="h-32 bg-gray-200 rounded-md flex items-center justify-center relative overflow-hidden">
              {/* Placeholder para miniatura do mapa. Idealmente seria uma imagem estática do Mapbox ou Google Maps */}
              <img src={`https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-s+0074D9(${longitude || 0},${latitude || 0})/${longitude || 0},${latitude || 0},9,0/300x128?access_token=pk.eyJ1IjoidmljZW56bzE5ODYiLCJhIjoiY21hOTJ1dDk3MW43ajJwcHdtancwbG9zbSJ9.TTMx21fG8mpx04i1h2hl-Q`} alt="Miniatura do Mapa" className="w-full h-full object-cover" />
              <Button variant="outline" size="sm" className="absolute bottom-2 right-2 bg-white hover:bg-gray-50 shadow-md" asChild>
                <a href={getGoogleMapsLink()} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                  Ver no Google Maps
                </a>
              </Button>
            </div>
          </section>
        </div>

        <DialogFooter className="p-6 pt-4 border-t">
          <Button variant="outline" className="w-full">
            <FileText className="h-4 w-4 mr-2" />
            Ver Documento Completo
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConstructionDetails;

