import React from 'react'
import type { Metadata } from 'next'
import { inter } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: '简历生成助手',
  description: '帮助计算机专业学生生成专业简历的工具',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" className={inter.className}>
      <body>{children}</body>
    </html>
  )
} 