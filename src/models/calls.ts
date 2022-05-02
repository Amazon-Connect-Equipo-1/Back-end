/*
calls.ts
Author:
- Israel Sánchez Miranda

Creation date: 28/04/2022
Last modification date: 01/05/2022

Program that defines the table Calls model and its relationships
*/

import { Model } from 'sequelize';

//Interface that defines the attributes a register in the table Calls needs
interface CallAttributes{
  call_id: number,
  agent_id: string,
  client_id: string,
  time_start: string,
  time_finish: string,
  duration: number,
  satisfaction: number,
  date: string,
  comments: string
};

module.exports = (sequelize:any, DataTypes:any) => {
  class Calls extends Model<CallAttributes> implements CallAttributes {
    /*
    Class that implements the model of the Calls table
    */

    //Attributes
    call_id!: number;
    agent_id!: string;
    client_id!: string;
    time_start!: string;
    time_finish!: string;
    duration!: number;
    satisfaction!: number;
    date!: string;
    comments!: string;
    
    //Methods
    static associate(models:any) {
      /*
      Method called by the index.ts program in the models folder
      that creates and implements all the relationships the table Calls has
      */
      Calls.belongsTo(models.Agent, {
        foreignKey: 'agent_id'
      });

      Calls.belongsTo(models.Client, {
        foreignKey: 'client_id'
      });
    }
  }

  Calls.init({
    /*
    Method that initializes the Calls table and its attributes
    */
    call_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    agent_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    client_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    time_start: {
      type: DataTypes.DATE,
      allowNull: false
    },
    time_finish: {
      type: DataTypes.DATE,
      allowNull: false
    },
    duration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    satisfaction: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    comments: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Calls',
  });

  return Calls;
};