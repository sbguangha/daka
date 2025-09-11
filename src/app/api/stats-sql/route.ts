import { NextRequest, NextResponse } from "next/server"
import { apiRequireAuth } from "@/lib/auth-utils"
import { statsData, streakData } from "@/lib/business-data"

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// GET /api/stats-sql - 获取用户统计数据（原生SQL版本）
export async function GET(request: NextRequest) {
  try {
    const user = await apiRequireAuth()
    const { searchParams } = new URL(request.url)
    
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const type = searchParams.get('type') || 'overview' // overview, streak, daily, monthly

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    // 默认查询范围：最近30天
    const defaultStartDate = new Date(today)
    defaultStartDate.setDate(defaultStartDate.getDate() - 30)
    
    const queryStartDate = startDate ? new Date(startDate) : defaultStartDate
    const queryEndDate = endDate ? new Date(endDate) : today

    switch (type) {
      case 'overview':
        return await getOverviewStats(user.id, queryStartDate, queryEndDate)
      
      case 'streak':
        return await getStreakStats(user.id)
      
      case 'daily':
        return await getDailyStats(user.id, queryStartDate, queryEndDate)
      
      case 'monthly':
        return await getMonthlyStats(user.id, queryStartDate, queryEndDate)
      
      default:
        return NextResponse.json(
          { error: "不支持的统计类型" },
          { status: 400 }
        )
    }

  } catch (error) {
    console.error('获取统计数据失败:', error)
    
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "未授权访问" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: "获取统计数据失败" },
      { status: 500 }
    )
  }
}

// 获取概览统计
async function getOverviewStats(userId: string, startDate: Date, endDate: Date) {
  try {
    const stats = await statsData.getOverviewStats(userId, startDate, endDate)

    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('获取概览统计失败:', error)
    return NextResponse.json(
      { error: "获取概览统计失败" },
      { status: 500 }
    )
  }
}

// 获取连续打卡统计
async function getStreakStats(userId: string) {
  try {
    const currentStreak = await statsData.getCurrentStreak(userId)
    const longestStreak = await streakData.findLongestByUser(userId)
    const allStreaks = await streakData.findByUser(userId, 10)

    return NextResponse.json({
      success: true,
      data: {
        currentStreak,
        longestStreak: longestStreak?.count || 0,
        recentStreaks: allStreaks
      }
    })
  } catch (error) {
    console.error('获取连续打卡统计失败:', error)
    return NextResponse.json(
      { error: "获取连续打卡统计失败" },
      { status: 500 }
    )
  }
}

// 获取每日统计
async function getDailyStats(userId: string, startDate: Date, endDate: Date) {
  try {
    const dailyStats = await statsData.getDailyStats(userId, startDate, endDate)

    return NextResponse.json({
      success: true,
      data: dailyStats
    })
  } catch (error) {
    console.error('获取每日统计失败:', error)
    return NextResponse.json(
      { error: "获取每日统计失败" },
      { status: 500 }
    )
  }
}

// 获取月度统计
async function getMonthlyStats(userId: string, startDate: Date, endDate: Date) {
  try {
    const monthlyStats = await statsData.getMonthlyStats(userId, startDate, endDate)

    return NextResponse.json({
      success: true,
      data: monthlyStats
    })
  } catch (error) {
    console.error('获取月度统计失败:', error)
    return NextResponse.json(
      { error: "获取月度统计失败" },
      { status: 500 }
    )
  }
}
