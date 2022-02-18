module.exports = (sequelize, DataTypes) => {
    return sequelize.define('job_list', {
        name: {
            type: DataTypes.STRING,
            unique: true,
            primaryKey: true,
        },

        jobLevel: {
            type: DataTypes.INTEGER,
        },

        income: {
            type: DataTypes.INTEGER,
        },

        lastUsed: {
            type: DataTypes.INTEGER,
        },
    }, {timestamps: false})
        
};