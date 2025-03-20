import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { constructResumePrompt } from '../../utils/llm';

// 确保在服务器端运行
if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  if (request.method !== 'POST') {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }

  try {
    const body = await request.json();
    const { userType, additionalInfo, projectExperiences } = body;

    // Construct resume generation prompt
    const prompt = constructResumePrompt({
      userType,
      additionalInfo,
      projectExperiences,
    });

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are a professional resume assistant. Please generate a professional and concise resume based on the provided information.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    return NextResponse.json({
      content: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error('Error generating resume:', error);
    return NextResponse.json(
      { error: 'Error generating resume' },
      { status: 500 }
    );
  }
}

function getUserTypeDescription(userType: string): string {
  switch (userType) {
    case 'CURRENT_STUDENT':
      return '在校实习生（大一到大三学生）';
    case 'RECENT_GRADUATE':
      return '应届毕业生（大四/研究生）';
    case 'EXPERIENCED_SEEKER':
      return '毕业后求职者（毕业1-2年）';
    default:
      return userType;
  }
}

function getOpportunityTypeDescription(type?: string): string {
  switch (type) {
    case 'FAMILY_FRIEND':
      return '家庭/朋友公司机会';
    case 'SELF_COMPANY':
      return '自营公司机会';
    default:
      return '其他机会';
  }
}

function getDifficultyDescription(difficulty: 'EASY' | 'MEDIUM' | 'HARD'): string {
  switch (difficulty) {
    case 'EASY':
      return '简单';
    case 'MEDIUM':
      return '中等';
    case 'HARD':
      return '困难';
  }
} 