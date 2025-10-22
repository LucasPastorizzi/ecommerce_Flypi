import React from "react";
import { Users } from "lucide-react";

export default function ClientesPage() {
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Clientes</h2>
        <p className="text-gray-500">Página de clientes em desenvolvimento</p>
      </div>
    </div>
  );
}
