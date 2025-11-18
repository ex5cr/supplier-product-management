'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import SupplierList from '@/components/SupplierList';
import SupplierForm from '@/components/SupplierForm';

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const fetchSuppliers = async () => {
    try {
      const data = await api.getSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error('Failed to fetch suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleCreate = async (data: { name: string; email: string; phone: string }) => {
    await api.createSupplier(data);
    await fetchSuppliers();
    setShowForm(false);
  };

  const handleUpdate = async (data: { name: string; email: string; phone: string }) => {
    if (!editingSupplier) return;
    await api.updateSupplier(editingSupplier.id, data);
    await fetchSuppliers();
    setEditingSupplier(null);
    setShowForm(false);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSupplier(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading suppliers...</div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Suppliers</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your suppliers and their contact information.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          {!showForm && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Add supplier
            </button>
          )}
        </div>
      </div>

      {showForm ? (
        <div className="mt-8">
          <SupplierForm
            supplier={editingSupplier}
            onSubmit={editingSupplier ? handleUpdate : handleCreate}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <div className="mt-8">
          <SupplierList suppliers={suppliers} onEdit={handleEdit} />
        </div>
      )}
    </div>
  );
}

