// Vercel Serverless Function —— 联系表单 / Webhook 落地模板
// 放置位置：客户项目 api/contact.js（vercel deploy 时自动识别为函数）
//
// 这是 Vercel 对比 GitHub Pages 的核心价值：
// GitHub Pages 是纯静态托管，跑不了任何服务端逻辑；
// 而 Vercel 的函数可承载 —— 联系表单入库/发邮件、AI 客服、预约 webhook、月度报告触发等。
// 步骤 10（Operation Agent）的周报邮件、AI 客服 widget 最终都落在这里。
//
// 依赖：无内置依赖即可返回 200（纯校验 + 日志）。
// 若上线后要真正发邮件：npm i resend，把 RESEND_API_KEY / OWNER_EMAIL 配进 Vercel 环境变量，取消下方注释。

export default async function handler(req, res) {
  // CORS：允许客户站点前端跨域调用
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method Not Allowed' })

  try {
    const { name, email, message } = req.body || {}
    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, error: 'name / email / message 必填' })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ ok: false, error: '邮箱格式无效' })
    }

    // ── 在此接真实动作（owner 上线时取消注释并配 key）──
    // const { Resend } = await import('resend')
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'site@yourdomain.com',
    //   to: process.env.OWNER_EMAIL,
    //   subject: `新询盘：${name}`,
    //   text: `来自 ${name} <${email}>\n\n${message}`,
    // })

    console.log('[contact] 收到询盘:', { name, email, message })
    return res.status(200).json({ ok: true, message: '已收到，我们会尽快联系您。' })
  } catch (e) {
    console.error('[contact] 处理失败:', e)
    return res.status(500).json({ ok: false, error: '服务器错误' })
  }
}
