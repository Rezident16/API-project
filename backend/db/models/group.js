'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsToMany(models.User, {
        through: models.Membership,
        foreignKey: 'groupId',
        otherKey: 'userId'
    })

    
    
    Group.hasMany(models.Venue, {
      foreignKey: 'groupId',
      onDelete: 'CASCADE',
      hooks: true
    })
    
    Group.hasMany(models.GroupImage, {
      foreignKey: 'groupId',
      onDelete: 'CASCADE',
      hooks: true
    })
    
    
    Group.belongsToMany(models.Venue, {
      through: models.Event,
      foreignKey: 'groupId',
      otherKey: 'venueId'
    })
    
    Group.belongsTo(models.User, {
      foreignKey: 'organizerId'
    })
    
    }
  }

  Group.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    organizerId: DataTypes.INTEGER,
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len:[1,60]
      }
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        length(value) {
          if (value.length < 50) throw new Error('About must be 50 characters or more')
        }
      }
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [['In person', 'Online']]
      }
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
