/*
chat.ts
Author:
- Israel Sánchez Miranda

Creation date: 28/04/2022
Last modification date: 01/05/2022

Program that defines the table Chat model and its relationships
*/

import { Model } from 'sequelize';

//Interface that defines the attributes a register in the table Chat needs
interface ChatAttributes{
  chat_id: number,
  client_id: string,
  satisfaction: number,
  date: string,
  comments: string
};

module.exports = (sequelize:any, DataTypes:any) => {
  class Chat extends Model<ChatAttributes> implements ChatAttributes {
    /*
    Class that implements the model of the Chat table
    */
   
    //Attributes
    chat_id!: number;
    client_id!: string;
    satisfaction!: number;
    date!: string;
    comments!: string;
    
    //Methods
    static associate(models:any) {
      /*
      Method called by the index.ts program in the models folder
      that creates and implements all the relationships the table Chat has
      */
      Chat.belongsTo(models.Client, {
        foreignKey: 'client_id'
      });
    }
  }

  Chat.init({
    /*
    Method that initializes the Chat table and its attributes
    */
    chat_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    client_id: {
      type: DataTypes.UUID,
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
    modelName: 'Chat',
  });
  
  return Chat;
};