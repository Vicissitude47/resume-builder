'use client';

import React, { useState } from 'react';
import { determineUserType } from '../utils/api';

interface UserInfo {
  name: string;
  educationLevel: string;
  graduationYear: number;
  major: string;
  skills: string[];
  interests: string[];
}

export default function UserInfoForm({ onSubmit }: { onSubmit: (data: UserInfo) => void }) {
  const [formData, setFormData] = useState<UserInfo>({
    name: '',
    educationLevel: '',
    graduationYear: new Date().getFullYear(),
    major: '',
    skills: [],
    interests: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayInput = (e: React.ChangeEvent<HTMLInputElement>, field: 'skills' | 'interests') => {
    const values = e.target.value.split(',').map(item => item.trim());
    setFormData(prev => ({
      ...prev,
      [field]: values
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          姓名
        </label>
        <input
          type="text"
          name="name"
          id="name"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.name}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-700">
          教育程度
        </label>
        <select
          name="educationLevel"
          id="educationLevel"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.educationLevel}
          onChange={handleChange}
        >
          <option value="">請選擇...</option>
          <option value="undergraduate">本科在讀</option>
          <option value="graduate">研究生在讀</option>
          <option value="graduated">已畢業</option>
        </select>
      </div>

      <div>
        <label htmlFor="graduationYear" className="block text-sm font-medium text-gray-700">
          畢業年份
        </label>
        <input
          type="number"
          name="graduationYear"
          id="graduationYear"
          required
          min={2020}
          max={2030}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.graduationYear}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="major" className="block text-sm font-medium text-gray-700">
          專業
        </label>
        <input
          type="text"
          name="major"
          id="major"
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.major}
          onChange={handleChange}
        />
      </div>

      <div>
        <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
          技能（用逗號分隔）
        </label>
        <input
          type="text"
          name="skills"
          id="skills"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.skills.join(', ')}
          onChange={(e) => handleArrayInput(e, 'skills')}
          placeholder="例如：Python, JavaScript, React"
        />
      </div>

      <div>
        <label htmlFor="interests" className="block text-sm font-medium text-gray-700">
          興趣（用逗號分隔）
        </label>
        <input
          type="text"
          name="interests"
          id="interests"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={formData.interests.join(', ')}
          onChange={(e) => handleArrayInput(e, 'interests')}
          placeholder="例如：Web開發, 機器學習, 移動應用開發"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          下一步
        </button>
      </div>
    </form>
  );
} 