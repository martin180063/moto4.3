import React, { useState, useRef, useEffect } from 'react';
import { editImage, fileToGenerativePart } from '../services/geminiService';

export const AiPhotoEditor: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Common file handler
  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
        setError("請上傳圖片檔案 (JPG, PNG 等)");
        return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setGeneratedImage(null);
    setError(null);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      handleFile(event.target.files[0]);
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // Paste handler
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0];
        if (file.type.startsWith('image/')) {
          handleFile(file);
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleEdit = async () => {
    if (!selectedFile || !prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const base64Data = await fileToGenerativePart(selectedFile);
      const mimeType = selectedFile.type;
      
      const fullPrompt = `Edit this image based on the following instruction: ${prompt}. Ensure high quality output.`;
      
      const resultBase64 = await editImage(base64Data, mimeType, fullPrompt);
      
      if (resultBase64) {
        setGeneratedImage(resultBase64);
      } else {
        setError("無法生成圖片，請嘗試不同的指令。");
      }
    } catch (err) {
      setError("編輯失敗，請重試。");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 rounded-xl bg-white/90 p-6 shadow-md border border-emerald-100 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-rounded text-emerald-600 text-2xl">image_edit_auto</span>
        <h3 className="text-xl font-bold text-emerald-900">AI 風景魔術師</h3>
      </div>
      <p className="mb-4 text-sm text-emerald-700">
        想把晴天變成夕陽？或是加點復古濾鏡？拖放照片、貼上剪貼簿內容，或點擊上傳！
      </p>

      <div className="space-y-4">
        {/* Enhanced Upload Area */}
        <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all cursor-pointer text-center group
                ${isDragging 
                    ? 'border-emerald-500 bg-emerald-100 scale-[1.02]' 
                    : 'border-emerald-300 bg-emerald-50/50 hover:bg-emerald-50/80 hover:border-emerald-400'
                }`}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden" 
            />
            <div className={`mb-3 flex h-16 w-16 items-center justify-center rounded-full transition-all
                ${isDragging ? 'bg-emerald-200 text-emerald-700' : 'bg-white text-emerald-500 group-hover:bg-emerald-100 group-hover:scale-110'}`}>
                <span className="material-symbols-rounded text-3xl">add_photo_alternate</span>
            </div>
            <p className="text-emerald-800 font-bold text-lg">點擊上傳 或 拖放照片至此</p>
            <p className="text-emerald-600/70 text-sm mt-1">亦支援 Ctrl+V 貼上截圖</p>
        </div>

        {/* Input & Button */}
        <div className="flex gap-2">
            <input 
                type="text" 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="例如：加入夕陽濾鏡、變成油畫風格..."
                className="flex-1 rounded-lg border border-emerald-200 p-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
        </div>
        <button
          onClick={handleEdit}
          disabled={!selectedFile || !prompt || isLoading}
          className={`flex w-full items-center justify-center rounded-lg px-4 py-3 font-bold text-white transition-all
            ${!selectedFile || !prompt || isLoading 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg hover:shadow-emerald-500/30'}`}
        >
          {isLoading ? 'AI 正在施法...' : '開始修圖'}
        </button>

        {error && (
          <div className="rounded-lg bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

        {/* Results Grid */}
        <div className="grid gap-4 md:grid-cols-2">
            {previewUrl && (
            <div className="space-y-2">
                <p className="text-xs font-bold text-slate-500">原圖</p>
                <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-1">
                    <img src={previewUrl} alt="Original" className="h-48 w-full object-contain" />
                </div>
            </div>
            )}
            
            {generatedImage ? (
                <div className="space-y-2">
                    <p className="text-xs font-bold text-emerald-600">AI 生成</p>
                    <div className="relative overflow-hidden rounded-lg border border-emerald-200 bg-white p-1">
                        <img src={generatedImage} alt="AI Generated" className="h-48 w-full object-contain" />
                        <a 
                            href={generatedImage} 
                            download="ai_edited_trip_photo.png"
                            className="absolute bottom-2 right-2 rounded-full bg-white/90 p-2 text-emerald-600 shadow-md hover:text-emerald-800"
                            title="Download"
                        >
                            <span className="material-symbols-rounded text-xl">download</span>
                        </a>
                    </div>
                </div>
            ) : isLoading ? (
                 <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-emerald-200 bg-white/30">
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
                        <span className="animate-pulse text-sm font-bold text-emerald-600">AI 繪圖中...</span>
                    </div>
                 </div>
            ) : null}
        </div>
      </div>
    </div>
  );
};