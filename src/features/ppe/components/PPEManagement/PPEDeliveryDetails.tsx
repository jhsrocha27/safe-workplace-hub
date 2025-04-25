import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PPEDelivery } from '@/hooks/use-ppe-management';

interface PPEDeliveryDetailsProps {
  delivery: PPEDelivery;
}

export const PPEDeliveryDetails: React.FC<PPEDeliveryDetailsProps> = ({ delivery }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalhes da Entrega de EPI</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium">Informações do Funcionário</h3>
            <div className="mt-2 space-y-1">
              <p><span className="font-medium">Nome:</span> {delivery.employeeName}</p>
              <p><span className="font-medium">Departamento:</span> {delivery.department}</p>
              <p><span className="font-medium">Cargo:</span> {delivery.position}</p>
            </div>
          </div>

          <div>
            <h3 className="font-medium">Informações do EPI</h3>
            <div className="mt-2 space-y-1">
              <p><span className="font-medium">Nome:</span> {delivery.ppeName}</p>
              <p><span className="font-medium">Quantidade:</span> {delivery.quantity}</p>
              <p><span className="font-medium">Data de Entrega:</span> {new Date(delivery.delivery_date).toLocaleDateString()}</p>
              <p><span className="font-medium">Data de Validade:</span> {new Date(delivery.expiryDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-medium">Status da Entrega</h3>
          <div className="mt-2">
            <span className={`inline-block px-2 py-1 rounded-full text-white ${delivery.status === 'valid' ? 'bg-green-500' : delivery.status === 'expired' ? 'bg-red-500' : 'bg-yellow-500'}`}>
              {delivery.status.toUpperCase()}
            </span>
          </div>
        </div>

        {delivery.signature && (
          <div className="mt-4">
            <h3 className="font-medium">Assinatura</h3>
            <div className="mt-2">
              <p className="text-green-600">✓ Assinado pelo funcionário</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};