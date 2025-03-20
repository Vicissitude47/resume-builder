'use client';

import React, { useEffect, useState } from 'react';
import { generateResume } from '../utils/llm';
import ReactMarkdown from 'react-markdown';
import { STORAGE_KEYS } from '../utils/storage';

interface Props {
  onBack: () => void;
}

export default function ResumeResult({ onBack }: Props) {
  const [resumeContent, setResumeContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function generateResumeContent() {
      try {
        // 从 localStorage 获取所有必要信息
        const userType = localStorage.getItem(STORAGE_KEYS.USER_TYPE);
        const additionalInfo = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADDITIONAL_INFO) || '{}');
        const projectExperiences = JSON.parse(localStorage.getItem(STORAGE_KEYS.PROJECT_EXPERIENCE) || '{}');

        if (!userType) {
          throw new Error('未找到用户类型信息');
        }

        const result = await generateResume({
          userType: userType as any,
          additionalInfo,
          projectExperiences: projectExperiences.projects || []
        });

        setResumeContent(result);
      } catch (err) {
        console.error('生成简历时出错:', err);
        setError(err instanceof Error ? err.message : '生成简历时出现错误');
      } finally {
        setIsLoading(false);
      }
    }

    generateResumeContent();
  }, []);

  const handleDownload = () => {
    const blob = new Blob([resumeContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '我的简历.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 text-center">
        <div className="mb-8">
          <h2 className="page-title">正在生成你的简历</h2>
          <p className="text-gray-600 text-lg">
            请稍候，我们正在根据你提供的信息生成专业的简历内容...
          </p>
        </div>
        <div className="flex justify-center">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="form-card border-red-200 bg-red-50">
          <div className="flex items-center mb-4">
            <svg className="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold text-red-800">生成简历时出现错误</h2>
          </div>
          <p className="text-red-600 mb-6">{error}</p>
          <div className="flex justify-between">
            <button
              onClick={onBack}
              className="btn-secondary"
            >
              <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回修改
            </button>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              重试
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="mb-8 flex justify-between items-center">
        <h2 className="page-title">你的简历</h2>
        <div className="space-x-4">
          <button
            onClick={onBack}
            className="btn-secondary"
          >
            <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回修改
          </button>
          <button
            onClick={handleDownload}
            className="btn-primary"
          >
            <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            下载简历
          </button>
        </div>
      </div>

      <div className="form-card prose prose-lg max-w-none">
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-center mb-2">
            <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold text-blue-900">提示</span>
          </div>
          <p className="text-blue-800 text-sm">
            你可以点击"下载简历"按钮来保存简历内容，或者点击"返回修改"来调整信息。
          </p>
        </div>
        <ReactMarkdown>{resumeContent}</ReactMarkdown>
      </div>
    </div>
  );
} 