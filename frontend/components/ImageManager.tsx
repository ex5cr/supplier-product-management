'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import ConfirmationModal from './ConfirmationModal';

interface ProductImage {
  id: string;
  path: string;
  createdAt: string;
}

interface ImageManagerProps {
  productId: string;
  images: ProductImage[];
  primaryImageId: string | null;
  apiBaseUrl: string;
  onImagesUpdated: (product: any) => void;
}

export default function ImageManager({
  productId,
  images,
  primaryImageId,
  apiBaseUrl,
  onImagesUpdated,
}: ImageManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [settingPrimary, setSettingPrimary] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; imageId: string | null }>({
    isOpen: false,
    imageId: null,
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const result = await api.uploadProductImage(productId, file);
      onImagesUpdated(result.product);
    } catch (err: any) {
      setError(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleDeleteClick = (imageId: string) => {
    setDeleteModal({ isOpen: true, imageId });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.imageId) return;
    const imageId = deleteModal.imageId;
    setDeleteModal({ isOpen: false, imageId: null });
    setDeleting(imageId);
    setError('');
    try {
      const result = await api.deleteProductImage(imageId);
      onImagesUpdated(result.product);
    } catch (err: any) {
      setError(err.message || 'Failed to delete image');
    } finally {
      setDeleting(null);
    }
  };

  const handleSetPrimary = async (imageId: string) => {
    setSettingPrimary(imageId);
    setError('');
    try {
      const result = await api.setPrimaryImage(imageId);
      onImagesUpdated(result.product);
    } catch (err: any) {
      setError(err.message || 'Failed to set primary image');
    } finally {
      setSettingPrimary(null);
    }
  };

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images</h3>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Upload Section */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Add New Image
        </label>
        <input
          type="file"
          accept="image/jpeg,image/jpg,image/png"
          onChange={handleImageUpload}
          disabled={uploading}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50"
        />
        {uploading && (
          <p className="mt-2 text-sm text-gray-500">Uploading...</p>
        )}
        <p className="mt-2 text-sm text-gray-500">
          Accepted formats: JPG, JPEG, PNG (max 5MB)
        </p>
      </div>

      {/* Images Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image) => {
            const isPrimary = image.id === primaryImageId;
            const isDeleting = deleting === image.id;
            const isSettingPrimary = settingPrimary === image.id;

            return (
              <div
                key={image.id}
                className={`relative border-2 rounded-lg overflow-hidden ${
                  isPrimary ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200'
                }`}
              >
                <img
                  src={`${apiBaseUrl}${image.path}`}
                  alt="Product"
                  className="w-full h-32 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                
                {/* Primary Badge */}
                {isPrimary && (
                  <div className="absolute top-2 left-2 bg-indigo-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    Primary
                  </div>
                )}

                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity flex items-center justify-center gap-2">
                  <div className="opacity-0 hover:opacity-100 flex gap-2">
                    {!isPrimary && (
                      <button
                        onClick={() => handleSetPrimary(image.id)}
                        disabled={isSettingPrimary}
                        className="px-3 py-1 bg-indigo-500 text-white text-xs rounded hover:bg-indigo-600 disabled:opacity-50"
                        title="Set as primary"
                      >
                        {isSettingPrimary ? 'Setting...' : 'Set Primary'}
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteClick(image.id)}
                      disabled={isDeleting}
                      className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 disabled:opacity-50"
                      title="Delete image"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Loading Overlay */}
                {(isDeleting || isSettingPrimary) && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="text-white text-sm">
                      {isDeleting ? 'Deleting...' : 'Setting primary...'}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>No images uploaded yet.</p>
          <p className="text-sm mt-2">Upload an image above to get started.</p>
        </div>
      )}

      <ConfirmationModal
        isOpen={deleteModal.isOpen}
        title="Delete Image"
        message="Are you sure you want to delete this image?"
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteModal({ isOpen: false, imageId: null })}
        variant="danger"
        loading={deleting !== null}
      />
    </div>
  );
}

