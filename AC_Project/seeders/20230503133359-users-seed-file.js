module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('users', [{
      username: 'acuser',
      password: '$2b$10$YWGmB8BxKrsJLdtKYH1Zp.y8Oay/VKtxEhG16JY4yv2Q4c/qhJL2a', // 預設密碼為 acuser
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
};