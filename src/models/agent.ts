/*
agents.ts
Author:
- Israel Sánchez Miranda

Creation date: 28/04/2022
Last modification date: 01/05/2022

Program that defines the table Agent model and its relationships
*/

import { Model, UUIDV4 } from 'sequelize';

//Interface that defines the attributes a register in the table Agent needs
interface AgentAttributes{
  agent_id: string,
  super_id: string,
  name: string,
  password: string,
  email: string,
  profile_picture: string,
  rating: number,
  status: string,
  calls: number,
  security_token: string
};

module.exports = (sequelize:any, DataTypes:any) => {
  class Agent extends Model<AgentAttributes> implements AgentAttributes {
    /*
    Class that implements the model of the Agent table
    */
   
    //Attributes
    agent_id!: string;
    super_id!: string;
    name!: string;
    password!: string;
    email!: string;
    profile_picture!: string;
    rating!: number;
    status!: string;
    calls!: number;
    security_token!: string;
    
    //Methods
    static associate(models:any) {
      /*
      Method called by the index.ts program in the models folder
      that creates and implements all the relationships the table Agent has
      */
      Agent.hasMany(models.Calls, {
        foreignKey: 'agent_id'
      });

      Agent.hasMany(models.Comments, {
        foreignKey: 'agent_id'
      });

      Agent.belongsTo(models.Manager, {
        foreignKey: 'super_id'
      });
    }
  }

  Agent.init({
    /*
    Method that initializes the Agent table and its attributes
    */
    agent_id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    super_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    profile_picture: {
      type: DataTypes.STRING,
      defaultValue: 'https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png',
      allowNull: false
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      defaultValue: 0.00,
      allowNull: false
    },
    status: {
      //Possible status: Inactive, Active, in-call
      type: DataTypes.STRING,
      defaultValue: "Inactive",
      allowNull: false
    },
    calls: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    security_token: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'Agent',
  });
  
  return Agent;
};