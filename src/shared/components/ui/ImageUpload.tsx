"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  onUpload: (file: File) => Promise<string>;
  placeholder?: string;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  onUpload,
  placeholder = "이미지를 업로드하세요",
  className = "",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    setUploading(true);
    try {
      const url = await onUpload(file);
      onChange(url);
    } catch (error) {
      console.error("Upload error:", error);
      alert("업로드 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleRemove = () => {
    onChange("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />

      {value ? (
        <div className="relative group">
          <img
            src={value}
            alt="Uploaded"
            className="w-full h-48 object-cover rounded-lg border border-gray-200"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="p-2 bg-white rounded-full text-gray-700 hover:text-brand-700 transition-colors"
              title="이미지 변경"
            >
              <Upload className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 bg-white rounded-full text-gray-700 hover:text-red-600 transition-colors"
              title="이미지 삭제"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !uploading && inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative h-48 border-2 border-dashed rounded-lg cursor-pointer transition-all
            flex flex-col items-center justify-center gap-2
            ${dragOver ? "border-brand-500 bg-brand-50" : "border-gray-300 hover:border-brand-400 hover:bg-gray-50"}
            ${uploading ? "pointer-events-none opacity-70" : ""}
          `}
        >
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
              <span className="text-sm text-gray-500">업로드 중...</span>
            </>
          ) : (
            <>
              <ImageIcon className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-500">{placeholder}</span>
              <span className="text-xs text-gray-400">드래그 앤 드롭 또는 클릭</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}
