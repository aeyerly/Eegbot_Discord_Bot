module.exports = (sequelize, DataTypes) => {
    return sequelize.define('community_goal', {
        goalName: {
            type: DataTypes.STRING,
            unique: true,
        },
        goalCost: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1000000
        },
        goalDonated: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    }, {
        timestamps: false,
    });
};