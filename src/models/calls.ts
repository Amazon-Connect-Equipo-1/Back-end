/*
calls.ts
Author:
- Israel Sánchez Miranda

Creation date: 28/04/2022
Last modification date: 01/06/2022

Program that defines the table Calls model and its relationships
*/

//Libraries that will be used
import { Model } from 'sequelize';

//Interface that defines the attributes a register in the table Calls needs
interface CallAttributes{
  call_id: string,
  agent_id: string,
  client_id: string,
  time_start: string,
  time_finish: string,
  duration: string,
  problem_solved: boolean,
  date: string
};

module.exports = (sequelize:any, DataTypes:any) => {
  class Calls extends Model<CallAttributes> implements CallAttributes {
    /*
    Class that implements the model of the Calls table
    */

    //Attributes
    call_id!: string;
    agent_id!: string;
    client_id!: string;
    time_start!: string;
    time_finish!: string;
    duration!: string;
    problem_solved!: boolean;
    date!: string;
    
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
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    agent_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    client_id: {
      type: DataTypes.UUID,
      defaultValue: "00000000-0000-0000-0000-000000000000",
      allowNull: false
    },
    time_start: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn("now"),
      allowNull: false
    },
    time_finish: {
      type: DataTypes.DATE,
      allowNull: true
    },
    duration: {
      type: DataTypes.STRING,
      allowNull: true
    },
    problem_solved: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Calls',
  });

  return Calls;
};