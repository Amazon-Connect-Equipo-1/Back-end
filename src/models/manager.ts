/*
manager.ts
Author:
- Israel Sánchez Miranda

Creation date: 28/04/2022
Last modification date: 01/05/2022

Program that defines the table Manager model and its relationships
*/

import { Model, UUIDV4 } from 'sequelize';

//Interface that defines the attributes a register in the table Manager needs
interface ManagerAttributes{
  manager_id: string,
  manager_name: string,
  password: string,
  email: string,
  profile_picture: string,
  is_quality: boolean,
  security_token: string
};

module.exports = (sequelize:any, DataTypes:any) => {
  class Manager extends Model<ManagerAttributes> implements ManagerAttributes {
    /*
    Class that implements the model of the Manager table
    */
   
    //Attributes
    manager_id!: string;
    manager_name!: string;
    password!: string;
    email!: string;
    profile_picture!: string;
    is_quality!: boolean;
    security_token!: string;
    
    //Methods
    static associate(models:any) {
      /*
      Method called by the index.ts program in the models folder
      that creates and implements all the relationships the table Manager has
      */
      Manager.hasMany(models.Comments, {
        foreignKey: 'super_id'
      });

      Manager.hasMany(models.Agent, {
        foreignKey: 'super_id'
      });
    }
  }

  Manager.init({
    /*
    Method that initializes the Manager table and its attributes
    */
    manager_id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    manager_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profile_picture: {
      type: DataTypes.STRING,
      defaultValue: 'https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png',
      allowNull: false
    },
    is_quality: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    security_token: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'Manager',
  });

  return Manager;
};