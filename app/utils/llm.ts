import { STORAGE_KEYS } from './storage';

// 定义支持的模型类型
export const SUPPORTED_MODELS = {
  'gpt-4-0125-preview': {
    name: 'GPT-4 Turbo',
    description: '最新的 GPT-4 模型，支持 128K 上下文长度，适合生成详细的简历内容',
    pricePerToken: {
      input: 0.01,  // $0.01 per 1K input tokens
      output: 0.03  // $0.03 per 1K output tokens
    },
    maxTokens: 128000,
    recommended: true
  },
  'gpt-4-1106-preview': {
    name: 'GPT-4 Turbo (Legacy)',
    description: '上一代 GPT-4 Turbo 模型',
    pricePerToken: {
      input: 0.01,
      output: 0.03
    },
    maxTokens: 128000,
    recommended: false
  },
  'gpt-4': {
    name: 'GPT-4',
    description: '标准 GPT-4 模型，适合需要稳定性的场景',
    pricePerToken: {
      input: 0.03,
      output: 0.06
    },
    maxTokens: 8192,
    recommended: false
  },
  'gpt-3.5-turbo-0125': {
    name: 'GPT-3.5 Turbo',
    description: '最新的 GPT-3.5 模型，性价比高',
    pricePerToken: {
      input: 0.0005,
      output: 0.0015
    },
    maxTokens: 16385,
    recommended: false
  }
} as const;

export type SupportedModel = keyof typeof SUPPORTED_MODELS;

export interface ResumeGenerationInput {
  userType: 'CURRENT_STUDENT' | 'RECENT_GRADUATE' | 'EXPERIENCED_SEEKER';
  additionalInfo: {
    targetPosition?: string;
    workExperiences?: Array<{
      company: string;
      position: string;
      duration: string;
      responsibilities: string[];
    }>;
    hasWorkOpportunity?: boolean;
    workOpportunityType?: 'FAMILY_FRIEND' | 'SELF_COMPANY';
    workOpportunityDetails?: {
      company?: string;
      position?: string;
      responsibilities?: string[];
    };
  };
  projectExperiences: Array<{
    name: string;
    description: string;
    techStack: string[];
    features: string[];
    timeline: string;
    difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  }>;
}

export async function generateResume(input: ResumeGenerationInput): Promise<string> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error('Error generating resume');
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    return data.content || 'Error generating resume. Please try again.';
  } catch (error) {
    console.error('Error generating resume:', error);
    throw new Error('Error generating resume. Please try again.');
  }
}

export function constructResumePrompt(input: ResumeGenerationInput): string {
  const { userType, additionalInfo, projectExperiences } = input;
  
  let prompt = `Please generate a professional resume for a computer science professional based on the following information:\n\n`;
  
  // Add user type information
  prompt += `Applicant Type: ${getUserTypeDescription(userType)}\n\n`;
  
  // Add target position information
  if (additionalInfo.targetPosition) {
    prompt += `Target Position: ${additionalInfo.targetPosition}\n\n`;
  }
  
  // Add work experience
  if (additionalInfo.workExperiences && additionalInfo.workExperiences.length > 0) {
    prompt += `Work Experience:\n`;
    additionalInfo.workExperiences.forEach(exp => {
      prompt += `- Company: ${exp.company}\n`;
      prompt += `  Position: ${exp.position}\n`;
      prompt += `  Duration: ${exp.duration}\n`;
      prompt += `  Responsibilities:\n${exp.responsibilities.map(r => `    - ${r}`).join('\n')}\n\n`;
    });
  }
  
  // Add potential work opportunity information
  if (additionalInfo.hasWorkOpportunity && additionalInfo.workOpportunityDetails) {
    prompt += `Potential Work Opportunity:\n`;
    prompt += `Type: ${getOpportunityTypeDescription(additionalInfo.workOpportunityType)}\n`;
    const details = additionalInfo.workOpportunityDetails;
    if (details.company) prompt += `Company: ${details.company}\n`;
    if (details.position) prompt += `Position: ${details.position}\n`;
    if (details.responsibilities) {
      prompt += `Responsibilities:\n${details.responsibilities.map(r => `- ${r}`).join('\n')}\n\n`;
    }
  }
  
  // Add project experience
  if (projectExperiences.length > 0) {
    prompt += `Project Experience:\n`;
    projectExperiences.forEach(project => {
      prompt += `- Project Name: ${project.name}\n`;
      prompt += `  Description: ${project.description}\n`;
      prompt += `  Tech Stack: ${project.techStack.join(', ')}\n`;
      prompt += `  Key Features:\n${project.features.map(f => `    - ${f}`).join('\n')}\n`;
      prompt += `  Timeline: ${project.timeline}\n`;
      prompt += `  Difficulty Level: ${getDifficultyDescription(project.difficulty)}\n\n`;
    });
  }
  
  prompt += `Please generate a professional resume including:
1. Professional Summary
2. Technical Skills
3. Work Experience (if any)
4. Project Experience
5. Education

Please ensure:
- Highlight technical aspects and solutions
- Emphasize project outcomes and impact
- Use professional technical terminology
- Maintain clear and concise expression`;
  
  return prompt;
}

