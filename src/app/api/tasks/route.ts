import { NextRequest, NextResponse } from "next/server"
import { apiRequireAuth } from "@/lib/auth-utils"
import { taskData } from "@/lib/business-data"

// GET /api/tasks - 获取任务列表
export async function GET(request: NextRequest) {
  try {
    const user = await apiRequireAuth()
    const { searchParams } = new URL(request.url)

    // 获取查询参数
    const includeCheckIns = searchParams.get('includeCheckIns') === 'true'
    const date = searchParams.get('date')

    // 获取任务组和任务
    const taskGroups = await taskData.findAllActiveWithTasks(
      includeCheckIns,
      user.id,
      date ? new Date(date) : undefined
    )

    return NextResponse.json({
      success: true,
      data: taskGroups
    })

  } catch (error) {
    console.error('获取任务列表失败:', error)

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "未授权访问" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: "获取任务列表失败" },
      { status: 500 }
    )
  }
}

// POST /api/tasks - 创建新任务
export async function POST(request: NextRequest) {
  try {
    const user = await apiRequireAuth()
    const body = await request.json()
    
    const { title, description, category } = body
    
    if (!title) {
      return NextResponse.json(
        { error: "任务标题不能为空" },
        { status: 400 }
      )
    }
    
    const task = await taskData.create({
      userId: user.id,
      title,
      description,
      category
    })
    
    return NextResponse.json({
      success: true,
      data: task
    })

  } catch (error) {
    console.error('创建任务失败:', error)
    
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "未授权访问" },
        { status: 401 }
      )
    }
    
    return NextResponse.json(
      { error: "创建任务失败" },
      { status: 500 }
    )
  }
}
