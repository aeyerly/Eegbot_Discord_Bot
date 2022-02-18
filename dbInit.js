const Sequelize = require('sequelize');

const sequelize = new Sequelize('eegDatabase', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'eegDatabase.sqlite',
});

const CurrencyShop = require('./models/ItemShop')(sequelize, Sequelize.DataTypes);
require('./models/Users')(sequelize, Sequelize.DataTypes);
require('./models/Inventory')(sequelize, Sequelize.DataTypes);
require('./models/CommunityGoal')(sequelize, Sequelize.DataTypes);
require('./models/AnonConversations')(sequelize, Sequelize.DataTypes);
require('./models/Lottery')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({force}).then(async () => {
    const shop = [
        CurrencyShop.upsert({itemName:'Eeg :egg:', cost: 5000, sellPrice: 2500, todayBuys: 0, todaySells: 0, yesterdayBuys: 0, yesterdaySells: 0, bonusItem: 0}),
        CurrencyShop.upsert({itemName: 'Chair :chair:', cost: 100, sellPrice: 50, todayBuys: 0, todaySells: 0, yesterdayBuys: 0, yesterdaySells: 0, bonusItem: 0}),
        CurrencyShop.upsert({itemName: 'Oxford Comma :school:', cost: 10, sellPrice: 5, todayBuys: 0, todaySells: 0, yesterdayBuys: 0, yesterdaySells: 0, bonusItem: 0}),
        CurrencyShop.upsert({itemName: 'Potato :potato:', cost: 20, sellPrice: 10, todayBuys: 0, todaySells: 0, yesterdayBuys: 0, yesterdaySells: 0, bonusItem: 0}),
        CurrencyShop.upsert({itemName: 'Arby\'s Franchise :hamburger:', cost: 2000, sellPrice: 1000, todayBuys: 0, todaySells: 0, yesterdayBuys: 0, yesterdaySells: 0, bonusItem: 0}),
        CurrencyShop.upsert({itemName: 'Chocolate :chocolate_bar:', cost: 50, sellPrice: 25, todayBuys: 0, todaySells: 0, yesterdayBuys: 0, yesterdaySells: 0, bonusItem: 0}),
        CurrencyShop.upsert({itemName: 'Toastie :bread:', cost: 300, sellPrice: 150, todayBuys: 0, todaySells: 0, yesterdayBuys: 0, yesterdaySells: 0, bonusItem: 0}),
        CurrencyShop.upsert({itemName: 'Draw', cost: 80, sellPrice: 40, todayBuys: 0, todaySells: 0, yesterdayBuys: 0, yesterdaySells: 0, bonusItem: 0}),
        CurrencyShop.upsert({itemName: 'Blanket :bed:', cost: 1000, sellPrice: 500, todayBuys: 0, todaySells: 0, yesterdayBuys: 0, yesterdaySells: 0, bonusItem: 0}),
    ];
    await Promise.all(shop);
    console.log('Database Synced');
    sequelize.close();
}).catch(console.error);