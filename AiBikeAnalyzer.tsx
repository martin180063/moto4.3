import React, { useState } from 'react';
import { analyzeImage, fileToGenerativePart } from './geminiService';
export const AiBikeAnalyzer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysisResult('');
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      const base64Data = await fileToGenerativePart(selectedFile);
      const mimeType = selectedFile.type;
      
      const prompt = "你是專業的機車技師。請詳細檢查這張圖片中的機車部件。指出任何可見的磨損、損壞、生鏽或安全隱患。如果一切看起來正常，請確認其狀態良好。請用繁體中文回答。";
      
      const result = await analyzeImage(base64Data, mimeType, prompt);
      setAnalysisResult(result);
    } catch (err) {
      setError("分析失敗，請重試。");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 rounded-xl bg-white/90 p-6 shadow-md border border-indigo-100 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-rounded text-indigo-600 text-2xl">document_scanner</span>
        <h3 className="text-xl font-bold text-indigo-900">AI 智能技師檢查</h3>
      </div>
      <p className="mb-4 text-sm text-indigo-700">
        不確定輪胎紋路是否足夠？或是鏈條是否太鬆？上傳照片讓 AI 幫你檢查！
      </p>

      <div className="space-y-4">
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-indigo-300 bg-indigo-50/50 p-6 transition-colors hover:bg-indigo-50/80">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-slate-500 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-indigo-700 hover:file:bg-indigo-200"
          />
        </div>

        {previewUrl && (
          <div className="relative overflow-hidden rounded-lg border border-indigo-200">
            <img src={previewUrl} alt="Preview" className="max-h-64 w-full object-cover" />
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={!selectedFile || isLoading}
          className={`flex w-full items-center justify-center rounded-lg px-4 py-3 font-bold text-white transition-all
            ${!selectedFile || isLoading 
              ? 'bg-slate-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30'}`}
        >
          {isLoading ? 'AI 正在檢查中...' : '開始分析車況'}
        </button>

        {error && (
          <div className="rounded-lg bg-red-100 p-3 text-red-700">
            {error}
          </div>
        )}

        {analysisResult && (
          <div className="mt-4 rounded-lg bg-white p-4 shadow-inner border border-indigo-50">
            <h4 className="mb-2 font-bold text-indigo-900">檢查報告：</h4>
            <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-line">
              {analysisResult}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
