import React from "react";
import { Package } from "lucide-react";

export default function PedidosPage() {
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Pedidos</h2>
        <p className="text-gray-500">Página de pedidos em desenvolvimento</p>
      </div>
    </div>
  );
}

