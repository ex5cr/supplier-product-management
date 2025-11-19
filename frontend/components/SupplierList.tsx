'use client';

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

interface SupplierListProps {
  suppliers: Supplier[];
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: string) => void;
}

export default function SupplierList({
  suppliers,
  onEdit,
  onDelete,
}: SupplierListProps) {
  if (suppliers.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6 text-center text-gray-500">
        No suppliers found. Create your first supplier to get started.
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {suppliers.map((supplier) => (
          <li key={supplier.id}>
            <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div>
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {supplier.name}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">{supplier.email}</p>
                    <p className="mt-1 text-sm text-gray-500">{supplier.phone}</p>
                  </div>
                </div>
                <div className="ml-2 flex-shrink-0 flex space-x-2">
                  <button
                    onClick={() => onEdit(supplier)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(supplier.id)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

