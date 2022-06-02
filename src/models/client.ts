/*
client.ts
Author:
- Israel Sánchez Miranda

Creation date: 28/04/2022
Last modification date: 01/05/2022

Program that defines the table Client model and its relationships
*/

import { Model, UUIDV4 } from 'sequelize';

//Interface that defines the attributes a register in the table Client needs
interface ClientAttributes{
  client_id: string,
  client_name: string,
  password: string,
  email: string,
  phone_number: string,
  client_pin: string
};

module.exports = (sequelize:any, DataTypes:any) => {
  class Client extends Model<ClientAttributes> implements ClientAttributes {
    /*
    Class that implements the model of the Client table
    */
   
    //Attributes
    client_id!: string;
    client_name!: string;
    password!: string;
    email!: string;
    phone_number!: string;
    client_pin!: string;
    
    //Methods
    static associate(models:any) {
      /*
      Method called by the index.ts program in the models folder
      that creates and implements all the relationships the table Client has
      */
      Client.hasMany(models.Calls, {
        foreignKey: 'client_id'
      });
    }
  }
  
  Client.init({
    /*
    Method that initializes the Client table and its attributes
    */
    client_id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    client_name: {
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
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    client_pin: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Client',
  });

  return Client;
};