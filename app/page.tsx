'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import UserInfoForm from './components/UserInfoForm'
import AdditionalInfoForm from './components/AdditionalInfoForm'
import { useFormPersist } from './hooks/useFormPersist'
import { STORAGE_KEYS } from './utils/storage'
import ProjectDesignForm from './components/ProjectDesignForm'
import ResumeResult from './components/ResumeResult'

type UserType = 'CURRENT_STUDENT' | 'RECENT_GRADUATE' | 'EXPERIENCED_SEEKER'
type Step = 
  | 'landing' 
  | 'userType' 
  | 'additionalInfo' 
  | 'workExperience'
  | 'projectDesign'
  | 'projectBackground'
  | 'projectCustom'
  | 'projectSkip'
  | 'infoConfirm'
  | 'result'

export default function Home() {
  const [step, setStep] = useState<Step>('landing')
  const [userType, setUserType, resetUserType] = useFormPersist<UserType | null>(
    STORAGE_KEYS.USER_TYPE,
    null
  )

  const handleStart = () => {
    setStep('userType')
  }

  const handleUserTypeSelect = (type: UserType) => {
    setUserType(type)
    setStep('additionalInfo')
  }

  const handleAdditionalInfoSubmit = (data: any) => {
    localStorage.setItem(STORAGE_KEYS.ADDITIONAL_INFO, JSON.stringify(data))
    
    // 根据是否有工作经验决定下一步
    if (data.workExperiences && data.workExperiences.length > 0) {
      setStep('projectDesign') // 有工作经验，直接进入项目设计
    } else if (data.hasWorkOpportunity) {
      // 根据机会类型决定下一步
      switch (data.workOpportunityType) {
        case 'FAMILY_FRIEND':
          setStep('projectBackground')
          break
        case 'SELF_COMPANY':
          setStep('projectCustom')
          break
        default:
          setStep('projectSkip')
      }
    } else {
      setStep('projectSkip')
    }
  }

  const handleProjectSubmit = (data: any) => {
    localStorage.setItem(STORAGE_KEYS.PROJECT_EXPERIENCE, JSON.stringify(data))
    setStep('infoConfirm')
  }

  const handleInfoConfirm = () => {
    setStep('result')
  }

  const handleBack = () => {
    switch (step) {
      case 'additionalInfo':
        setStep('userType')
        break
      case 'projectDesign':
      case 'projectBackground':
      case 'projectCustom':
      case 'projectSkip':
        setStep('additionalInfo')
        break
      case 'infoConfirm':
        // 根据之前的状态返回
        const data = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADDITIONAL_INFO) || '{}')
        if (data.workExperiences?.length > 0) {
          setStep('projectDesign')
        } else if (data.hasWorkOpportunity) {
          switch (data.workOpportunityType) {
            case 'FAMILY_FRIEND':
              setStep('projectBackground')
              break
            case 'SELF_COMPANY':
              setStep('projectCustom')
              break
            default:
              setStep('projectSkip')
          }
        } else {
          setStep('projectSkip')
        }
        break
      case 'userType':
        setStep('landing')
        break
    }
  }

  const getProjectFormType = () => {
    switch (step) {
      case 'projectDesign':
        return 'DESIGN'
      case 'projectBackground':
        return 'BACKGROUND'
      case 'projectCustom':
        return 'CUSTOM'
      case 'projectSkip':
        return 'SKIP'
      default:
        return 'DESIGN'
    }
  }

  return (
    <main className="container-fluid">
      {step === 'landing' && (
        <div className="text-center">
          <h1 className="page-title">简历生成助手</h1>
          <p className="text-xl mb-8 text-gray-600">
            帮助你创建专业的简历，提升求职竞争力
          </p>
          <div className="card-grid">
            <div className="form-card">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">简历生成器</h2>
              <p className="text-gray-600 mb-4">
                根据你的背景和求职目标，生成专业的简历
              </p>
              <div className="flex justify-center">
                <svg className="w-10 h-10 text-blue-500 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="form-card">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">学习计划生成器</h2>
              <p className="text-gray-600 mb-4">
                为你定制个性化的学习计划，提升技能水平
              </p>
              <div className="flex justify-center">
                <svg className="w-10 h-10 text-blue-500 opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>
          <button
            onClick={handleStart}
            className="btn-primary mt-8"
          >
            开始使用
          </button>
        </div>
      )}

      {step === 'userType' && (
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handleBack}
              className="btn-secondary"
            >
              <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回
            </button>
            <h2 className="page-title">选择你的身份</h2>
          </div>
          <div className="card-grid">
            <button
              onClick={() => handleUserTypeSelect('CURRENT_STUDENT')}
              className="form-card card-hover"
            >
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800">在校实习生</h3>
              </div>
              <p className="text-gray-600">大一到大三学生</p>
            </button>
            <button
              onClick={() => handleUserTypeSelect('RECENT_GRADUATE')}
              className="form-card card-hover"
            >
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2 2 0 00-.586-1.414l-4.5-4.5A2 2 0 0012.586 3H7a2 2 0 00-2 2v14" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800">应届毕业生</h3>
              </div>
              <p className="text-gray-600">大四/研究生</p>
            </button>
            <button
              onClick={() => handleUserTypeSelect('EXPERIENCED_SEEKER')}
              className="form-card card-hover"
            >
              <div className="flex items-center mb-4">
                <svg className="w-8 h-8 text-blue-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-800">毕业后求职者</h3>
              </div>
              <p className="text-gray-600">毕业1-2年</p>
            </button>
          </div>
        </div>
      )}

      {step === 'additionalInfo' && userType && (
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handleBack}
              className="btn-secondary"
            >
              <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回
            </button>
            <h2 className="page-title">补充信息</h2>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: '33%' }}></div>
          </div>
          <AdditionalInfoForm
            userType={userType}
            onSubmit={handleAdditionalInfoSubmit}
          />
        </div>
      )}

      {(step === 'projectDesign' || 
        step === 'projectBackground' || 
        step === 'projectCustom' || 
        step === 'projectSkip') && (
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handleBack}
              className="btn-secondary"
            >
              <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回
            </button>
            <h2 className="page-title">项目经验</h2>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: '66%' }}></div>
          </div>
          <ProjectDesignForm
            formType={getProjectFormType()}
            onSubmit={handleProjectSubmit}
          />
        </div>
      )}

      {step === 'infoConfirm' && (
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <button
              onClick={handleBack}
              className="btn-secondary"
            >
              <svg className="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回
            </button>
            <h2 className="page-title">信息确认</h2>
          </div>
          <div className="progress-bar">
            <div className="progress-bar-fill" style={{ width: '90%' }}></div>
          </div>
          <div className="form-card text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-green-50 rounded-full p-2">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              准备生成简历
            </h3>
            <p className="text-gray-600 mb-8">
              请确认你的所有信息是否正确
            </p>
            <button
              onClick={handleInfoConfirm}
              className="btn-primary"
            >
              确认并生成
            </button>
          </div>
        </div>
      )}

      {step === 'result' && (
        <ResumeResult
          onBack={() => setStep('infoConfirm')}
        />
      )}
    </main>
  )
} 