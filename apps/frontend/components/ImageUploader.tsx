'use client';

import { useState, useRef, useCallback } from 'react';

interface ImageUploaderProps {
  value?: string;
  onChange?: (value: string) => void;
  onUpload?: (file: File) => Promise<string>;
  placeholder?: string;
  aspectRatio?: 'square' | 'video' | 'auto';
  maxSize?: number;
}

export function ImageUploader({
  value,
  onChange,
  onUpload,
  placeholder = '点击或拖拽上传图片',
  aspectRatio = 'square',
  maxSize = 5,
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectRatioClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: '',
  };

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

  const handleUpload = async (file: File) => {
    if (!validateFile(file)) return;

    setIsUploading(true);
    setError(null);

    try {
      let url: string;

      if (onUpload) {
        url = await onUpload(file);
      } else {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload/cover', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || '上传失败');
        }

        url = result.url;
      }

      onChange?.(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : '上传失败，请重试');
    } finally {
      setIsUploading(false);
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
        handleUpload(files[0]);
      }
    },
    [onChange, onUpload],
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleUpload(files[0]);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (value) {
    return (
      <div className="relative">
        <div
          className={`${aspectRatioClasses[aspectRatio]} rounded-xl overflow-hidden bg-gray-100 border border-gray-200 cursor-pointer relative group`}
          onClick={() => fileInputRef.current?.click()}
        >
          <img src={`${process.env.NEXT_PUBLIC_API_BASE}${value}`} alt="预览" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="flex gap-3">
              <button
                type="button"
                className="px-4 py-2 bg-white text-gray-800 rounded-lg font-medium text-sm hover:bg-gray-100 transition-colors"
              >
                更换图片
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="px-4 py-2 bg-rose-500 text-white rounded-lg font-medium text-sm hover:bg-rose-600 transition-colors"
              >
                删除
              </button>
            </div>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div>
      <div
        className={`${aspectRatioClasses[aspectRatio]} rounded-xl border-2 border-dashed transition-all cursor-pointer relative ${
          isDragging
            ? 'border-rose-400 bg-rose-50'
            : 'border-gray-300 hover:border-rose-300 bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        {isUploading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-rose-400 mb-3"></div>
            <p className="text-sm text-gray-500">上传中...</p>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <svg
              className={`w-10 h-10 mb-3 ${isDragging ? 'text-rose-400' : 'text-gray-400'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className={`text-sm text-center ${isDragging ? 'text-rose-500' : 'text-gray-500'}`}>
              {placeholder}
            </p>
            <p className="text-xs text-gray-400 mt-2">支持 jpg、png、webp 格式，最大 {maxSize}MB</p>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
      {error && <p className="mt-2 text-sm text-rose-500">{error}</p>}
    </div>
  );
}
