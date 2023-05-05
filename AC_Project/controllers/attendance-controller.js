const moment = require('moment-timezone')
const db = require('../models')
const { Attendance } = db

const TW_TIMEZONE = 'Asia/Taipei'

const attendanceController = {
  // 上班打卡
  clock_in: async (req, res, next) => {
    try {
      const { user } = req
      const date = new Date()

      // 判斷是否為工作日
      const isWorkday = await checkIsWorkday(date)

      // 找出今天是否已經打過卡
      const todayRecords = await Attendance.findAll({
        where: {
          user_id: user.id,
          clock_in: {
            [db.Sequelize.Op.gte]: moment(date).startOf('day').toDate(),
            [db.Sequelize.Op.lt]: moment(date).endOf('day').toDate()
          }
        },
        order: [['clock_in', 'DESC']]
      })

      if (todayRecords.length > 0 && todayRecords[0].clock_out === null) {
        // 如果今天已經有打卡，且尚未打下班卡
        req.flash('error_messages', '今日已有上班紀錄')
        res.redirect('/dashboard')
      } else {
        // 新增一筆打卡紀錄
        const record = await Attendance.create({
          user_id: user.id,
          clock_in: date,
          date,
          isWorkday
        })

        req.flash('success_messages', '上班打卡成功')
        res.redirect('/dashboard')
      }
    } catch (error) {
      next(error)
    }
  },

  // 下班打卡
  clock_out: async (req, res, next) => {
    try {
      const { user } = req
      const date = new Date()

      // 找出今天是否已經打過卡
      const todayRecords = await Attendance.findAll({
        where: {
          user_id: user.id,
          clock_in: {
            [db.Sequelize.Op.gte]: moment(date).startOf('day').toDate(),
            [db.Sequelize.Op.lt]: moment(date).endOf('day').toDate()
          }
        },
        order: [['clock_in', 'DESC']]
      })

      if (todayRecords.length === 0) {
        // 如果今天沒有打過卡
        req.flash('error_messages', '今日尚未有上班紀錄')
        console.log('todayRecords:', todayRecords)
        res.redirect('/dashboard')
      } else if (todayRecords[0].clock_out !== null) {
        // 如果今天已經打過下班卡
        req.flash('error_messages', '今日已有下班紀錄')
        res.redirect('/dashboard')
      } else {
        // 更新最後一筆打卡紀錄的下班時間
        const record = todayRecords[0]
        record.clock_out = date
        await record.save()

        req.flash('success_messages', '下班打卡成功')
        res.redirect('/dashboard')
      }
    } catch (error) {
      next(error)
    }
  }
}

// 檢查是否為工作日
async function checkIsWorkday(date) {
  const dayOfWeek = moment(date).tz(TW_TIMEZONE).day()
  const isWeekend = (dayOfWeek === 6) || (dayOfWeek === 0)
  if (isWeekend) {
    return false
  } else {
    return true
  }
}
module.exports = attendanceController