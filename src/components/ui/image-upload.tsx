import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './button';
import { X } from 'lucide-react';

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  onError: (error: Error) => void;
}

export function ImageUpload({ value, onChange, onError }: ImageUploadProps) {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        const imageUrls = await Promise.all(
          acceptedFiles.map((file) => {
            return new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                resolve(reader.result as string);
              };
              reader.readAsDataURL(file);
            });
          })
        );

        onChange([...value, ...imageUrls]);
      } catch (error) {
        onError(error as Error);
      }
    },
    [value, onChange, onError]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxSize: 5242880, // 5MB
  });

  const removeImage = (index: number) => {
    const newImages = [...value];
    newImages.splice(index, 1);
    onChange(newImages);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-sm text-gray-600">
          {isDragActive
            ? 'Solte as imagens aqui...'
            : 'Arraste e solte imagens aqui, ou clique para selecionar'}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          Formatos aceitos: PNG, JPG, JPEG (máx. 5MB)
        </p>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((url, index) => (
            <div key={index} className="relative group">
              <img
                src={url}
                alt={`Imagem ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}