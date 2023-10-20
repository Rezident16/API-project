'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.hasMany(models.EventImage, {
        foreignKey: 'eventId',
        onDelete: 'CASCADE',
        hooks: true
    })

    Event.belongsToMany(models.User, {
      through: models.Attendance,
      foreignKey: 'eventId',
      otherKey: 'userId'
  })
    }
  }
  Event.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    groupId: DataTypes.INTEGER,
    venueId: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['In person', 'Online']]
      }
    },
    capacity: DataTypes.INTEGER,
    price: {
      type: DataTypes.DECIMAL(6,2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