function getUserTypeDescription(userType: ResumeGenerationInput['userType']): string {
  switch (userType) {
    case 'CURRENT_STUDENT':
      return 'Current Student (Freshman to Junior)';
    case 'RECENT_GRADUATE':
      return 'Recent Graduate (Senior/Graduate Student)';
    case 'EXPERIENCED_SEEKER':
      return 'Experienced Job Seeker (1-2 years post-graduation)';
  }
}

function getOpportunityTypeDescription(type?: 'FAMILY_FRIEND' | 'SELF_COMPANY'): string {
  switch (type) {
    case 'FAMILY_FRIEND':
      return 'Family/Friend Company Opportunity';
    case 'SELF_COMPANY':
      return 'Self-Owned Company Opportunity';
    default:
      return 'Other Opportunity';
  }
}

function getDifficultyDescription(difficulty: 'EASY' | 'MEDIUM' | 'HARD'): string {
  switch (difficulty) {
    case 'EASY':
      return 'Basic';
    case 'MEDIUM':
      return 'Intermediate';
    case 'HARD':
      return 'Advanced';
  }
}

// 获取 OpenAI 可用的模型列表
export async function getAvailableModels() {
  try {
    const response = await fetch('/api/models');
    if (!response.ok) {
      throw new Error('获取模型列表失败');
    }
    const data = await response.json();
    return data.models;
  } catch (error) {
    console.error('获取模型列表失败:', error);
    throw error;
  }
}

// 过滤出 GPT 模型
export function filterGPTModels(models: any[]) {
  return models.filter(model => 
    model.id.toLowerCase().includes('gpt') && 
    !model.id.includes('instruct') &&
    !model.id.includes('similarity') &&
    !model.id.includes('search')
  );
}

// 获取模型价格信息
export function getModelPriceInfo(modelId: string): {
  input: number;
  output: number;
} {
  // 根据模型 ID 返回对应的价格信息
  if (modelId.startsWith('gpt-4')) {
    if (modelId.includes('0125') || modelId.includes('1106')) {
      return { input: 0.01, output: 0.03 };
    }
    return { input: 0.03, output: 0.06 };
  }
  if (modelId.startsWith('gpt-3.5')) {
    return { input: 0.0005, output: 0.0015 };
  }
  // 默认价格
  return { input: 0.03, output: 0.06 };
}

// 获取模型最大 token 限制
export function getModelMaxTokens(modelId: string): number {
  if (modelId.includes('0125') || modelId.includes('1106')) {
    return 128000;
  }
  if (modelId.startsWith('gpt-4')) {
    return 8192;
  }
  if (modelId.startsWith('gpt-3.5')) {
    return 16385;
  }
  return 8192; // 默认值
}

// 更新支持的模型列表
export async function updateSupportedModels() {
  try {
    const models = await getAvailableModels();
    const gptModels = filterGPTModels(models);
    
    // 更新 SUPPORTED_MODELS
    const updatedModels = gptModels.reduce((acc, model) => {
      const modelId = model.id as SupportedModel;
      if (modelId in SUPPORTED_MODELS) {
        acc[modelId] = SUPPORTED_MODELS[modelId];
      }
      return acc;
    }, {} as Record<SupportedModel, typeof SUPPORTED_MODELS[SupportedModel]>);

    return updatedModels;
  } catch (error) {
    console.error('更新模型列表时出错:', error);
    return SUPPORTED_MODELS; // 如果更新失败，返回默认模型列表
  }
} 