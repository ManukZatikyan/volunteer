'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useAdminLocale } from '@/lib/admin-locale';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

interface ArrayEditorProps {
  label: string;
  items: any[];
  onItemsChange: (items: any[]) => void;
  itemFields: string[];
  contentLocale: string;
}

interface HeadOfMarketingEditorProps {
  label: string;
  value: any;
  onChange: (value: any) => void;
  contentLocale: string;
}

interface MembershipDescriptionItemsEditorProps {
  label: string;
  items: any[];
  onItemsChange: (items: any[]) => void;
  contentLocale: string;
}

function ArrayEditor({ label, items, onItemsChange, itemFields, contentLocale }: ArrayEditorProps) {
  const t = useTranslations('admin.edit');
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Get field names (excluding image)
  const textFields = itemFields.filter(f => f !== 'image');
  const firstField = textFields[0] || 'title';
  const secondField = textFields[1] || 'description';
  const thirdField = textFields[2] || null; // For fields like linkedin that don't need bilingual support
  
  const [newItemData, setNewItemData] = useState<{
    firstFieldEn: string;
    firstFieldHy: string;
    secondFieldEn: string;
    secondFieldHy: string;
    thirdField: string;
    image: string;
  }>({
    firstFieldEn: '',
    firstFieldHy: '',
    secondFieldEn: '',
    secondFieldHy: '',
    thirdField: '',
    image: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleOpenModal = () => {
    setNewItemData({
      firstFieldEn: '',
      firstFieldHy: '',
      secondFieldEn: '',
      secondFieldHy: '',
      thirdField: '',
      image: ''
    });
    setImagePreview('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewItemData({
      firstFieldEn: '',
      firstFieldHy: '',
      secondFieldEn: '',
      secondFieldHy: '',
      thirdField: '',
      image: ''
    });
    setImagePreview('');
  };

  const handleImageUploadInModal = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await response.json();
      setNewItemData(prev => ({ ...prev, image: data.url }));
      setImagePreview(data.url);
    } catch (error: any) {
      alert(error.message || 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddItem = () => {
    // Create item with content for current locale, and store other locale's data in temp fields
    const newItem: any = {};
    itemFields.forEach(field => {
      if (field === firstField) {
        // Use current locale's first field (title/name)
        newItem[field] = contentLocale === 'en' ? newItemData.firstFieldEn : newItemData.firstFieldHy;
        // Store other locale's first field in temp field
        if (contentLocale === 'en') {
          (newItem as any)[`_${firstField}Hy`] = newItemData.firstFieldHy;
        } else {
          (newItem as any)[`_${firstField}En`] = newItemData.firstFieldEn;
        }
      } else if (field === secondField) {
        // Use current locale's second field (description/biography)
        newItem[field] = contentLocale === 'en' ? newItemData.secondFieldEn : newItemData.secondFieldHy;
        // Store other locale's second field in temp field
        if (contentLocale === 'en') {
          (newItem as any)[`_${secondField}Hy`] = newItemData.secondFieldHy;
        } else {
          (newItem as any)[`_${secondField}En`] = newItemData.secondFieldEn;
        }
      } else if (field === thirdField && thirdField) {
        // Third field (like linkedin) - single value, not bilingual
        newItem[field] = newItemData.thirdField;
      } else if (field === 'image') {
        newItem[field] = newItemData.image;
      } else {
        newItem[field] = '';
      }
    });
    
    onItemsChange([...items, newItem]);
    handleCloseModal();
  };

  const addItem = () => {
    handleOpenModal();
  };

  const deleteItem = (index: number) => {
    // Remove the item - previews will be recalculated by useEffect
    onItemsChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onItemsChange(updated);
    
    // Update preview if it's an image field
    if (field === 'image' && value) {
      const previewKey = `${index}`;
      setPreviewUrls(prev => ({ ...prev, [previewKey]: value }));
    }
  };

  const handleImageUpload = async (index: number, file: File) => {
    setUploadingIndex(index);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await response.json();
      updateItem(index, 'image', data.url);
    } catch (error: any) {
      alert(error.message || 'Failed to upload image');
    } finally {
      setUploadingIndex(null);
    }
  };

  // Load previews for existing images - update when items change
  useEffect(() => {
    const newPreviews: Record<string, string> = {};
    items.forEach((item, index) => {
      if (item.image) {
        newPreviews[`${index}`] = item.image;
      }
    });
    setPreviewUrls(newPreviews);
  }, [items]);

  return (
    <>
      {/* Add New Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('addNew')}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* First Field - English */}
                {firstField && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t(firstField as any, { default: firstField.charAt(0).toUpperCase() + firstField.slice(1) })} (EN)
                    </label>
                    <input
                      type="text"
                      value={newItemData.firstFieldEn}
                      onChange={(e) => setNewItemData(prev => ({ ...prev, firstFieldEn: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
                      placeholder={t('enterField', { field: `${t(firstField as any, { default: firstField })} (EN)` })}
                    />
                  </div>
                )}

                {/* First Field - Armenian */}
                {firstField && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t(firstField as any, { default: firstField.charAt(0).toUpperCase() + firstField.slice(1) })} (HY)
                    </label>
                    <input
                      type="text"
                      value={newItemData.firstFieldHy}
                      onChange={(e) => setNewItemData(prev => ({ ...prev, firstFieldHy: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
                      placeholder={t('enterField', { field: `${t(firstField as any, { default: firstField })} (HY)` })}
                    />
                  </div>
                )}

                {/* Second Field - English */}
                {secondField && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t(secondField as any, { default: secondField.charAt(0).toUpperCase() + secondField.slice(1) })} (EN)
                    </label>
                    <textarea
                      value={newItemData.secondFieldEn}
                      onChange={(e) => setNewItemData(prev => ({ ...prev, secondFieldEn: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
                      rows={3}
                      placeholder={t('enterField', { field: `${t(secondField as any, { default: secondField })} (EN)` })}
                    />
                  </div>
                )}

                {/* Second Field - Armenian */}
                {secondField && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t(secondField as any, { default: secondField.charAt(0).toUpperCase() + secondField.slice(1) })} (HY)
                    </label>
                    <textarea
                      value={newItemData.secondFieldHy}
                      onChange={(e) => setNewItemData(prev => ({ ...prev, secondFieldHy: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
                      rows={3}
                      placeholder={t('enterField', { field: `${t(secondField as any, { default: secondField })} (HY)` })}
                    />
                  </div>
                )}

                {/* Third Field (single, not bilingual - e.g., linkedin) */}
                {thirdField && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t(thirdField as any, { default: thirdField.charAt(0).toUpperCase() + thirdField.slice(1) })}
                    </label>
                    <input
                      type="text"
                      value={newItemData.thirdField}
                      onChange={(e) => setNewItemData(prev => ({ ...prev, thirdField: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
                      placeholder={t('enterField', { field: t(thirdField as any, { default: thirdField }) })}
                    />
                  </div>
                )}

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('image')}
                  </label>
                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mb-3">
                      <div className="relative inline-block w-full max-w-md border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 shadow-sm">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="block w-full h-auto max-h-64 object-contain mx-auto"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  {/* Upload Button */}
                  <label className="block cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUploadInModal(file);
                        }
                        e.target.value = '';
                      }}
                      className="hidden"
                      disabled={isUploading}
                    />
                    <div className={`w-full px-4 py-2.5 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-center cursor-pointer transition-all duration-200 ${
                      isUploading ? 'opacity-50 cursor-not-allowed border-gray-200 dark:border-gray-700' : ''
                    }`}>
                      {isUploading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t('uploading')}
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {t('chooseImage')}
                        </span>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleAddItem}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer"
                >
                  {t('addNew')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900/50">
        <div className="flex justify-between items-center mb-4">
            <label className="block text-lg font-semibold text-gray-900 dark:text-white">
              {label}
            </label>
            <button
              onClick={addItem}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer"
            >
              {t('addNew')}
            </button>
        </div>
      
      {items.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-sm italic">
          {t('noItems')}
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md"
            >
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('item')} #{index + 1}
                </span>
                <button
                  onClick={() => deleteItem(index)}
                  className="px-2 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 cursor-pointer"
                >
                  {t('delete')}
                </button>
              </div>
              
              <div className="space-y-3">
                {itemFields.map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
                      {t(field as any, { default: field })}
                    </label>
                    {field === 'image' ? (
                      <div className="space-y-3">
                        {/* Image Preview */}
                        {previewUrls[`${index}`] && (
                          <div className="mb-3">
                            <div className="relative inline-block w-full max-w-md border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 shadow-sm">
                              <img
                                src={previewUrls[`${index}`]}
                                alt="Preview"
                                className="block w-full h-auto max-h-64 object-contain mx-auto"
                                onError={(e) => {
                                  // Show error state instead of hiding
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent && !parent.querySelector('.error-message')) {
                                    const errorDiv = document.createElement('div');
                                    errorDiv.className = 'error-message p-8 text-center text-gray-500 dark:text-gray-400 text-sm';
                                    errorDiv.textContent = 'Image failed to load';
                                    parent.appendChild(errorDiv);
                                  }
                                }}
                              />
                            </div>
                          </div>
                        )}
                        
                        {/* Upload Button */}
                        <label className="block cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload(index, file);
                              }
                              // Reset input value to allow re-selecting the same file
                              e.target.value = '';
                            }}
                            className="hidden"
                            disabled={uploadingIndex === index}
                          />
                          <div className={`w-full px-4 py-2.5 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-center cursor-pointer transition-all duration-200 ${
                            uploadingIndex === index ? 'opacity-50 cursor-not-allowed border-gray-200 dark:border-gray-700' : ''
                          }`}>
                            {uploadingIndex === index ? (
                              <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {t('uploading')}
                              </span>
                            ) : (
                              <span className="flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {t('chooseImage')}
                              </span>
                            )}
                          </div>
                        </label>
                      </div>
                    ) : field === 'description' || field === 'biography' ? (
                      <textarea
                        value={item[field] || ''}
                        onChange={(e) => updateItem(index, field, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
                        rows={3}
                        placeholder={t('enterField', { field: t(field as any, { default: field }) })}
                      />
                    ) : (
                      <input
                        type={field === 'linkedin' ? 'url' : 'text'}
                        value={item[field] || ''}
                        onChange={(e) => updateItem(index, field, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
                        placeholder={t('enterField', { field: t(field as any, { default: field }) })}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </>
  );
}

function HeadOfMarketingEditor({ label, value, onChange, contentLocale }: HeadOfMarketingEditorProps) {
  const t = useTranslations('admin.edit');
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(value?.image || '');
  
  // Store bilingual data - current locale in main fields, other locale in temp fields
  const [nameEn, setNameEn] = useState(contentLocale === 'en' ? (value?.name || '') : (value?._nameEn || ''));
  const [nameHy, setNameHy] = useState(contentLocale === 'hy' ? (value?.name || '') : (value?._nameHy || ''));
  const [descriptionEn, setDescriptionEn] = useState(contentLocale === 'en' ? (value?.description || '') : (value?._descriptionEn || ''));
  const [descriptionHy, setDescriptionHy] = useState(contentLocale === 'hy' ? (value?.description || '') : (value?._descriptionHy || ''));
  const [linkedin, setLinkedin] = useState(value?.linkedin || '');

  // Load bilingual data when value changes or locale changes
  useEffect(() => {
    if (contentLocale === 'en') {
      setNameEn(value?.name || '');
      setNameHy(value?._nameHy || '');
      setDescriptionEn(value?.description || '');
      setDescriptionHy(value?._descriptionHy || '');
    } else {
      setNameEn(value?._nameEn || '');
      setNameHy(value?.name || '');
      setDescriptionEn(value?._descriptionEn || '');
      setDescriptionHy(value?.description || '');
    }
    setLinkedin(value?.linkedin || '');
    setImagePreview(value?.image || '');
  }, [value, contentLocale]);

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('uploadFailed'));
      }

      const data = await response.json();
      const imageUrl = data.url;
      setImagePreview(imageUrl);
      onChange({ ...value, image: imageUrl });
    } catch (error: any) {
      alert(error.message || t('failedToUploadImage'));
    } finally {
      setUploading(false);
    }
  };

  const handleFieldChange = (field: string, fieldValue: string) => {
    const updated = { ...value, [field]: fieldValue };
    onChange(updated);
  };

  const handleNameChange = (locale: 'en' | 'hy', newValue: string) => {
    const updated = { ...value };
    if (locale === 'en') {
      setNameEn(newValue);
      if (contentLocale === 'en') {
        updated.name = newValue;
      } else {
        updated._nameEn = newValue;
      }
    } else {
      setNameHy(newValue);
      if (contentLocale === 'hy') {
        updated.name = newValue;
      } else {
        updated._nameHy = newValue;
      }
    }
    onChange(updated);
  };

  const handleDescriptionChange = (locale: 'en' | 'hy', newValue: string) => {
    const updated = { ...value };
    if (locale === 'en') {
      setDescriptionEn(newValue);
      if (contentLocale === 'en') {
        updated.description = newValue;
      } else {
        updated._descriptionEn = newValue;
      }
    } else {
      setDescriptionHy(newValue);
      if (contentLocale === 'hy') {
        updated.description = newValue;
      } else {
        updated._descriptionHy = newValue;
      }
    }
    onChange(updated);
  };

  const handleLinkedinChange = (newValue: string) => {
    setLinkedin(newValue);
    handleFieldChange('linkedin', newValue);
  };

  return (
    <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900/50">
      <div className="flex justify-between items-center mb-4">
        <label className="block text-lg font-semibold text-gray-900 dark:text-white">
          {label}
        </label>
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md">
        <div className="space-y-3">
          {/* Name - English */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('name', { default: 'Name' })} (EN)
            </label>
            <input
              type="text"
              value={nameEn}
              onChange={(e) => handleNameChange('en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
              placeholder={t('enterField', { field: `${t('name', { default: 'Name' })} (EN)` })}
            />
          </div>

          {/* Name - Armenian */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('name', { default: 'Name' })} (HY)
            </label>
            <input
              type="text"
              value={nameHy}
              onChange={(e) => handleNameChange('hy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
              placeholder={t('enterField', { field: `${t('name', { default: 'Name' })} (HY)` })}
            />
          </div>

          {/* Description - English */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('description', { default: 'Description' })} (EN)
            </label>
            <textarea
              value={descriptionEn}
              onChange={(e) => handleDescriptionChange('en', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
              rows={3}
              placeholder={t('enterField', { field: `${t('description', { default: 'Description' })} (EN)` })}
            />
          </div>

          {/* Description - Armenian */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('description', { default: 'Description' })} (HY)
            </label>
            <textarea
              value={descriptionHy}
              onChange={(e) => handleDescriptionChange('hy', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
              rows={3}
              placeholder={t('enterField', { field: `${t('description', { default: 'Description' })} (HY)` })}
            />
          </div>

          {/* LinkedIn */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('linkedin', { default: 'LinkedIn URL' })}
            </label>
            <input
              type="url"
              value={linkedin}
              onChange={(e) => handleLinkedinChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
              placeholder={t('enterField', { field: t('linkedin', { default: 'LinkedIn URL' }) })}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('image', { default: 'Image' })}
            </label>
            
            {/* Image Preview */}
            {imagePreview && (
              <div className="mb-3">
                <div className="relative inline-block w-full max-w-md border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 shadow-sm mx-auto">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="block w-full h-auto max-h-64 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector('.error-message')) {
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'error-message p-8 text-center text-gray-500 dark:text-gray-400 text-sm';
                        errorDiv.textContent = t('imageFailedToLoad');
                        parent.appendChild(errorDiv);
                      }
                    }}
                  />
                </div>
              </div>
            )}

            {/* Upload Button */}
            <label className="block cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImageUpload(file);
                  }
                  e.target.value = '';
                }}
                className="hidden"
                disabled={uploading}
              />
              <div className={`w-full px-4 py-2.5 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-center cursor-pointer transition-all duration-200 ${
                uploading ? 'opacity-50 cursor-not-allowed border-gray-200 dark:border-gray-700' : ''
              }`}>
                {uploading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('uploading')}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {t('chooseImage')}
                  </span>
                )}
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

// Link Modal Component
function LinkModal({ 
  open, 
  onClose, 
  onConfirm, 
  initialUrl = '' 
}: { 
  open: boolean; 
  onClose: () => void; 
  onConfirm: (url: string) => void;
  initialUrl?: string;
}) {
  const [url, setUrl] = useState(initialUrl);
  const t = useTranslations('admin.edit');

  useEffect(() => {
    if (open) {
      setUrl(initialUrl);
    }
  }, [open, initialUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onConfirm(url.trim());
      setUrl('');
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {t('addLink', { default: 'Add Link' })}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('url', { default: 'URL' })}
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
                placeholder="https://example.com"
                autoFocus
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer"
              >
                {t('cancel', { default: 'Cancel' })}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
              >
                {t('add', { default: 'Add' })}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Tiptap Editor Component
function TiptapEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [currentLinkUrl, setCurrentLinkUrl] = useState('');
  
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 dark:text-blue-400 underline',
        },
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'ProseMirror focus:outline-none min-h-[200px] p-4 text-gray-900 dark:text-gray-100',
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!editor) {
    return (
      <div className="border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 min-h-[200px] p-4">
        <div className="text-gray-500 dark:text-gray-400">Loading editor...</div>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-300 dark:border-gray-600 p-2 flex flex-wrap gap-1 bg-gray-50 dark:bg-gray-800">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 py-1 rounded text-sm font-semibold transition-colors cursor-pointer ${
            editor.isActive('heading', { level: 1 })
              ? 'bg-primary-default text-[#fff]'
              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
          }`}
          title="Heading 1"
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 rounded text-sm font-semibold transition-colors cursor-pointer ${
            editor.isActive('heading', { level: 2 })
              ? 'bg-primary-default text-[#fff]'
              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
          }`}
          title="Heading 2"
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-2 py-1 rounded text-sm font-semibold transition-colors cursor-pointer ${
            editor.isActive('heading', { level: 3 })
              ? 'bg-primary-default text-[#fff]'
              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
          }`}
          title="Heading 3"
        >
          H3
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded text-sm font-bold transition-colors cursor-pointer ${
            editor.isActive('bold')
              ? 'bg-primary-default text-[#fff]'
              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
          }`}
          title="Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded text-sm italic transition-colors cursor-pointer ${
            editor.isActive('italic')
              ? 'bg-primary-default text-[#fff]'
              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
          }`}
          title="Italic"
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-2 py-1 rounded text-sm line-through transition-colors cursor-pointer ${
            editor.isActive('strike')
              ? 'bg-primary-default text-[#fff]'
              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
          }`}
          title="Strikethrough"
        >
          S
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded text-sm transition-colors font-semibold cursor-pointer ${
            editor.isActive('bulletList')
              ? 'bg-primary-default text-[#fff]'
              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
          }`}
          title="Bullet List"
        >
          •
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 rounded text-sm transition-colors font-semibold cursor-pointer ${
            editor.isActive('orderedList')
              ? 'bg-primary-default text-[#fff]'
              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
          }`}
          title="Numbered List"
        >
          1.
        </button>
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />
        <button
          type="button"
          onClick={() => {
            const existingUrl = editor.getAttributes('link').href || '';
            setCurrentLinkUrl(existingUrl);
            setLinkModalOpen(true);
          }}
          className={`px-2 py-1 rounded text-sm transition-colors cursor-pointer ${
            editor.isActive('link')
              ? 'bg-primary-default text-[#fff]'
              : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
          }`}
          title="Add Link"
        >
          🔗
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetLink().run()}
          className="px-2 py-1 rounded text-sm bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors cursor-pointer"
          title="Remove Link"
        >
          Unlink
        </button>
      </div>
      {/* Editor Content */}
      <EditorContent editor={editor} />
      
      {/* Link Modal */}
      <LinkModal
        open={linkModalOpen}
        onClose={() => setLinkModalOpen(false)}
        onConfirm={(url) => {
          if (url) {
            editor.chain().focus().setLink({ href: url }).run();
          }
        }}
        initialUrl={currentLinkUrl}
      />
    </div>
  );
}

function MembershipDescriptionItemsEditor({ label, items, onItemsChange, contentLocale }: MembershipDescriptionItemsEditorProps) {
  const t = useTranslations('admin.edit');
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItemData, setNewItemData] = useState<{
    headingEn: string;
    headingHy: string;
    textEn: string;
    textHy: string;
    imageSrc: string;
    imagePosition: string;
    contentFontSize: string;
  }>({
    headingEn: '',
    headingHy: '',
    textEn: '',
    textHy: '',
    imageSrc: '',
    imagePosition: 'start',
    contentFontSize: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleOpenModal = () => {
    setNewItemData({
      headingEn: '',
      headingHy: '',
      textEn: '',
      textHy: '',
      imageSrc: '',
      imagePosition: 'start',
      contentFontSize: ''
    });
    setImagePreview('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewItemData({
      headingEn: '',
      headingHy: '',
      textEn: '',
      textHy: '',
      imageSrc: '',
      imagePosition: 'start',
      contentFontSize: ''
    });
    setImagePreview('');
  };

  const handleImageUploadInModal = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('uploadFailed'));
      }

      const data = await response.json();
      setNewItemData(prev => ({ ...prev, imageSrc: data.url }));
      setImagePreview(data.url);
    } catch (error: any) {
      alert(error.message || t('failedToUploadImage'));
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddItem = () => {
    const newItem: any = {
      heading: contentLocale === 'en' ? newItemData.headingEn : newItemData.headingHy,
      text: contentLocale === 'en' ? newItemData.textEn : newItemData.textHy,
      imageSrc: newItemData.imageSrc || undefined,
      imagePosition: newItemData.imagePosition || undefined,
      contentFontSize: newItemData.contentFontSize || undefined,
    };

    // Store other locale data in temporary fields
    if (contentLocale === 'en') {
      (newItem as any)._headingHy = newItemData.headingHy;
      (newItem as any)._textHy = newItemData.textHy;
    } else {
      (newItem as any)._headingEn = newItemData.headingEn;
      (newItem as any)._textEn = newItemData.textEn;
    }

    onItemsChange([...items, newItem]);
    handleCloseModal();
  };

  const deleteItem = (index: number) => {
    onItemsChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: string, value: string) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onItemsChange(updated);

    if (field === 'imageSrc' && value) {
      const previewKey = `${index}`;
      setPreviewUrls(prev => ({ ...prev, [previewKey]: value }));
    }
  };

  const handleImageUpload = async (index: number, file: File) => {
    setUploadingIndex(index);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t('uploadFailed'));
      }

      const data = await response.json();
      updateItem(index, 'imageSrc', data.url);
    } catch (error: any) {
      alert(error.message || t('failedToUploadImage'));
    } finally {
      setUploadingIndex(null);
    }
  };

  useEffect(() => {
    const newPreviews: Record<string, string> = {};
    items.forEach((item, index) => {
      if (item.imageSrc) {
        newPreviews[`${index}`] = item.imageSrc;
      }
    });
    setPreviewUrls(newPreviews);
  }, [items]);

  return (
    <>
      {/* Add New Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t('addNew')}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {/* Heading - English */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('heading', { default: 'Heading' })} (EN)
                  </label>
                  <input
                    type="text"
                    value={newItemData.headingEn}
                    onChange={(e) => setNewItemData(prev => ({ ...prev, headingEn: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
                    placeholder={t('enterField', { field: `${t('heading', { default: 'Heading' })} (EN)` })}
                  />
                </div>

                {/* Heading - Armenian */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('heading', { default: 'Heading' })} (HY)
                  </label>
                  <input
                    type="text"
                    value={newItemData.headingHy}
                    onChange={(e) => setNewItemData(prev => ({ ...prev, headingHy: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
                    placeholder={t('enterField', { field: `${t('heading', { default: 'Heading' })} (HY)` })}
                  />
                </div>

                {/* Text - English */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('content', { default: 'Content' })} (EN)
                  </label>
                  <TiptapEditor
                    value={newItemData.textEn}
                    onChange={(value) => setNewItemData(prev => ({ ...prev, textEn: value }))}
                  />
                </div>

                {/* Text - Armenian */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('content', { default: 'Content' })} (HY)
                  </label>
                  <TiptapEditor
                    value={newItemData.textHy}
                    onChange={(value) => setNewItemData(prev => ({ ...prev, textHy: value }))}
                  />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('image', { default: 'Image' })} <span className="text-xs text-gray-500">(Optional)</span>
                  </label>
                  {imagePreview && (
                    <div className="mb-3">
                      <div className="relative inline-block w-full max-w-md border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 shadow-sm mx-auto">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="block w-full h-auto max-h-64 object-contain"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <label className="block cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleImageUploadInModal(file);
                        }
                        e.target.value = '';
                      }}
                      className="hidden"
                      disabled={isUploading}
                    />
                    <div className={`w-full px-4 py-2.5 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-center cursor-pointer transition-all duration-200 ${
                      isUploading ? 'opacity-50 cursor-not-allowed border-gray-200 dark:border-gray-700' : ''
                    }`}>
                      {isUploading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t('uploading')}
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {t('chooseImage')}
                        </span>
                      )}
                    </div>
                  </label>
                </div>

                {/* Image Position */}
                {newItemData.imageSrc && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('imagePosition', { default: 'Image Position' })}
                    </label>
                    <select
                      value={newItemData.imagePosition}
                      onChange={(e) => setNewItemData(prev => ({ ...prev, imagePosition: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
                    >
                      <option value="start">{t('left', { default: 'Left' })}</option>
                      <option value="end">{t('right', { default: 'Right' })}</option>
                    </select>
                  </div>
                )}

                {/* Content Font Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {t('fontSize', { default: 'Font Size' })} <span className="text-xs text-gray-500">(Optional)</span>
                  </label>
                  <select
                    value={newItemData.contentFontSize}
                    onChange={(e) => setNewItemData(prev => ({ ...prev, contentFontSize: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">{t('default', { default: 'Default (Medium)' })}</option>
                    <option value="body-xs">{t('small', { default: 'Small' })}</option>
                    <option value="body-sm-mobile">{t('medium', { default: 'Medium' })}</option>
                    <option value="body-sm">{t('large', { default: 'Large' })}</option>
                    <option value="body">{t('extraLarge', { default: 'Extra Large' })}</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer"
                >
                  {t('cancel')}
                </button>
                <button
                  onClick={handleAddItem}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer"
                >
                  {t('add')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900/50">
        <div className="flex justify-between items-center mb-4">
          <label className="block text-lg font-semibold text-gray-900 dark:text-white">
            {label}
          </label>
          <button
            onClick={handleOpenModal}
            className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 cursor-pointer"
          >
            {t('addNew')}
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm italic">
            {t('noItems')}
          </p>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={index}
                className="p-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('item')} #{index + 1}: {item.heading || t('noHeading', { default: 'No Heading' })}
                  </span>
                  <button
                    onClick={() => deleteItem(index)}
                    className="px-2 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    {t('delete')}
                  </button>
                </div>

                <div className="space-y-3">
                  {/* Heading - English */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('heading', { default: 'Heading' })} (EN)
                    </label>
                    <input
                      type="text"
                      value={contentLocale === 'en' ? (item.heading || '') : ((item as any)._headingEn || '')}
                      onChange={(e) => {
                        if (contentLocale === 'en') {
                          updateItem(index, 'heading', e.target.value);
                        } else {
                          const updated = [...items];
                          updated[index] = { ...updated[index], _headingEn: e.target.value };
                          onItemsChange(updated);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
                      placeholder={t('enterField', { field: `${t('heading', { default: 'Heading' })} (EN)` })}
                    />
                  </div>

                  {/* Heading - Armenian */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('heading', { default: 'Heading' })} (HY)
                    </label>
                    <input
                      type="text"
                      value={contentLocale === 'hy' ? (item.heading || '') : ((item as any)._headingHy || '')}
                      onChange={(e) => {
                        if (contentLocale === 'hy') {
                          updateItem(index, 'heading', e.target.value);
                        } else {
                          const updated = [...items];
                          updated[index] = { ...updated[index], _headingHy: e.target.value };
                          onItemsChange(updated);
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
                      placeholder={t('enterField', { field: `${t('heading', { default: 'Heading' })} (HY)` })}
                    />
                  </div>

                  {/* Text - English */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('content', { default: 'Content' })} (EN)
                    </label>
                    <TiptapEditor
                      value={contentLocale === 'en' ? (item.text || '') : ((item as any)._textEn || '')}
                      onChange={(value) => {
                        if (contentLocale === 'en') {
                          updateItem(index, 'text', value);
                        } else {
                          const updated = [...items];
                          updated[index] = { ...updated[index], _textEn: value };
                          onItemsChange(updated);
                        }
                      }}
                    />
                  </div>

                  {/* Text - Armenian */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('content', { default: 'Content' })} (HY)
                    </label>
                    <TiptapEditor
                      value={contentLocale === 'hy' ? (item.text || '') : ((item as any)._textHy || '')}
                      onChange={(value) => {
                        if (contentLocale === 'hy') {
                          updateItem(index, 'text', value);
                        } else {
                          const updated = [...items];
                          updated[index] = { ...updated[index], _textHy: value };
                          onItemsChange(updated);
                        }
                      }}
                    />
                  </div>

                  {/* Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('image', { default: 'Image' })} <span className="text-xs text-gray-500">(Optional)</span>
                    </label>
                    {previewUrls[`${index}`] && (
                      <div className="mb-3">
                        <div className="relative inline-block w-full max-w-md border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 shadow-sm mx-auto">
                          <img
                            src={previewUrls[`${index}`]}
                            alt="Preview"
                            className="block w-full h-auto max-h-64 object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent && !parent.querySelector('.error-message')) {
                                const errorDiv = document.createElement('div');
                                errorDiv.className = 'error-message p-8 text-center text-gray-500 dark:text-gray-400 text-sm';
                                errorDiv.textContent = t('imageFailedToLoad');
                                parent.appendChild(errorDiv);
                              }
                            }}
                          />
                        </div>
                      </div>
                    )}
                    <label className="block cursor-pointer">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleImageUpload(index, file);
                          }
                          e.target.value = '';
                        }}
                        className="hidden"
                        disabled={uploadingIndex === index}
                      />
                      <div className={`w-full px-4 py-2.5 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-center cursor-pointer transition-all duration-200 ${
                        uploadingIndex === index ? 'opacity-50 cursor-not-allowed border-gray-200 dark:border-gray-700' : ''
                      }`}>
                        {uploadingIndex === index ? (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t('uploading')}
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {t('chooseImage')}
                          </span>
                        )}
                      </div>
                    </label>
                  </div>

                  {/* Image Position */}
                  {item.imageSrc && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('imagePosition', { default: 'Image Position' })}
                      </label>
                      <select
                        value={item.imagePosition || 'start'}
                        onChange={(e) => updateItem(index, 'imagePosition', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
                      >
                        <option value="start">{t('left', { default: 'Left' })}</option>
                        <option value="end">{t('right', { default: 'Right' })}</option>
                      </select>
                    </div>
                  )}

                  {/* Content Font Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {t('fontSize', { default: 'Font Size' })} <span className="text-xs text-gray-500">(Optional)</span>
                    </label>
                    <select
                      value={item.contentFontSize || ''}
                      onChange={(e) => updateItem(index, 'contentFontSize', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
                    >
                      <option value="">{t('default', { default: 'Default (Medium)' })}</option>
                      <option value="body-xs">{t('small', { default: 'Small' })}</option>
                      <option value="body-sm-mobile">{t('medium', { default: 'Medium' })}</option>
                      <option value="body-sm">{t('large', { default: 'Large' })}</option>
                      <option value="body">{t('extraLarge', { default: 'Extra Large' })}</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const pageKey = params?.pageKey as string;
  const t = useTranslations('admin.edit');
  const { locale: adminLocale, setLocale: setAdminLocale } = useAdminLocale();

  const [content, setContent] = useState<any>(null);
  const [editedContent, setEditedContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  // For camps page, track which camp tab is selected
  const [selectedCampTab, setSelectedCampTab] = useState<'armenian' | 'international'>('armenian');
  // Sync content locale with admin locale - they should always be the same
  const contentLocale = adminLocale || 'en';

  useEffect(() => {
    checkAuthAndLoadContent();
  }, [pageKey, adminLocale]);

  const checkAuthAndLoadContent = async () => {
    setLoading(true);
    try {
      // Check authentication
      const authResponse = await fetch('/api/admin/check-auth');
      if (!authResponse.ok) {
        router.push('/admin');
        return;
      }
      
      const authData = await authResponse.json();
      if (!authData.authenticated) {
        router.push('/admin');
        return;
      }

      // Load content for the selected content locale
      const contentResponse = await fetch(`/api/admin/content/${pageKey}?locale=${contentLocale}`);
      if (!contentResponse.ok) {
        const contentType = contentResponse.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await contentResponse.json();
          throw new Error(errorData.error || 'Failed to load content');
        } else {
          throw new Error(`Failed to load content: ${contentResponse.status} ${contentResponse.statusText}`);
        }
      }

      const data = await contentResponse.json();
      let loadedContent = data.content;

      // For membership, centerUpJunior, futureUp, cursesAndActivities, conferences, eventOrganization, upcomingEvents, and camps pages, also load other locale's content to merge into descriptionItems
      if ((pageKey === 'membership' || pageKey === 'centerUpJunior' || pageKey === 'futureUp' || pageKey === 'cursesAndActivities' || pageKey === 'conferences' || pageKey === 'eventOrganization' || pageKey === 'upcomingEvents') && loadedContent.descriptionItems) {
        const otherLocale = contentLocale === 'en' ? 'hy' : 'en';
        try {
          const otherResponse = await fetch(`/api/admin/content/${pageKey}?locale=${otherLocale}`);
          if (otherResponse.ok) {
            const otherData = await otherResponse.json();
            const otherContent = otherData.content;
            
            // Merge other locale's heading and text into descriptionItems as temporary fields
            if (otherContent.descriptionItems && Array.isArray(otherContent.descriptionItems)) {
              loadedContent = {
                ...loadedContent,
                descriptionItems: loadedContent.descriptionItems.map((item: any, index: number) => {
                  const otherItem = otherContent.descriptionItems[index];
                  if (otherItem) {
                    // If current locale is EN, store HY content in temporary fields
                    if (contentLocale === 'en') {
                      return {
                        ...item,
                        _headingHy: otherItem.heading || '',
                        _textHy: otherItem.text || '',
                      };
                    } else {
                      // If current locale is HY, store EN content in temporary fields
                      return {
                        ...item,
                        _headingEn: otherItem.heading || '',
                        _textEn: otherItem.text || '',
                      };
                    }
                  }
                  return item;
                }),
              };
            }
          }
        } catch (err) {
          // If other locale content can't be loaded, continue with current locale content
          console.warn('Could not load other locale content for membership page:', err);
        }
      }

      // For camps page, also load other locale's content to merge into armenianCamp and internationalCamp descriptionItems
      if (pageKey === 'camps') {
        const otherLocale = contentLocale === 'en' ? 'hy' : 'en';
        try {
          const otherResponse = await fetch(`/api/admin/content/${pageKey}?locale=${otherLocale}`);
          if (otherResponse.ok) {
            const otherData = await otherResponse.json();
            const otherContent = otherData.content;
            
            // Merge other locale's heading and text into armenianCamp.descriptionItems as temporary fields
            if (otherContent.armenianCamp?.descriptionItems && Array.isArray(otherContent.armenianCamp.descriptionItems) &&
                loadedContent.armenianCamp?.descriptionItems && Array.isArray(loadedContent.armenianCamp.descriptionItems)) {
              loadedContent.armenianCamp.descriptionItems = loadedContent.armenianCamp.descriptionItems.map((item: any, index: number) => {
                const otherItem = otherContent.armenianCamp.descriptionItems[index];
                if (otherItem) {
                  if (contentLocale === 'en') {
                    return {
                      ...item,
                      _headingHy: otherItem.heading || '',
                      _textHy: otherItem.text || '',
                    };
                  } else {
                    return {
                      ...item,
                      _headingEn: otherItem.heading || '',
                      _textEn: otherItem.text || '',
                    };
                  }
                }
                return item;
              });
            }
            
            // Merge other locale's heading and text into internationalCamp.descriptionItems as temporary fields
            if (otherContent.internationalCamp?.descriptionItems && Array.isArray(otherContent.internationalCamp.descriptionItems) &&
                loadedContent.internationalCamp?.descriptionItems && Array.isArray(loadedContent.internationalCamp.descriptionItems)) {
              loadedContent.internationalCamp.descriptionItems = loadedContent.internationalCamp.descriptionItems.map((item: any, index: number) => {
                const otherItem = otherContent.internationalCamp.descriptionItems[index];
                if (otherItem) {
                  if (contentLocale === 'en') {
                    return {
                      ...item,
                      _headingHy: otherItem.heading || '',
                      _textHy: otherItem.text || '',
                    };
                  } else {
                    return {
                      ...item,
                      _headingEn: otherItem.heading || '',
                      _textEn: otherItem.text || '',
                    };
                  }
                }
                return item;
              });
            }
          }
        } catch (err) {
          // If other locale content can't be loaded, continue with current locale content
          console.warn('Could not load other locale content for camps page:', err);
        }
      }

      setContent(loadedContent);
      setEditedContent(loadedContent);
      setError('');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      // Validate that content can be serialized to JSON
      try {
        JSON.stringify(editedContent);
      } catch (jsonError) {
        throw new Error('Content contains invalid data that cannot be saved');
      }

      // Process content to handle bilingual items and sync to other locale
      const processedContent = { ...editedContent };
      const otherLocale = contentLocale === 'en' ? 'hy' : 'en';
      let otherLocaleContent: any = null;

      // Check if we have items with bilingual data (from modal)
      if (pageKey === 'home' && processedContent.upcomingEvents) {
        const itemsForOtherLocale: any[] = [];
        processedContent.upcomingEvents = processedContent.upcomingEvents.map((item: any) => {
          // Check for HY data (when adding from EN locale)
          if ((item as any)._titleHy !== undefined || (item as any)._descriptionHy !== undefined) {
            itemsForOtherLocale.push({
              title: (item as any)._titleHy || '',
              description: (item as any)._descriptionHy || '',
              image: item.image || ''
            });
            const { _titleHy, _descriptionHy, ...cleanItem } = item;
            return cleanItem;
          }
          // Check for EN data (when adding from HY locale)
          if ((item as any)._titleEn !== undefined || (item as any)._descriptionEn !== undefined) {
            // Current item has HY data, store EN data for other locale
            itemsForOtherLocale.push({
              title: (item as any)._titleEn || '',
              description: (item as any)._descriptionEn || '',
              image: item.image || ''
            });
            // Remove temporary fields, keep HY data in main fields
            const { _titleEn, _descriptionEn, ...cleanItem } = item;
            return cleanItem;
          }
          return item;
        });

        // If we have items for other locale, sync them
        if (itemsForOtherLocale.length > 0) {
          // Load current other locale content
          try {
            const otherResponse = await fetch(`/api/admin/content/${pageKey}?locale=${otherLocale}`);
            if (otherResponse.ok) {
              const otherData = await otherResponse.json();
              otherLocaleContent = otherData.content || { upcomingEvents: [], programs: [] };
            }
          } catch {
            otherLocaleContent = { upcomingEvents: [], programs: [] };
          }

          // Merge items into other locale content (match by index and merge, or append)
          if (!otherLocaleContent.upcomingEvents) otherLocaleContent.upcomingEvents = [];
          itemsForOtherLocale.forEach((otherItem, index) => {
            const matchingIndex = processedContent.upcomingEvents.length - itemsForOtherLocale.length + index;
            if (otherLocaleContent.upcomingEvents[matchingIndex]) {
              otherLocaleContent.upcomingEvents[matchingIndex] = {
                ...otherLocaleContent.upcomingEvents[matchingIndex],
                title: otherItem.title || otherLocaleContent.upcomingEvents[matchingIndex].title,
                description: otherItem.description || otherLocaleContent.upcomingEvents[matchingIndex].description,
                image: otherItem.image || otherLocaleContent.upcomingEvents[matchingIndex].image
              };
            } else {
              otherLocaleContent.upcomingEvents.push(otherItem);
            }
          });
        }
      }

      // Same for programs
      if (pageKey === 'home' && processedContent.programs) {
        const itemsForOtherLocale: any[] = [];
        processedContent.programs = processedContent.programs.map((item: any) => {
          // Check for HY data (when adding from EN locale)
          if ((item as any)._titleHy !== undefined || (item as any)._descriptionHy !== undefined) {
            itemsForOtherLocale.push({
              title: (item as any)._titleHy || '',
              description: (item as any)._descriptionHy || '',
              image: item.image || ''
            });
            const { _titleHy, _descriptionHy, ...cleanItem } = item;
            return cleanItem;
          }
          // Check for EN data (when adding from HY locale)
          if ((item as any)._titleEn !== undefined || (item as any)._descriptionEn !== undefined) {
            itemsForOtherLocale.push({
              title: (item as any)._titleEn || '',
              description: (item as any)._descriptionEn || '',
              image: item.image || ''
            });
            // Remove temporary fields, keep HY data in main fields
            const { _titleEn, _descriptionEn, ...cleanItem } = item;
            return cleanItem;
          }
          return item;
        });

        if (itemsForOtherLocale.length > 0) {
          if (!otherLocaleContent) {
            try {
              const otherResponse = await fetch(`/api/admin/content/${pageKey}?locale=${otherLocale}`);
              if (otherResponse.ok) {
                const otherData = await otherResponse.json();
                otherLocaleContent = otherData.content || { upcomingEvents: [], programs: [] };
              } else {
                otherLocaleContent = { upcomingEvents: [], programs: [] };
              }
            } catch {
              otherLocaleContent = { upcomingEvents: processedContent.upcomingEvents || [], programs: [] };
            }
          }
          if (!otherLocaleContent.programs) otherLocaleContent.programs = [];
          itemsForOtherLocale.forEach((otherItem, index) => {
            const matchingIndex = processedContent.programs.length - itemsForOtherLocale.length + index;
            if (otherLocaleContent.programs[matchingIndex]) {
              otherLocaleContent.programs[matchingIndex] = {
                ...otherLocaleContent.programs[matchingIndex],
                title: otherItem.title || otherLocaleContent.programs[matchingIndex].title,
                description: otherItem.description || otherLocaleContent.programs[matchingIndex].description,
                image: otherItem.image || otherLocaleContent.programs[matchingIndex].image
              };
            } else {
              otherLocaleContent.programs.push(otherItem);
            }
          });
        }
      }

      // Handle ourTeam page departments.items
      if (pageKey === 'ourTeam' && processedContent.departments?.items) {
        const itemsForOtherLocale: any[] = [];
        processedContent.departments.items = processedContent.departments.items.map((item: any) => {
          // Check for bilingual data from modal (name/biography fields)
          const nameHyField = `_nameHy`;
          const biographyHyField = `_biographyHy`;
          const nameEnField = `_nameEn`;
          const biographyEnField = `_biographyEn`;
          
          // Check for HY data (when adding from EN locale)
          if ((item as any)[nameHyField] !== undefined || (item as any)[biographyHyField] !== undefined) {
            itemsForOtherLocale.push({
              name: (item as any)[nameHyField] || '',
              biography: (item as any)[biographyHyField] || '',
              image: item.image || ''
            });
            const { [nameHyField]: _, [biographyHyField]: __, ...cleanItem } = item;
            return cleanItem;
          }
          // Check for EN data (when adding from HY locale)
          if ((item as any)[nameEnField] !== undefined || (item as any)[biographyEnField] !== undefined) {
            itemsForOtherLocale.push({
              name: (item as any)[nameEnField] || '',
              biography: (item as any)[biographyEnField] || '',
              image: item.image || ''
            });
            const { [nameEnField]: _, [biographyEnField]: __, ...cleanItem } = item;
            return cleanItem;
          }
          return item;
        });

        if (itemsForOtherLocale.length > 0) {
          // Load current other locale content
          try {
            const otherResponse = await fetch(`/api/admin/content/${pageKey}?locale=${otherLocale}`);
            if (otherResponse.ok) {
              const otherData = await otherResponse.json();
              otherLocaleContent = otherData.content || { departments: { title: 'Departments', items: [] } };
            }
          } catch {
            otherLocaleContent = { departments: { title: 'Departments', items: [] } };
          }

          // Merge items into other locale content
          if (!otherLocaleContent.departments) {
            otherLocaleContent.departments = { title: 'Departments', items: [] };
          }
          if (!otherLocaleContent.departments.items) {
            otherLocaleContent.departments.items = [];
          }
          
          itemsForOtherLocale.forEach((otherItem, index) => {
            const matchingIndex = processedContent.departments.items.length - itemsForOtherLocale.length + index;
            if (otherLocaleContent.departments.items[matchingIndex]) {
              otherLocaleContent.departments.items[matchingIndex] = {
                ...otherLocaleContent.departments.items[matchingIndex],
                name: otherItem.name || otherLocaleContent.departments.items[matchingIndex].name,
                biography: otherItem.biography || otherLocaleContent.departments.items[matchingIndex].biography,
                image: otherItem.image || otherLocaleContent.departments.items[matchingIndex].image
              };
            } else {
              otherLocaleContent.departments.items.push(otherItem);
            }
          });
        }
      }

      // Handle marketing page headOfMarketing
      if (pageKey === 'marketing' && processedContent.headOfMarketing) {
        const headObj = processedContent.headOfMarketing;
        const nameHyField = `_nameHy`;
        const descriptionHyField = `_descriptionHy`;
        const nameEnField = `_nameEn`;
        const descriptionEnField = `_descriptionEn`;
        
        // Check if we have bilingual data
        let headForOtherLocale: any = null;
        
        // Check for HY data (when editing from EN locale)
        if ((headObj as any)[nameHyField] !== undefined || (headObj as any)[descriptionHyField] !== undefined) {
          headForOtherLocale = {
            name: (headObj as any)[nameHyField] || headObj.name || '',
            description: (headObj as any)[descriptionHyField] || headObj.description || '',
            linkedin: headObj.linkedin || '', // linkedin is shared across languages
            image: headObj.image || ''
          };
          // Remove temporary fields
          const { [nameHyField]: _, [descriptionHyField]: __, ...cleanHead } = headObj;
          processedContent.headOfMarketing = cleanHead;
        }
        // Check for EN data (when editing from HY locale)
        else if ((headObj as any)[nameEnField] !== undefined || (headObj as any)[descriptionEnField] !== undefined) {
          headForOtherLocale = {
            name: (headObj as any)[nameEnField] || '',
            description: (headObj as any)[descriptionEnField] || '',
            linkedin: headObj.linkedin || '', // linkedin is shared across languages
            image: headObj.image || ''
          };
          // Remove temporary fields, keep HY data in main fields
          const { [nameEnField]: _, [descriptionEnField]: __, ...cleanHead } = headObj;
          processedContent.headOfMarketing = cleanHead;
        }

        // Sync to other locale if we have data for it
        if (headForOtherLocale) {
          // Load current other locale content
          try {
            const otherResponse = await fetch(`/api/admin/content/${pageKey}?locale=${otherLocale}`);
            if (otherResponse.ok) {
              const otherData = await otherResponse.json();
              otherLocaleContent = otherData.content || { headOfMarketing: null, members: { title: 'Members', items: [] } };
            }
          } catch {
            otherLocaleContent = { headOfMarketing: null, members: { title: 'Members', items: [] } };
          }

          // Update headOfMarketing in other locale
          if (!otherLocaleContent.headOfMarketing) {
            otherLocaleContent.headOfMarketing = {};
          }
          otherLocaleContent.headOfMarketing = {
            ...otherLocaleContent.headOfMarketing,
            name: headForOtherLocale.name || otherLocaleContent.headOfMarketing.name || '',
            description: headForOtherLocale.description || otherLocaleContent.headOfMarketing.description || '',
            linkedin: headForOtherLocale.linkedin || otherLocaleContent.headOfMarketing.linkedin || '',
            image: headForOtherLocale.image || otherLocaleContent.headOfMarketing.image || ''
          };
        }
      }

      // Handle marketing page members.items
      if (pageKey === 'marketing' && processedContent.members?.items) {
        const itemsForOtherLocale: any[] = [];
        processedContent.members.items = processedContent.members.items.map((item: any) => {
          // Check for bilingual data from modal (name/description fields)
          const nameHyField = `_nameHy`;
          const descriptionHyField = `_descriptionHy`;
          const nameEnField = `_nameEn`;
          const descriptionEnField = `_descriptionEn`;
          
          // Check for HY data (when adding from EN locale)
          if ((item as any)[nameHyField] !== undefined || (item as any)[descriptionHyField] !== undefined) {
            itemsForOtherLocale.push({
              name: (item as any)[nameHyField] || '',
              description: (item as any)[descriptionHyField] || '',
              linkedin: item.linkedin || '', // linkedin is shared across languages
              image: item.image || ''
            });
            const { [nameHyField]: _, [descriptionHyField]: __, ...cleanItem } = item;
            return cleanItem;
          }
          // Check for EN data (when adding from HY locale)
          if ((item as any)[nameEnField] !== undefined || (item as any)[descriptionEnField] !== undefined) {
            itemsForOtherLocale.push({
              name: (item as any)[nameEnField] || '',
              description: (item as any)[descriptionEnField] || '',
              linkedin: item.linkedin || '', // linkedin is shared across languages
              image: item.image || ''
            });
            const { [nameEnField]: _, [descriptionEnField]: __, ...cleanItem } = item;
            return cleanItem;
          }
          return item;
        });

        if (itemsForOtherLocale.length > 0) {
          // Load current other locale content
          try {
            const otherResponse = await fetch(`/api/admin/content/${pageKey}?locale=${otherLocale}`);
            if (otherResponse.ok) {
              const otherData = await otherResponse.json();
              otherLocaleContent = otherData.content || { headOfMarketing: null, members: { title: 'Members', items: [] } };
            }
          } catch {
            otherLocaleContent = { headOfMarketing: null, members: { title: 'Members', items: [] } };
          }

          // Merge items into other locale content
          if (!otherLocaleContent.members) {
            otherLocaleContent.members = { title: 'Members', items: [] };
          }
          if (!otherLocaleContent.members.items) {
            otherLocaleContent.members.items = [];
          }
          
          itemsForOtherLocale.forEach((otherItem, index) => {
            const matchingIndex = processedContent.members.items.length - itemsForOtherLocale.length + index;
            if (otherLocaleContent.members.items[matchingIndex]) {
              otherLocaleContent.members.items[matchingIndex] = {
                ...otherLocaleContent.members.items[matchingIndex],
                name: otherItem.name || otherLocaleContent.members.items[matchingIndex].name,
                description: otherItem.description || otherLocaleContent.members.items[matchingIndex].description,
                linkedin: otherItem.linkedin || otherLocaleContent.members.items[matchingIndex].linkedin, // linkedin is shared
                image: otherItem.image || otherLocaleContent.members.items[matchingIndex].image
              };
            } else {
              otherLocaleContent.members.items.push(otherItem);
            }
          });
        }
      }

      // Handle camps page armenianCamp and internationalCamp descriptionItems
      if (pageKey === 'camps') {
        // Handle armenianCamp.descriptionItems
        if (processedContent.armenianCamp?.descriptionItems && Array.isArray(processedContent.armenianCamp.descriptionItems)) {
          const itemsForOtherLocale: any[] = [];
          processedContent.armenianCamp.descriptionItems = processedContent.armenianCamp.descriptionItems.map((item: any) => {
            const headingHyField = `_headingHy`;
            const textHyField = `_textHy`;
            const headingEnField = `_headingEn`;
            const textEnField = `_textEn`;
            
            if ((item as any)[headingHyField] !== undefined || (item as any)[textHyField] !== undefined) {
              itemsForOtherLocale.push({
                heading: (item as any)[headingHyField] || '',
                text: (item as any)[textHyField] || '',
                imageSrc: item.imageSrc || '',
                imagePosition: item.imagePosition || 'start',
                contentFontSize: item.contentFontSize || ''
              });
              const { [headingHyField]: _, [textHyField]: __, ...cleanItem } = item;
              return cleanItem;
            }
            if ((item as any)[headingEnField] !== undefined || (item as any)[textEnField] !== undefined) {
              itemsForOtherLocale.push({
                heading: (item as any)[headingEnField] || '',
                text: (item as any)[textEnField] || '',
                imageSrc: item.imageSrc || '',
                imagePosition: item.imagePosition || 'start',
                contentFontSize: item.contentFontSize || ''
              });
              const { [headingEnField]: _, [textEnField]: __, ...cleanItem } = item;
              return cleanItem;
            }
            return item;
          });

          if (itemsForOtherLocale.length > 0) {
            try {
              const otherResponse = await fetch(`/api/admin/content/${pageKey}?locale=${otherLocale}`);
              if (otherResponse.ok) {
                const otherData = await otherResponse.json();
                let otherLocaleContent = otherData.content || { armenianCamp: { descriptionItems: [] } };
                if (!otherLocaleContent.armenianCamp) {
                  otherLocaleContent.armenianCamp = { descriptionItems: [] };
                }
                if (!otherLocaleContent.armenianCamp.descriptionItems) {
                  otherLocaleContent.armenianCamp.descriptionItems = [];
                }
                
                itemsForOtherLocale.forEach((otherItem, index) => {
                  const matchingIndex = processedContent.armenianCamp.descriptionItems.length - itemsForOtherLocale.length + index;
                  if (otherLocaleContent.armenianCamp.descriptionItems[matchingIndex]) {
                    otherLocaleContent.armenianCamp.descriptionItems[matchingIndex] = {
                      ...otherLocaleContent.armenianCamp.descriptionItems[matchingIndex],
                      heading: otherItem.heading || otherLocaleContent.armenianCamp.descriptionItems[matchingIndex].heading,
                      text: otherItem.text || otherLocaleContent.armenianCamp.descriptionItems[matchingIndex].text,
                      imageSrc: otherItem.imageSrc || otherLocaleContent.armenianCamp.descriptionItems[matchingIndex].imageSrc,
                      imagePosition: otherItem.imagePosition || otherLocaleContent.armenianCamp.descriptionItems[matchingIndex].imagePosition,
                      contentFontSize: otherItem.contentFontSize || otherLocaleContent.armenianCamp.descriptionItems[matchingIndex].contentFontSize
                    };
                  } else {
                    otherLocaleContent.armenianCamp.descriptionItems.push(otherItem);
                  }
                });
                
                await fetch(`/api/admin/content/${pageKey}?locale=${otherLocale}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(otherLocaleContent),
                });
              }
            } catch (error) {
              console.error('Error syncing armenianCamp descriptionItems to other locale:', error);
            }
          }
        }

        // Handle internationalCamp.descriptionItems
        if (processedContent.internationalCamp?.descriptionItems && Array.isArray(processedContent.internationalCamp.descriptionItems)) {
          const itemsForOtherLocale: any[] = [];
          processedContent.internationalCamp.descriptionItems = processedContent.internationalCamp.descriptionItems.map((item: any) => {
            const headingHyField = `_headingHy`;
            const textHyField = `_textHy`;
            const headingEnField = `_headingEn`;
            const textEnField = `_textEn`;
            
            if ((item as any)[headingHyField] !== undefined || (item as any)[textHyField] !== undefined) {
              itemsForOtherLocale.push({
                heading: (item as any)[headingHyField] || '',
                text: (item as any)[textHyField] || '',
                imageSrc: item.imageSrc || '',
                imagePosition: item.imagePosition || 'start',
                contentFontSize: item.contentFontSize || ''
              });
              const { [headingHyField]: _, [textHyField]: __, ...cleanItem } = item;
              return cleanItem;
            }
            if ((item as any)[headingEnField] !== undefined || (item as any)[textEnField] !== undefined) {
              itemsForOtherLocale.push({
                heading: (item as any)[headingEnField] || '',
                text: (item as any)[textEnField] || '',
                imageSrc: item.imageSrc || '',
                imagePosition: item.imagePosition || 'start',
                contentFontSize: item.contentFontSize || ''
              });
              const { [headingEnField]: _, [textEnField]: __, ...cleanItem } = item;
              return cleanItem;
            }
            return item;
          });

          if (itemsForOtherLocale.length > 0) {
            try {
              const otherResponse = await fetch(`/api/admin/content/${pageKey}?locale=${otherLocale}`);
              if (otherResponse.ok) {
                const otherData = await otherResponse.json();
                let otherLocaleContent = otherData.content || { internationalCamp: { descriptionItems: [] } };
                if (!otherLocaleContent.internationalCamp) {
                  otherLocaleContent.internationalCamp = { descriptionItems: [] };
                }
                if (!otherLocaleContent.internationalCamp.descriptionItems) {
                  otherLocaleContent.internationalCamp.descriptionItems = [];
                }
                
                itemsForOtherLocale.forEach((otherItem, index) => {
                  const matchingIndex = processedContent.internationalCamp.descriptionItems.length - itemsForOtherLocale.length + index;
                  if (otherLocaleContent.internationalCamp.descriptionItems[matchingIndex]) {
                    otherLocaleContent.internationalCamp.descriptionItems[matchingIndex] = {
                      ...otherLocaleContent.internationalCamp.descriptionItems[matchingIndex],
                      heading: otherItem.heading || otherLocaleContent.internationalCamp.descriptionItems[matchingIndex].heading,
                      text: otherItem.text || otherLocaleContent.internationalCamp.descriptionItems[matchingIndex].text,
                      imageSrc: otherItem.imageSrc || otherLocaleContent.internationalCamp.descriptionItems[matchingIndex].imageSrc,
                      imagePosition: otherItem.imagePosition || otherLocaleContent.internationalCamp.descriptionItems[matchingIndex].imagePosition,
                      contentFontSize: otherItem.contentFontSize || otherLocaleContent.internationalCamp.descriptionItems[matchingIndex].contentFontSize
                    };
                  } else {
                    otherLocaleContent.internationalCamp.descriptionItems.push(otherItem);
                  }
                });
                
                await fetch(`/api/admin/content/${pageKey}?locale=${otherLocale}`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(otherLocaleContent),
                });
              }
            } catch (error) {
              console.error('Error syncing internationalCamp descriptionItems to other locale:', error);
            }
          }
        }
      }

      // Handle membership, centerUpJunior, futureUp, cursesAndActivities, conferences, eventOrganization, and upcomingEvents page descriptionItems
      if ((pageKey === 'membership' || pageKey === 'centerUpJunior' || pageKey === 'futureUp' || pageKey === 'cursesAndActivities' || pageKey === 'conferences' || pageKey === 'eventOrganization' || pageKey === 'upcomingEvents') && processedContent.descriptionItems) {
        const itemsForOtherLocale: any[] = [];
        processedContent.descriptionItems = processedContent.descriptionItems.map((item: any) => {
          // Check for bilingual data from modal (heading/text fields)
          const headingHyField = `_headingHy`;
          const textHyField = `_textHy`;
          const headingEnField = `_headingEn`;
          const textEnField = `_textEn`;
          
          // Check for HY data (when adding from EN locale)
          if ((item as any)[headingHyField] !== undefined || (item as any)[textHyField] !== undefined) {
            itemsForOtherLocale.push({
              heading: (item as any)[headingHyField] || '',
              text: (item as any)[textHyField] || '',
              imageSrc: item.imageSrc || '', // imageSrc is shared across languages
              imagePosition: item.imagePosition || 'start', // imagePosition is shared
              contentFontSize: item.contentFontSize || '' // contentFontSize is shared
            });
            const { [headingHyField]: _, [textHyField]: __, ...cleanItem } = item;
            return cleanItem;
          }
          // Check for EN data (when adding from HY locale)
          if ((item as any)[headingEnField] !== undefined || (item as any)[textEnField] !== undefined) {
            itemsForOtherLocale.push({
              heading: (item as any)[headingEnField] || '',
              text: (item as any)[textEnField] || '',
              imageSrc: item.imageSrc || '', // imageSrc is shared across languages
              imagePosition: item.imagePosition || 'start', // imagePosition is shared
              contentFontSize: item.contentFontSize || '' // contentFontSize is shared
            });
            const { [headingEnField]: _, [textEnField]: __, ...cleanItem } = item;
            return cleanItem;
          }
          return item;
        });

        if (itemsForOtherLocale.length > 0) {
          // Load current other locale content
          try {
            const otherResponse = await fetch(`/api/admin/content/${pageKey}?locale=${otherLocale}`);
            if (otherResponse.ok) {
              const otherData = await otherResponse.json();
              otherLocaleContent = otherData.content || { descriptionItems: [] };
            }
          } catch {
            otherLocaleContent = { descriptionItems: [] };
          }

          // Merge items into other locale content
          if (!otherLocaleContent.descriptionItems) {
            otherLocaleContent.descriptionItems = [];
          }
          
          itemsForOtherLocale.forEach((otherItem, index) => {
            const matchingIndex = processedContent.descriptionItems.length - itemsForOtherLocale.length + index;
            if (otherLocaleContent.descriptionItems[matchingIndex]) {
              otherLocaleContent.descriptionItems[matchingIndex] = {
                ...otherLocaleContent.descriptionItems[matchingIndex],
                heading: otherItem.heading || otherLocaleContent.descriptionItems[matchingIndex].heading,
                text: otherItem.text || otherLocaleContent.descriptionItems[matchingIndex].text,
                imageSrc: otherItem.imageSrc || otherLocaleContent.descriptionItems[matchingIndex].imageSrc, // shared
                imagePosition: otherItem.imagePosition || otherLocaleContent.descriptionItems[matchingIndex].imagePosition, // shared
                contentFontSize: otherItem.contentFontSize || otherLocaleContent.descriptionItems[matchingIndex].contentFontSize // shared
              };
            } else {
              otherLocaleContent.descriptionItems.push(otherItem);
            }
          });
        }
      }

      // Save current locale content
      let requestBody: string;
      try {
        requestBody = JSON.stringify(processedContent);
      } catch (jsonError) {
        throw new Error('Failed to serialize content for saving');
      }

      const response = await fetch(`/api/admin/content/${pageKey}?locale=${contentLocale}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
      });

      if (!response.ok) {
        // Check if response is JSON before parsing
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          try {
            const data = await response.json();
            throw new Error(data.error || `Failed to save content: ${response.status} ${response.statusText}`);
          } catch (parseError) {
            throw new Error(`Failed to save content: ${response.status} ${response.statusText}`);
          }
        } else {
          // Response is not JSON (likely HTML error page)
          const text = await response.text();
          // Try to extract error message from HTML if possible, otherwise use status
          throw new Error(`Failed to save content: ${response.status} ${response.statusText}. Please check the server logs for details.`);
        }
      }

      // Verify response is JSON
      const responseData = await response.json();
      if (!responseData.success) {
        throw new Error('Save operation did not complete successfully');
      }

      // Save other locale content if we updated it
      if (otherLocaleContent) {
        try {
          const otherResponse = await fetch(`/api/admin/content/${pageKey}?locale=${otherLocale}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(otherLocaleContent),
          });

          if (!otherResponse.ok) {
            console.warn('Failed to sync to other locale, but current locale saved successfully');
          }
        } catch (syncError) {
          console.warn('Error syncing to other locale:', syncError);
        }
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      
      // Reload content to reflect changes
      checkAuthAndLoadContent();
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving');
    } finally {
      setSaving(false);
    }
  };

  const updateNestedValue = (obj: any, path: string[], value: any): any => {
    if (path.length === 0) return value;
    const [key, ...rest] = path;
    return {
      ...obj,
      [key]: updateNestedValue(obj[key] || {}, rest, value),
    };
  };

  const handleFieldChange = (path: string[], value: any) => {
    setEditedContent((prev: any) => updateNestedValue(prev, path, value));
  };

  const renderEditableFields = (obj: any, prefix: string[] = []): React.ReactElement[] => {
    const fields: React.ReactElement[] = [];

    for (const [key, value] of Object.entries(obj)) {
      // Skip heroSection and mission for home page - only show upcomingEvents and programs
      if (pageKey === 'home' && (key === 'heroSection' || key === 'mission')) {
        continue;
      }

      // Skip tabs field for camps page
      if (pageKey === 'camps' && key === 'tabs') {
        continue;
      }

      // For camps page, only show the selected camp type
      // This must happen before any other processing
      if (pageKey === 'camps' && (key === 'armenianCamp' || key === 'internationalCamp')) {
        if (key === 'armenianCamp' && selectedCampTab !== 'armenian') {
          continue; // Skip armenianCamp if international is selected
        }
        if (key === 'internationalCamp' && selectedCampTab !== 'international') {
          continue; // Skip internationalCamp if armenian is selected
        }
      }

      const path = [...prefix, key];
      const fieldPath = path.join('.');

      if (typeof value === 'string') {
        // Special handling for image and linkedin fields - render as URL input
        const isImageField = key === 'image' || key.endsWith('Image') || key === 'imageSrc' || key === 'linkedin' || key.endsWith('Linkedin');
        
        // User-friendly labels for membership, centerUpJunior, futureUp, cursesAndActivities, conferences, eventOrganization, upcomingEvents, and camps pages
        let friendlyLabel = fieldPath;
        if (pageKey === 'membership' || pageKey === 'centerUpJunior' || pageKey === 'futureUp' || pageKey === 'cursesAndActivities' || pageKey === 'conferences' || pageKey === 'eventOrganization' || pageKey === 'upcomingEvents' || pageKey === 'camps') {
          const labelMap: Record<string, string> = {
            'heroSection.title': t('heroTitle', { default: 'Page Title' }),
            'description.heading': t('descriptionHeading', { default: 'Description Heading' }),
            'description.text': t('descriptionText', { default: 'Description Text' }),
            'registrationButton.text': t('registrationButtonText', { default: 'Registration Button Text' }),
            'testimonialsSection.title': t('testimonialsTitle', { default: 'Testimonials Title' }),
            'armenianCamp.title': t('armenianCampTitle', { default: 'Armenian Camp Title' }),
            'armenianCamp.description': t('armenianCampDescription', { default: 'Armenian Camp Description' }),
            'armenianCamp.buttonText': t('armenianCampButtonText', { default: 'Armenian Camp Button Text' }),
            'internationalCamp.title': t('internationalCampTitle', { default: 'International Camp Title' }),
            'internationalCamp.description': t('internationalCampDescription', { default: 'International Camp Description' }),
            'internationalCamp.buttonText': t('internationalCampButtonText', { default: 'International Camp Button Text' }),
          };
          friendlyLabel = labelMap[fieldPath] || fieldPath;
        }
        
        fields.push(
          <div key={fieldPath} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {friendlyLabel}
            </label>
            {isImageField ? (
              <input
                type="url"
                value={value}
                onChange={(e) => handleFieldChange(path, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
                placeholder={key === 'image' || key === 'imageSrc' ? t('imageUrl', { default: 'Image URL' }) : key === 'linkedin' ? 'LinkedIn URL' : 'URL'}
              />
            ) : (
              <textarea
                value={value}
                onChange={(e) => handleFieldChange(path, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
                rows={value.length > 100 ? 6 : 3}
                placeholder={t('enterField', { field: friendlyLabel })}
              />
            )}
          </div>
        );
      } else if (typeof value === 'number') {
        fields.push(
          <div key={fieldPath} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {fieldPath}
            </label>
            <input
              type="number"
              value={value}
              onChange={(e) => handleFieldChange(path, Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
            />
          </div>
        );
      } else if (typeof value === 'boolean') {
        fields.push(
          <div key={fieldPath} className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={value}
                onChange={(e) => handleFieldChange(path, e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {fieldPath}
              </span>
            </label>
          </div>
        );
      } else if (Array.isArray(value)) {
        // Special handling for home page arrays (upcomingEvents and programs)
        if ((key === 'upcomingEvents' || key === 'programs') && pageKey === 'home') {
          fields.push(
            <ArrayEditor
              key={fieldPath}
              label={key === 'upcomingEvents' ? t('upcomingEvents') : t('ourPrograms')}
              items={value}
              onItemsChange={(newItems) => handleFieldChange(path, newItems)}
              itemFields={['title', 'description', 'image']}
              contentLocale={contentLocale}
            />
          );
        } else if ((pageKey === 'membership' || pageKey === 'centerUpJunior' || pageKey === 'futureUp' || pageKey === 'cursesAndActivities' || pageKey === 'conferences' || pageKey === 'eventOrganization' || pageKey === 'upcomingEvents') && key === 'descriptionItems') {
          // Special handling for membership, centerUpJunior, futureUp, cursesAndActivities, conferences, eventOrganization, and upcomingEvents page descriptionItems
          fields.push(
            <MembershipDescriptionItemsEditor
              key={fieldPath}
              label={t('descriptionItems', { default: 'Description Items' })}
              items={value}
              onItemsChange={(newItems) => handleFieldChange(path, newItems)}
              contentLocale={contentLocale}
            />
          );
        } else if (pageKey === 'camps' && (key === 'armenianCamp' || key === 'internationalCamp')) {
          // Special handling for camps page armenianCamp and internationalCamp
          // No need for label/header since we have tabs at the top
          const campObj = value as any;
          if (campObj) {
            // Just render the fields without the wrapper label
            fields.push(...renderEditableFields(campObj, path));
          }
        } else if (pageKey === 'camps' && key === 'descriptionItems' && prefix.includes('armenianCamp')) {
          // Special handling for armenianCamp.descriptionItems
          fields.push(
            <MembershipDescriptionItemsEditor
              key={fieldPath}
              label={t('descriptionItems', { default: 'Description Items' })}
              items={value}
              onItemsChange={(newItems) => handleFieldChange(path, newItems)}
              contentLocale={contentLocale}
            />
          );
        } else if (pageKey === 'camps' && key === 'descriptionItems' && prefix.includes('internationalCamp')) {
          // Special handling for internationalCamp.descriptionItems
          fields.push(
            <MembershipDescriptionItemsEditor
              key={fieldPath}
              label={t('descriptionItems', { default: 'Description Items' })}
              items={value}
              onItemsChange={(newItems) => handleFieldChange(path, newItems)}
              contentLocale={contentLocale}
            />
          );
        } else {
          // Generic array editor for other arrays
          fields.push(
            <div key={fieldPath} className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {fieldPath} (Array - {value.length} items)
              </label>
              <textarea
                value={JSON.stringify(value, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value);
                    handleFieldChange(path, parsed);
                  } catch {
                    // Invalid JSON, ignore
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white font-mono text-sm"
                rows={Math.min(value.length * 2 + 2, 10)}
              />
            </div>
          );
        }
      } else if (typeof value === 'object' && value !== null) {
        // Special handling for ourTeam page departments object
        if (pageKey === 'ourTeam' && key === 'departments') {
          const departmentsObj = value as { items?: any[]; title?: string };
          if (departmentsObj.items && Array.isArray(departmentsObj.items)) {
            fields.push(
              <ArrayEditor
                key={fieldPath}
                label={t('departments', { default: 'Departments' })}
                items={departmentsObj.items}
                onItemsChange={(newItems) => handleFieldChange([...path, 'items'], newItems)}
                itemFields={['name', 'biography', 'image']}
                contentLocale={contentLocale}
              />
            );
            // Continue processing other properties of departments object (like title)
            if (departmentsObj.title) {
              fields.push(
                <div key={`${fieldPath}.title`} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {fieldPath}.title
                  </label>
                  <input
                    type="text"
                    value={departmentsObj.title}
                    onChange={(e) => handleFieldChange([...path, 'title'], e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
                  />
                </div>
              );
            }
          } else {
            // If no items array, render as normal object
            fields.push(
              <div key={fieldPath} className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  {fieldPath}
                </h3>
                {renderEditableFields(value, path)}
              </div>
            );
          }
        } else if (pageKey === 'marketing' && key === 'headOfMarketing') {
          // Special handling for marketing headOfMarketing - use same UI as members items
          const headObj = value as any;
          if (headObj) {
            fields.push(
              <HeadOfMarketingEditor
                key={fieldPath}
                label={t('headOfMarketing', { default: 'Head of Marketing' })}
                value={headObj}
                onChange={(newValue) => handleFieldChange(path, newValue)}
                contentLocale={contentLocale}
              />
            );
          }
        } else if (pageKey === 'marketing' && key === 'members') {
          // Special handling for marketing members object
          const membersObj = value as { items?: any[]; title?: string };
          if (membersObj.items && Array.isArray(membersObj.items)) {
            fields.push(
              <ArrayEditor
                key={fieldPath}
                label={t('members', { default: 'Members' })}
                items={membersObj.items}
                onItemsChange={(newItems) => handleFieldChange([...path, 'items'], newItems)}
                itemFields={['name', 'description', 'linkedin', 'image']}
                contentLocale={contentLocale}
              />
            );
            // Continue processing other properties of members object (like title)
            if (membersObj.title) {
              fields.push(
                <div key={`${fieldPath}.title`} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {fieldPath}.title
                  </label>
                  <input
                    type="text"
                    value={membersObj.title}
                    onChange={(e) => handleFieldChange([...path, 'title'], e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-default focus:border-primary-default dark:bg-gray-700 dark:text-white"
                  />
                </div>
              );
            }
          } else {
            // If no items array, render as normal object
            fields.push(
              <div key={fieldPath} className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  {fieldPath}
                </h3>
                {renderEditableFields(value, path)}
              </div>
            );
          }
        } else if ((pageKey === 'membership' || pageKey === 'centerUpJunior' || pageKey === 'futureUp' || pageKey === 'cursesAndActivities' || pageKey === 'conferences' || pageKey === 'eventOrganization' || pageKey === 'upcomingEvents') && (key === 'heroSection' || key === 'description' || key === 'registrationButton' || key === 'testimonialsSection')) {
          // Special handling for membership, centerUpJunior, futureUp, cursesAndActivities, conferences, eventOrganization, and upcomingEvents page objects - render with friendly labels
          const friendlyLabels: Record<string, string> = {
            'heroSection': t('heroSection', { default: 'Hero Section' }),
            'description': t('description', { default: 'Description' }),
            'registrationButton': t('registrationButton', { default: 'Registration Button' }),
            'testimonialsSection': t('testimonialsSection', { default: 'Testimonials Section' }),
          };
          fields.push(
            <div key={fieldPath} className="mb-6 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-900/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {friendlyLabels[key] || fieldPath}
              </h3>
              {renderEditableFields(value, path)}
            </div>
          );
        } else if (pageKey === 'camps' && (key === 'heroSection' || key === 'description')) {
          // Special handling for camps page objects - render with friendly labels
          const friendlyLabels: Record<string, string> = {
            'heroSection': t('heroSection', { default: 'Hero Section' }),
            'description': t('description', { default: 'Description' }),
          };
          fields.push(
            <div key={fieldPath} className="mb-6 p-4 border-2 border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-900/50">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {friendlyLabels[key] || fieldPath}
              </h3>
              {renderEditableFields(value, path)}
            </div>
          );
        } else {
          fields.push(
            <div key={fieldPath} className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                {fieldPath}
              </h3>
              {renderEditableFields(value, path)}
            </div>
          );
        }
      }
    }

    return fields;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600 dark:text-gray-400">{t('loading')}</div>
      </div>
    );
  }

  if (error && !editedContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
              >
                {t('backToDashboard')}
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t('edit')}: {pageKey}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              {/* Unified Language Switcher */}
              <div className="flex items-center gap-2 bg-gray-200 dark:bg-gray-700 rounded-md p-1">
                <button
                  onClick={() => setAdminLocale('en')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    adminLocale === 'en'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                  title="Language"
                >
                  EN
                </button>
                <button
                  onClick={() => setAdminLocale('hy')}
                  className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                    adminLocale === 'hy'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                  title="Language"
                >
                  HY
                </button>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-green-800 !text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-default disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? t('saving') : t('saveChanges')}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md text-green-600 dark:text-green-400">
            {t('contentSaved')}
          </div>
        )}

        {editedContent && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            {pageKey === 'camps' && (
              <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => setSelectedCampTab('armenian')}
                    className={`cursor-pointer
                      whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer transition-colors duration-200
                      ${
                        selectedCampTab === 'armenian'
                          ? 'border-green-600 text-green-600 dark:border-green-500 dark:text-green-500'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }
                    `}
                  >
                    {t('armenianCamp', { default: 'Armenian Camp' })}
                  </button>
                  <button
                    onClick={() => setSelectedCampTab('international')}
                    className={`
                      whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer transition-colors duration-200
                      ${
                        selectedCampTab === 'international'
                          ? 'border-green-600 text-green-600 dark:border-green-500 dark:text-green-500'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }
                    `}
                  >
                    {t('internationalCamp', { default: 'International Camp' })}
                  </button>
                </nav>
              </div>
            )}
            {renderEditableFields(editedContent)}
          </div>
        )}

        {!editedContent && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">{t('noContent')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

