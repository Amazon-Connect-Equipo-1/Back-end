/*
manager.ts
Author:
- Israel Sánchez Miranda

Creation date: 28/04/2022
Last modification date: 01/05/2022

Program that defines the table Manager model and its relationships
*/

//Libraries that will be used
import { Model, UUIDV4 } from 'sequelize';

//Interface that defines the attributes a register in the table Manager needs
interface ManagerAttributes{
  manager_id: string,
  manager_name: string,
  password: string,
  email: string,
  profile_picture: string,
  is_quality: boolean,
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
      type: DataTypes.STRING,
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
      defaultValue: 'FaUserCircle',
      allowNull: false
    },
    is_quality: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Manager',
  });

  return Manager;
};