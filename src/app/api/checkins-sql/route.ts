import { NextRequest, NextResponse } from "next/server"
import { apiRequireAuth } from "@/lib/auth-utils"
import { checkInData, taskData } from "@/lib/business-data"

// GET /api/checkins-sql - 获取用户的打卡记录（原生SQL版本）
export async function GET(request: NextRequest) {
  try {
    const user = await apiRequireAuth()
    const { searchParams } = new URL(request.url)
    
    // 获取查询参数
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const taskId = searchParams.get('taskId')

    // 设置日期范围
    let queryStartDate: Date | undefined
    let queryEndDate: Date | undefined
    
    if (startDate && endDate) {
      queryStartDate = new Date(startDate)
      queryEndDate = new Date(endDate)
    }

    // 查询打卡记录
    const checkIns = await checkInData.findByUser(
      user.id,
      queryStartDate,
      queryEndDate,
      taskId || undefined
    )

    return NextResponse.json({
      success: true,
      data: checkIns
    })

  } catch (error) {
    console.error('获取打卡记录失败:', error)
    
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "未授权访问" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: "获取打卡记录失败" },
      { status: 500 }
    )
  }
}

// POST /api/checkins-sql - 创建或切换打卡记录（原生SQL版本）
export async function POST(request: NextRequest) {
  try {
    const user = await apiRequireAuth()
    const body = await request.json()
    
    const { taskId, date, note } = body

    if (!taskId || !date) {
      return NextResponse.json(
        { error: "缺少必要参数: taskId 和 date" },
        { status: 400 }
      )
    }

    // 验证任务是否存在
    const task = await taskData.findById(taskId)

    if (!task) {
      return NextResponse.json(
        { error: "任务不存在" },
        { status: 404 }
      )
    }

    // 切换打卡状态
    const result = await checkInData.toggle(
      user.id,
      taskId,
      new Date(date),
      note
    )

    if (result.action === 'unchecked') {
      return NextResponse.json({
        success: true,
        action: 'unchecked',
        message: '取消打卡成功'
      })
    } else {
      return NextResponse.json({
        success: true,
        action: 'checked',
        message: '打卡成功',
        data: result.data
      })
    }

  } catch (error) {
    console.error('打卡操作失败:', error)
    
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "未授权访问" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: "打卡操作失败" },
      { status: 500 }
    )
  }
}

// DELETE /api/checkins-sql - 删除特定的打卡记录（原生SQL版本）
export async function DELETE(request: NextRequest) {
  try {
    const user = await apiRequireAuth()
    const { searchParams } = new URL(request.url)
    
    const checkInId = searchParams.get('id')
    const taskId = searchParams.get('taskId')
    const date = searchParams.get('date')

    if (checkInId) {
      // 通过ID删除 - 暂时不实现，因为需要额外的安全检查
      return NextResponse.json(
        { error: "通过ID删除功能暂未实现" },
        { status: 501 }
      )
    } else if (taskId && date) {
      // 通过任务ID和日期删除
      const success = await checkInData.deleteByUserTaskDate(
        user.id,
        taskId,
        new Date(date)
      )

      if (!success) {
        return NextResponse.json(
          { error: "打卡记录不存在" },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        message: '删除成功'
      })
    } else {
      return NextResponse.json(
        { error: "缺少必要参数" },
        { status: 400 }
      )
    }

  } catch (error) {
    console.error('删除打卡记录失败:', error)
    
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "未授权访问" },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: "删除失败" },
      { status: 500 }
    )
  }
}
