'use client';

import { useState, useRef, useCallback } from 'react';

interface GalleryUploaderProps {
  value?: string[];
  onChange?: (value: string[]) => void;
  maxCount?: number;
  maxSize?: number;
}

export function GalleryUploader({
  value = [],
  onChange,
  maxCount = 6,
  maxSize = 5,
}: GalleryUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const remainingSlots = maxCount - value.length;

  const validateFile = (file: File): boolean => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('只支持 jpeg、jpg、png、webp 格式的图片');
      return false;
    }
    if (file.size > maxSize * 1024 * 1024) {
      setError(`图片大小不能超过 ${maxSize}MB`);
      return false;
    }
    return true;
  };

  const handleUpload = async (files: FileList) => {
    setError(null);
    setIsUploading(true);
    setUploadProgress(0);

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(validateFile);

    if (validFiles.length === 0) {
      setIsUploading(false);
      setUploadProgress(null);
      return;
    }

    if (validFiles.length > remainingSlots) {
      setError(`最多还能上传 ${remainingSlots} 张图片`);
      setIsUploading(false);
      setUploadProgress(null);
      return;
    }

    try {
      const formData = new FormData();
      validFiles.forEach((file) => {
        formData.append('files', file);
      });

      const response = await fetch('/api/upload/gallery', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || '上传失败');
      }

      const newUrls = result.urls.map((item: { url: string }) => item.url);
      onChange?.([...value, ...newUrls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败，请重试');
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleUpload(files);
      }
    },
    [value, onChange, remainingSlots],
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUpload(files);
    }
    e.target.value = '';
  };

  const handleRemove = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newValue = value.filter((_, i) => i !== index);
    onChange?.(newValue);
  };

  const handleClickSlot = () => {
    if (value.length < maxCount && !isUploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {value.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 relative group cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <img src={`${process.env.NEXT_PUBLIC_API_BASE}${url}`} alt={`相册 ${index + 1}`} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={(e) => handleRemove(index, e)}
                className="p-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
            <div className="absolute top-1 right-1 bg-rose-500 text-white text-xs px-1.5 py-0.5 rounded">
              {index + 1}
            </div>
          </div>
        ))}

        {value.length < maxCount && (
          <div
            className={`aspect-square rounded-xl border-2 border-dashed transition-all cursor-pointer relative ${
              isDragging
                ? 'border-rose-400 bg-rose-50'
                : 'border-gray-300 hover:border-rose-300 bg-gray-50'
            } ${isUploading ? 'pointer-events-none' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClickSlot}
          >
            {isUploading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 rounded-xl">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-400 mb-2"></div>
                <p className="text-xs text-gray-500">上传中...</p>
              </div>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                <svg
                  className={`w-8 h-8 mb-1 ${isDragging ? 'text-rose-400' : 'text-gray-400'}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <p className={`text-xs text-center ${isDragging ? 'text-rose-500' : 'text-gray-500'}`}>
                  添加照片
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {value.length}/{maxCount}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && <p className="mt-2 text-sm text-rose-500">{error}</p>}

      <p className="mt-2 text-xs text-gray-400">
        已添加 {value.length} 张，还能上传 {remainingSlots} 张
      </p>
    </div>
  );
}
