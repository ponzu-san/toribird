"use client";

import { useRef, useState, useEffect } from "react";
import ImageCropModal from "./ImageCropModal";

interface PhotoPickerProps {
  previewUrl: string | null;
  onPhotoChange: (file: File | null) => void;
  onRemovePhoto: () => void;
}

function DiaryPhotoFrame({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
      <img src={src} alt={alt} className="max-h-full max-w-full object-contain" />
    </div>
  );
}

export default function PhotoPicker({ previewUrl, onPhotoChange, onRemovePhoto }: PhotoPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
      if (cropImageSrc) URL.revokeObjectURL(cropImageSrc);
    };
  }, [localPreview, cropImageSrc]);

  const displayUrl = localPreview ?? previewUrl;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (cropImageSrc) URL.revokeObjectURL(cropImageSrc);
    setCropImageSrc(URL.createObjectURL(file));
  };

  const handleCropConfirm = (file: File) => {
    if (cropImageSrc) URL.revokeObjectURL(cropImageSrc);
    setCropImageSrc(null);

    if (localPreview) URL.revokeObjectURL(localPreview);
    setLocalPreview(URL.createObjectURL(file));
    onPhotoChange(file);

    if (inputRef.current) inputRef.current.value = "";
  };

  const handleCropCancel = () => {
    if (cropImageSrc) URL.revokeObjectURL(cropImageSrc);
    setCropImageSrc(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = () => {
    if (localPreview) {
      URL.revokeObjectURL(localPreview);
      setLocalPreview(null);
    }
    if (inputRef.current) inputRef.current.value = "";
    onPhotoChange(null);
    onRemovePhoto();
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">写真（1枚）</label>

      {displayUrl ? (
        <div className="relative">
          <DiaryPhotoFrame src={displayUrl} alt="日記の写真" />
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-700 shadow backdrop-blur transition hover:bg-white"
            >
              変更
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-red-600 shadow backdrop-blur transition hover:bg-white"
            >
              削除
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 py-10 transition hover:border-blue-400 hover:bg-blue-50"
        >
          <svg className="h-8 w-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm text-gray-500">タップして写真を追加</span>
        </button>
      )}

      <input ref={inputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />

      {cropImageSrc && <ImageCropModal imageSrc={cropImageSrc} onConfirm={handleCropConfirm} onCancel={handleCropCancel} />}
    </div>
  );
}
