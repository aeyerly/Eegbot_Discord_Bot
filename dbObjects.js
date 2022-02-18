const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localgost',
    dialect: 'sqlite',
    logging: false,
    storage: 'database.sqlite',
});

const Users = require('./models/Users')(sequelize, Sequelize.DataTypes);
const CurrencyShop = require('./models/CurrencyShop')(sequelize, Sequelize.DataTypes);
const UserItems = require('./models/UserItems')(sequelize, Sequelize.DataTypes);
const dailyCooldown = require('./models/dailyCooldown')(sequelize, Sequelize.DataTypes);
const JobList = require('./models/JobList')(sequelize, Sequelize.DataTypes);
const CommunityGoal = require('./models/CommunityGoal')(sequelize, Sequelize.DataTypes);
//const BlackJackGames = require('./models/BlackjackGames')(sequelize, Sequelize.DataTypes);

UserItems.belongsTo(CurrencyShop, {foreignKey: 'item_id', as: 'item'});

Users.prototype.addItem = async function(item) {
    const userItem = await UserItems.findOne({
        where: {user_id: this.user_id, item_id: item.id},
    });

    if (userItem) {
        userItem.amount += 1;
        return userItem.save();
    }

    return UserItems.create({user_id: this.user_id, item_id: item.id, amount: 1});
};

Users.prototype.removeItem = async function(item) {
    const userItem = await UserItems.findOne({
        where: {user_id: this.user_id, item_id: item.id},
    });

    if (userItem && userItem.amount >= 1) {
        userItem.amount -= 1;
        return userItem.save();
    }

    return 1;
};

Users.prototype.getItems = function() {
    return UserItems.findAll({
        where: {user_id: this.user_id},
        include: ['item'],
    });
};

module.exports = {Users, CurrencyShop, UserItems, dailyCooldown, JobList, CommunityGoal/*, BlackjackGames*/};