'use client';

import React, { useState } from 'react';
import { useFormPersist } from '../hooks/useFormPersist';
import { STORAGE_KEYS } from '../utils/storage';

interface ProjectExperience {
  name: string;
  description: string;
  techStack: string[];
  features: string[];
  timeline: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
}

interface FormData {
  projects: ProjectExperience[];
}

interface Props {
  formType: 'DESIGN' | 'BACKGROUND' | 'CUSTOM' | 'SKIP';
  onSubmit: (data: FormData) => void;
}

export default function ProjectDesignForm({ formType, onSubmit }: Props) {
  const [formData, setFormData, resetFormData] = useFormPersist<FormData>(
    STORAGE_KEYS.PROJECT_EXPERIENCE,
    { projects: [] }
  );

  const [currentProject, setCurrentProject] = useState<ProjectExperience>({
    name: '',
    description: '',
    techStack: [],
    features: [],
    timeline: '',
    difficulty: 'MEDIUM',
  });

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [currentTech, setCurrentTech] = useState('');
  const [currentFeature, setCurrentFeature] = useState('');

  const handleProjectChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentProject(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddTech = () => {
    if (currentTech.trim()) {
      setCurrentProject(prev => ({
        ...prev,
        techStack: [...prev.techStack, currentTech.trim()]
      }));
      setCurrentTech('');
    }
  };

  const handleAddFeature = () => {
    if (currentFeature.trim()) {
      setCurrentProject(prev => ({
        ...prev,
        features: [...prev.features, currentFeature.trim()]
      }));
      setCurrentFeature('');
    }
  };

  const handleAddProject = () => {
    if (!formData || !formData.projects) {
      setFormData({ projects: [currentProject] });
    } else {
      setFormData(prev => ({
        projects: [...(prev?.projects || []), currentProject]
      }));
    }
    setCurrentProject({
      name: '',
      description: '',
      techStack: [],
      features: [],
      timeline: '',
      difficulty: 'MEDIUM',
    });
    setShowProjectForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const getFormTitle = () => {
    switch (formType) {
      case 'DESIGN':
        return '设计项目经验';
      case 'BACKGROUND':
        return '根据公司背景设计项目';
      case 'CUSTOM':
        return '自定义项目经验';
      case 'SKIP':
        return '快速项目模板';
      default:
        return '项目经验设计';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{getFormTitle()}</h2>
        <p className="text-gray-600">
          设计适合你背景的项目经验，帮助你的简历更有竞争力。
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {formData?.projects?.map((project, index) => (
          <div key={index} className="form-card">
            <h3 className="text-xl font-semibold mb-4">{project.name}</h3>
            <p className="text-gray-600 mb-4">{project.description}</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium mb-2">技术栈</h4>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, i) => (
                    <span key={i} className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">主要功能</h4>
                <ul className="list-disc list-inside">
                  {project.features.map((feature, i) => (
                    <li key={i} className="text-gray-600">{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>预计时间: {project.timeline}</span>
              <span>难度: {project.difficulty}</span>
            </div>
          </div>
        ))}

        {showProjectForm ? (
          <div className="form-card">
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  项目名称
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="input-field"
                  value={currentProject.name}
                  onChange={handleProjectChange}
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  项目描述
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  className="input-field"
                  value={currentProject.description}
                  onChange={handleProjectChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  技术栈
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    className="input-field flex-1"
                    value={currentTech}
                    onChange={(e) => setCurrentTech(e.target.value)}
                    placeholder="添加技术栈"
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="btn-secondary"
                  >
                    添加
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {currentProject.techStack.map((tech, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  主要功能
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    className="input-field flex-1"
                    value={currentFeature}
                    onChange={(e) => setCurrentFeature(e.target.value)}
                    placeholder="添加功能点"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="btn-secondary"
                  >
                    添加
                  </button>
                </div>
                <ul className="list-disc list-inside">
                  {currentProject.features.map((feature, index) => (
                    <li key={index} className="text-gray-600">{feature}</li>
                  ))}
                </ul>
              </div>

              <div>
                <label htmlFor="timeline" className="block text-sm font-medium text-gray-700">
                  预计时间
                </label>
                <input
                  type="text"
                  id="timeline"
                  name="timeline"
                  className="input-field"
                  value={currentProject.timeline}
                  onChange={handleProjectChange}
                  placeholder="例如：2-3周"
                />
              </div>

              <div>
                <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                  项目难度
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  className="input-field"
                  value={currentProject.difficulty}
                  onChange={handleProjectChange}
                >
                  <option value="EASY">简单</option>
                  <option value="MEDIUM">中等</option>
                  <option value="HARD">困难</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowProjectForm(false)}
                  className="btn-secondary"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="btn-primary"
                >
                  添加项目
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowProjectForm(true)}
            className="btn-secondary w-full flex items-center justify-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span>添加新项目</span>
          </button>
        )}

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