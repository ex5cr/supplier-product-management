'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';

interface Supplier {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imagePath: string | null;
  supplierId: string;
  supplier: Supplier;
}

interface ProductFormProps {
  product?: Product | null;
  suppliers: Supplier[];
  onSubmit: (data: {
    name: string;
    description: string;
    price: number;
    supplierId: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export default function ProductForm({
  product,
  suppliers,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [verifyingPassword, setVerifyingPassword] = useState(false);
  const originalSupplierId = useRef<string>('');
  const pendingSupplierId = useRef<string>('');

  useEffect(() => {
    if (product) {
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price.toString());
      setSupplierId(product.supplierId);
      originalSupplierId.current = product.supplierId;
    } else if (suppliers.length > 0 && !supplierId) {
      setSupplierId(suppliers[0].id);
      originalSupplierId.current = '';
    }
    // Only depend on product and suppliers, not supplierId to avoid resetting after password confirmation
  }, [product, suppliers]);

  const handleSupplierChange = (newSupplierId: string) => {
    // If editing and supplier is being changed, require password confirmation
    if (product && newSupplierId !== originalSupplierId.current) {
      pendingSupplierId.current = newSupplierId;
      setShowPasswordModal(true);
      setPassword('');
      setPasswordError('');
    } else {
      setSupplierId(newSupplierId);
    }
  };

  const handlePasswordConfirm = async () => {
    if (!password) {
      setPasswordError('Password is required');
      return;
    }

    setPasswordError('');
    setVerifyingPassword(true);

    try {
      await api.verifyPassword(password);
      // Password verified, allow supplier change
      setSupplierId(pendingSupplierId.current);
      // Update original supplier ID so future changes don't require password again
      originalSupplierId.current = pendingSupplierId.current;
      setShowPasswordModal(false);
      setPassword('');
      pendingSupplierId.current = '';
    } catch (err: any) {
      setPasswordError(err.message || 'Invalid password');
    } finally {
      setVerifyingPassword(false);
    }
  };

  const handlePasswordCancel = () => {
    setShowPasswordModal(false);
    setPassword('');
    setPasswordError('');
    pendingSupplierId.current = '';
    // Reset supplier to original
    if (product) {
      setSupplierId(originalSupplierId.current);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Ensure supplierId is set
    if (!supplierId) {
      setError('Please select a supplier');
      setLoading(false);
      return;
    }

    try {
      await onSubmit({
        name,
        description,
        price: parseFloat(price),
        supplierId, // This should be the current supplierId from state
      });
      if (!product) {
        // Reset form only for new products
        setName('');
        setDescription('');
        setPrice('');
        if (suppliers.length > 0) {
          setSupplierId(suppliers[0].id);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Product Name
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="description"
          rows={4}
          placeholder="Product description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
          Price
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="price"
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </div>
      <div className="mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="supplier">
          Supplier
        </label>
        <select
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="supplier"
          value={supplierId}
          onChange={(e) => handleSupplierChange(e.target.value)}
          required
        >
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center justify-between">
        <button
          className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Saving...' : product ? 'Update' : 'Create'}
        </button>
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          type="button"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>

      {/* Password Confirmation Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Password Confirmation Required
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Please enter your password to confirm changing the supplier for this product.
              </p>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setPasswordError('');
                  }}
                  autoFocus
                />
                {passwordError && (
                  <p className="text-red-500 text-xs mt-1">{passwordError}</p>
                )}
              </div>
              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={handlePasswordCancel}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 focus:outline-none"
                  disabled={verifyingPassword}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePasswordConfirm}
                  className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 focus:outline-none disabled:opacity-50"
                  disabled={verifyingPassword || !password}
                >
                  {verifyingPassword ? 'Verifying...' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}

