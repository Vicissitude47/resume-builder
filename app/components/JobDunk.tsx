import { useState } from 'react';
import ModelSelector from './ModelSelector';

export default function JobDunk() {
  const [selectedModel, setSelectedModel] = useState('gpt-4-0125-preview');

  const handleModelChange = (model: string) => {
    setSelectedModel(model);
    // 这里可以添加其他逻辑，比如保存到 localStorage
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">JobDunk</h2>
      
      {/* 模型选择部分 */}
      <div className="mb-8">
        <ModelSelector
          selectedModel={selectedModel}
          onModelChange={handleModelChange}
        />
      </div>

      {/* 其他 JobDunk 内容 */}
      <div className="bg-white rounded-lg shadow p-6">
        {/* 这里添加 JobDunk 的其他功能 */}
      </div>
    </div>
  );
} 