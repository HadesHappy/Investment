const Investor = require('../models/Investor')
const Admin = require('../models/Admin')

const { slots, referralCodeLength, adminAddress } = require('../utils/constants')

const deposit = async (req, res) => {
  try {
    const { wallet, amount, referralCode } = req.body
    if (slots.includes(Number(amount)) && wallet) {
      /**
       * This is valid request. Save the Investor and Upgrade the current level.
       */
      const investor = await Investor.findOne({ wallet })
      if (investor) { // Just update the level
        const index = slots.findIndex((value, index) => value === Number(amount))
        if (index === investor.currentLevel + 1) {
          await investor.updateOne({
            currentLevel: index
          })
        } else {
          return res.status(401).send({ message: "Not available slot." })
        }
      } else {  // Save new Investor
        const index = slots.findIndex((value, index) => value === Number(amount))
        const referralCode = generateCode(referralCodeLength)
        const newInvestor = new Investor({
          wallet,
          referralCode,
          balance: 0,
          startLevel: index,
          currentLevel: index,
        })
        await newInvestor.save()
      }
      const currentInvestor = await Investor.findOne({ wallet })

      if (referralCode) {
        const referrer = await Investor.findOne({ referralCode })
        if (referrer) {
          const index = slots.findIndex((value, index) => value === Number(amount))
          if (index >= referrer.startLevel && index <= referrer.currentLevel) {
            let trees = referrer.trees
            const treeIndex = trees.findIndex((tree, i) => tree.level === index)
            if (treeIndex === -1) {
              // First Referred Investor, 100% goes to the referrer
              users = []
              users.push(currentInvestor._id)
              trees.push({
                level: index,
                count: 1,
                users: users
              })
              await referrer.updateOne({ balance: referrer.balance + slots[index], trees })
              return res.status(200).send({ message: "Success" })
            } else {
              if (trees[treeIndex].count === 1) {
                // Second Referred Investor, 100% goes to the referrer
                trees[treeIndex].count++
                trees[treeIndex].users.push(currentInvestor._id)
                await referrer.updateOne({ balance: referrer.balance + slots[index], trees })
                return res.status(200).send({ message: "Success" })
              } else if (trees[treeIndex].count === 2) {
                // Third Referred Investor
                // 75% goes to the referrer
                trees[treeIndex].count++
                trees[treeIndex].users.push(currentInvestor._id)

                let profit
                if (slots[index] === 20)
                  profit = 10
                else
                  profit = slots[index] / 4

                await referrer.updateOne({ balance: referrer.balance + slots[index] - profit, trees })
                // 25% goes to the upline
                const upline = await Investor.findOne({ 'trees.level': index, 'trees.users': referrer._id })

                if (upline) {
                  await upline.updateOne({ balance: upline.balance + profit })
                } else {
                  const admin = await Admin.findOne({ wallet: adminAddress })
                  await admin.updateOne({ balance: admin.balance + profit })
                }
                return res.status(200).send({ messege: "Success" })
              }
              else {
                // Forth or n-th Referred Investor
                trees[treeIndex].count++
                trees[treeIndex].users.push(currentInvestor._id)

                if (slots[index] === 20)
                  await referrer.updateOne({ trees })
                else
                  await referrer.updateOne({ balance: referrer.balance + slots[index] / 2, trees })
                // 50% goes to the (n-2)th upline
                let upline = referrer
                let count = trees[treeIndex].count - 2
                while (count > 0) {
                  upline = await Investor.findOne({ 'trees.level': index, 'trees.users': upline._id })
                  if (upline) {
                    count--
                  } else {
                    const admin = await Admin.findOne({ wallet: adminAddress })
                    if (slots[index] === 20)
                      await admin.updateOne({ balance: admin.balance + 20 })
                    else
                      await admin.updateOne({ balance: admin.balance + slots[index] / 2 })
                    return res.status(200).send({ message: "Success" })
                  }
                }
                if (upline) {
                  if (slots[index] === 20)
                    await upline.updateOne({ balance: upline.balance + 20 })
                  else
                    await upline.updateOne({ balance: upline.balance + slots[index] / 2 })
                  return res.status(200).send({ message: "Success" })
                }

              }
            }
          } else {
            // Invalid Referrer
            const admin = await Admin.findOne({ wallet: adminAddress })
            if (admin) {
              await admin.updateOne({ balance: admin.balance + Number(amount) })
              return res.status(200).send({ message: 'Success' })
            } else {
              return res.status(401).send({ message: "Invalid Referrer." })
            }
          }
        } else {
          // Invalid ReferreralCode
          const admin = await Admin.findOne({ wallet: adminAddress })
          if (admin) {
            await admin.updateOne({ balance: admin.balance + Number(amount) })
            return res.status(200).send({ message: 'Success' })
          } else {
            return res.status(401).send({ message: "Invalid Referral Code." })
          }
        }
      } else {
        // Investor is directly invested.
        const admin = await Admin.findOne({ wallet: adminAddress })
        if (admin) {
          await admin.updateOne({ balance: admin.balance + Number(amount) })
          return res.status(200).send({ message: 'Success' })
        } else {
          return res.status(401).send({ message: "Admin does not exist." })
        }
      }
    }
    else {
      return res.status(401).send({
        message: 'Missing Parameters'
      })
    }
  } catch (error) {
    return res.status(500).send({
      message: 'Server Error'
    })
  }
}

// Generate Referral Code for Investor
const generateCode = (length) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let retVal = ''
  for (let i = 0, n = charset.length; i < length; i++) {
    retVal += charset.charAt(Math.floor(Math.random() * n)).toUpperCase()
  }
  return retVal
}

module.exports = {
  deposit
}