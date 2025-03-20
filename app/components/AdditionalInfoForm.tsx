'use client';

import React, { useState } from 'react';
import { useFormPersist } from '../hooks/useFormPersist';
import { STORAGE_KEYS } from '../utils/storage';

interface WorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface AdditionalInfo {
  targetPosition: string;
  workExperiences: WorkExperience[];
  hasWorkOpportunity: boolean;
  workOpportunityType?: 'FAMILY_FRIEND' | 'SELF_COMPANY' | 'NONE';
  opportunityDetails?: {
    company?: string;
    position?: string;
    businessArea?: string;
  };
}

interface Props {
  userType: 'CURRENT_STUDENT' | 'RECENT_GRADUATE' | 'EXPERIENCED_SEEKER';
  onSubmit: (data: AdditionalInfo) => void;
}

export default function AdditionalInfoForm({ userType, onSubmit }: Props) {
  const [formData, setFormData, resetFormData] = useFormPersist<AdditionalInfo>(
    STORAGE_KEYS.ADDITIONAL_INFO,
    {
      targetPosition: '',
      workExperiences: [],
      hasWorkOpportunity: false,
      workOpportunityType: 'NONE',
    }
  );

  const [showWorkExperienceForm, setShowWorkExperienceForm] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<WorkExperience>({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    description: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleWorkOpportunityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as AdditionalInfo['workOpportunityType'];
    setFormData(prev => ({
      ...prev,
      workOpportunityType: value,
      hasWorkOpportunity: value !== 'NONE',
      opportunityDetails: value === 'NONE' ? undefined : {},
    }));
  };

  const handleOpportunityDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      opportunityDetails: {
        ...prev.opportunityDetails,
        [name]: value,
      },
    }));
  };

  const handleExperienceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentExperience(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddExperience = () => {
    setFormData(prev => ({
      ...prev,
      workExperiences: [...prev.workExperiences, currentExperience]
    }));
    setCurrentExperience({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: '',
    });
    setShowWorkExperienceForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">补充信息收集</h2>
        <p className="text-gray-600">
          请填写以下信息，帮助我们为你生成更准确的简历和学习计划。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="form-card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">目标职位信息</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="targetPosition" className="block text-sm font-medium text-gray-700">
                目标职位
              </label>
              <input
                type="text"
                name="targetPosition"
                id="targetPosition"
                required
                className="input-field"
                value={formData.targetPosition}
                onChange={handleChange}
                placeholder="例如：前端开发工程师"
              />
            </div>
          </div>
        </div>

        <div className="form-card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">工作经验</h3>
          {formData.workExperiences.map((exp, index) => (
            <div key={index} className="mb-4 p-4 border rounded-lg bg-blue-50 border-blue-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-blue-900">{exp.position}</p>
                  <p className="text-blue-700">{exp.company}</p>
                  <p className="text-sm text-blue-600">{exp.startDate} - {exp.endDate}</p>
                </div>
              </div>
              <p className="text-sm mt-2 text-blue-800">{exp.description}</p>
            </div>
          ))}
          
          {showWorkExperienceForm ? (
            <div className="space-y-4 border rounded-lg p-6 bg-gray-50">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">公司名称</label>
                <input
                  type="text"
                  name="company"
                  id="company"
                  className="input-field"
                  value={currentExperience.company}
                  onChange={handleExperienceChange}
                />
              </div>
              <div>
                <label htmlFor="position" className="block text-sm font-medium text-gray-700">职位</label>
                <input
                  type="text"
                  name="position"
                  id="position"
                  className="input-field"
                  value={currentExperience.position}
                  onChange={handleExperienceChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">开始日期</label>
                  <input
                    type="date"
                    name="startDate"
                    id="startDate"
                    className="input-field"
                    value={currentExperience.startDate}
                    onChange={handleExperienceChange}
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">结束日期</label>
                  <input
                    type="date"
                    name="endDate"
                    id="endDate"
                    className="input-field"
                    value={currentExperience.endDate}
                    onChange={handleExperienceChange}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">工作描述</label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  className="input-field"
                  value={currentExperience.description}
                  onChange={handleExperienceChange}
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowWorkExperienceForm(false)}
                  className="btn-secondary"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="btn-primary"
                >
                  添加
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowWorkExperienceForm(true)}
              className="btn-secondary w-full flex items-center justify-center space-x-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              <span>添加工作经验</span>
            </button>
          )}
        </div>

        <div className="form-card">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">潜在工作机会</h3>
          <div className="space-y-6">
            <div>
              <label htmlFor="workOpportunityType" className="block text-sm font-medium text-gray-700">
                是否有潜在工作机会？
              </label>
              <select
                id="workOpportunityType"
                name="workOpportunityType"
                className="input-field"
                value={formData.workOpportunityType}
                onChange={handleWorkOpportunityChange}
              >
                <option value="NONE">没有</option>
                <option value="FAMILY_FRIEND">家庭/朋友公司</option>
                <option value="SELF_COMPANY">自营公司</option>
              </select>
            </div>

            {formData.hasWorkOpportunity && formData.opportunityDetails && (
              <div className="space-y-4 border rounded-lg p-6 bg-gray-50">
                <div>
                  <label htmlFor="opportunityCompany" className="block text-sm font-medium text-gray-700">
                    公司名称
                  </label>
                  <input
                    type="text"
                    id="opportunityCompany"
                    name="company"
                    className="input-field"
                    value={formData.opportunityDetails.company || ''}
                    onChange={handleOpportunityDetailsChange}
                  />
                </div>
                <div>
                  <label htmlFor="opportunityPosition" className="block text-sm font-medium text-gray-700">
                    职位
                  </label>
                  <input
                    type="text"
                    id="opportunityPosition"
                    name="position"
                    className="input-field"
                    value={formData.opportunityDetails.position || ''}
                    onChange={handleOpportunityDetailsChange}
                  />
                </div>
                <div>
                  <label htmlFor="opportunityBusinessArea" className="block text-sm font-medium text-gray-700">
                    业务领域
                  </label>
                  <input
                    type="text"
                    id="opportunityBusinessArea"
                    name="businessArea"
                    className="input-field"
                    value={formData.opportunityDetails.businessArea || ''}
                    onChange={handleOpportunityDetailsChange}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="btn-primary"
          >
            下一步
          </button>
        </div>
      </form>
    </div>
  );
} 