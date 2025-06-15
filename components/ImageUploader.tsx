
import React, { useRef, useState, useCallback } from 'react';
import { UploadCloud, XCircle } from 'lucide-react'; // Using lucide-react for icons

interface ImageUploaderProps {
  onImageUpload: (file: File, base64: string) => void;
  disabled: boolean;
  currentImageUrl?: string | null;
  onClearImage: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, disabled, currentImageUrl, onClearImage }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (e.g., PNG, JPG, GIF).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      onImageUpload(file, e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!disabled) setDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
    if (disabled) return;

    const file = event.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  }, [disabled, onImageUpload]);


  if (currentImageUrl) {
    return (
      <div className="relative group">
        <img src={currentImageUrl} alt="Uploaded preview" className="w-full h-auto max-h-60 object-contain rounded-lg border-2 border-gray-600" />
        <button
          onClick={onClearImage}
          disabled={disabled}
          className="absolute top-2 right-2 p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full transition-opacity opacity-0 group-hover:opacity-100 disabled:opacity-50"
          aria-label="Clear image"
        >
          <XCircle size={20} />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={!disabled ? handleUploadClick : undefined}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                  ${disabled ? 'border-gray-700 bg-gray-800 cursor-not-allowed' : 'border-gray-600 hover:border-pink-500 hover:bg-gray-700'}
                  ${dragOver && !disabled ? 'border-pink-500 bg-gray-700' : ''}`}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        disabled={disabled}
      />
      <UploadCloud size={48} className={`mb-3 ${disabled ? 'text-gray-500' : 'text-gray-400 group-hover:text-pink-500'}`} />
      <p className={`text-sm ${disabled ? 'text-gray-500' : 'text-gray-400'}`}>
        <span className="font-semibold">Click to upload</span> or drag and drop
      </p>
      <p className={`text-xs ${disabled ? 'text-gray-600' : 'text-gray-500'}`}>PNG, JPG, GIF up to 10MB</p>
    </div>
  );
};

export default ImageUploader;
