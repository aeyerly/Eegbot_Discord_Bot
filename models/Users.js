module.exports = (sequelize, DataTypes) => {
    return sequelize.define('users', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
        },
        balance: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        lastDailyUsed: {
            type: DataTypes.INTEGER,
            default: 0,
        },
        lastJobCollect: {
            type: DataTypes.INTEGER,
            default: 0,
        },
        jobLevel: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
        messagesSent: {
            type: DataTypes.INTEGER,
            defaulValue: 0,
        },
        messagesNeeded: {
            type: DataTypes.INTEGER,
            default: 20,
        },
        communityContribution: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        receiveLimit: {
            type: DataTypes.INTEGER,
            defaultValue: 200,
        },
        received: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
    }, {
        timestamps: false,
    });
};