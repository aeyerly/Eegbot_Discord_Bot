const Sequelize = require('sequelize');

const sequelize = new Sequelize('eegDatabase', 'username', 'password', {
    host: 'localgost',
    dialect: 'sqlite',
    logging: false,
    storage: 'eegDatabase.sqlite',
});

const Users = require('./models/Users')(sequelize, Sequelize.DataTypes);
const ItemShop = require('./models/ItemShop')(sequelize, Sequelize.DataTypes);
const Inventory = require('./models/Inventory')(sequelize, Sequelize.DataTypes);
const CommunityGoal = require('./models/CommunityGoal')(sequelize, Sequelize.DataTypes);
const Lottery = require('./models/Lottery')(sequelize, Sequelize.DataTypes);
const AnonConversations = require('./models/AnonConversations')(sequelize, Sequelize.DataTypes);
//const BlackJackGames = require('./models/BlackjackGames')(sequelize, Sequelize.DataTypes);

Inventory.belongsTo(ItemShop, {foreignKey: 'item_id', as: 'itemId'});

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

module.exports = {Users, ItemShop, Inventory, CommunityGoal, AnonConversations, Lottery/*, BlackjackGames*/};