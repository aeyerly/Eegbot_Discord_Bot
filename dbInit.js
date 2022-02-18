const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

const CurrencyShop = require('./models/CurrencyShop')(sequelize, Sequelize.DataTypes);
require('./models/Users')(sequelize, Sequelize.DataTypes);
require('./models/UserItems')(sequelize, Sequelize.DataTypes);
require('./models/dailyCooldown')(sequelize, Sequelize.DataTypes);
require('./models/JobList')(sequelize, Sequelize.DataTypes);
require('./models/CommunityGoal')(sequelize, Sequelize.DataTypes);
require('./models/BlackjackGames')(sequelize, Sequelize.DataTypes);

const force = process.argv.includes('--force') || process.argv.includes('-f');

sequelize.sync({force}).then(async () => {
    const shop = [
        CurrencyShop.upsert({name:'Eeg :egg:', cost: 5000, sellPrice: 250, todayBuys: 0, todaySells: 0, yesterdayBuys: 0, yesterdaySells: 0}),
        CurrencyShop.upsert({name: 'Chair :chair:', cost: 100, sellPrice: 50, todayBuys: 0, todaySells: 0, yesterdayBuys: 0, yesterdaySells: 0}),
        CurrencyShop.upsert({name: 'Oxford Comma :school:', cost: 10, sellPrice: 5, todayBuys: 0, todaySells: 0, yesterdayBuys: 0, yesterdaySells: 0}),
        CurrencyShop.upsert({name: 'Potato :potato:', cost: 20, sellPrice: 10, todayBuys: 0, todaySells: 0, yesterdayBuys: 0, yesterdaySells: 0}),
        CurrencyShop.upsert({name: 'Arby\'s Franchise :hamburger:', cost: 2000, sellPrice: 1000, todayBuys: 0, todaySells: 0, yesterdayBuys: 0, yesterdaySells: 0}),
        CurrencyShop.upsert({name: 'Chocolate :chocolate_bar:', cost: 50, sellPrice: 25, todayBuys: 0, todaySells: 0, yesterdayBuys: 0, yesterdaySells: 0}),
        CurrencyShop.upsert({name: 'Toastie :bread:', cost: 300, sellPrice: 150, todayBuys: 0, todaySells: 0, yesterdayBuys: 0, yesterdaySells: 0}),
        CurrencyShop.upsert({name: 'Draw', cost: 80, sellPrice: 40, todayBuys: 0, todaySells: 0, yesterdayBuys: 0, yesterdaySells: 0}),
        CurrencyShop.upsert({name: 'Blanket :bed:', cost: 1000, sellPrice: 500, todayBuys: 0, todaySells: 0, yesterdayBuys: 0, yesterdaySells: 0}),
    ];
    await Promise.all(shop);
    console.log('Database Synced');
    sequelize.close();
}).catch(console.error);