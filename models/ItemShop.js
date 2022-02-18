module.exports = (sequelize, DataTypes) => {
    return sequelize.define('currency_shop', {
        itemId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        itemName: {
            type: DataTypes.STRING,
            unique: true,
        },
        cost: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        sellPrice: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        todayBuys: {
            type: DataTypes.INTEGER,
            allowNull: false,
            default: 0,
        },
        todaySells: {
            type: DataTypes.INTEGER,
            allowNull: false,
            default: 0,
        },
        yesterdayBuys: {
            type: DataTypes.INTEGER,
            allowNull: false,
            default: 0,
        },
        yesterdaySells: {
            type: DataTypes.INTEGER,
            allowNull: false,
            default: 0,
        },
        bonusItem: {
            type:DataTypes.INTEGER,
            allowNull: false,
            default: 0,
        },
    }, {
        timestamps: false,
    });
};