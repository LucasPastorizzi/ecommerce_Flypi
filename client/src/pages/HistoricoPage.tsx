import React from "react";
import { Clock } from "lucide-react";

export default function HistoricoPage() {
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Histórico</h2>
        <p className="text-gray-500">Página de histórico em desenvolvimento</p>
      </div>
    </div>
  );
}
