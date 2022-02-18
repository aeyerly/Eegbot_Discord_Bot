module.exports = (sequelize, DataTypes) => {
    return sequelize.define('anon_conversations', {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        helperId: {
            type: DataTypes.INTEGER,
        },
    }, {
        timestamps: false,
    });
};
