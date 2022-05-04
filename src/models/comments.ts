/*
comments.ts
Author:
- Israel Sánchez Miranda

Creation date: 28/04/2022
Last modification date: 01/05/2022

Program that defines the table Comments model and its relationships
*/

import { Model } from 'sequelize';

//Interface that defines the attributes a register in the table Comments needs
interface CommentAttributes{
  comment_id: number,
  super_id: string,
  agent_id: string,
  comment: string,
  date: string,
  seen: boolean
};

module.exports = (sequelize:any, DataTypes:any) => {
  class Comments extends Model<CommentAttributes> implements CommentAttributes {
    /*
    Class that implements the model of the Comments table
    */
   
    //Attributes
    comment_id!: number;
    super_id!: string;
    agent_id!: string;
    comment!: string;
    date!: string;
    seen!: boolean;
    
    //Methods
    static associate(models:any) {
      /*
      Method called by the index.ts program in the models folder
      that creates and implements all the relationships the table Comments has
      */
      Comments.belongsTo(models.Manager, {
        foreignKey: 'super_id'
      });

      Comments.belongsTo(models.Agent, {
        foreignKey: 'agent_id'
      });
    }
  }

  Comments.init({
    /*
    Method that initializes the Agent table and its attributes
    */
    comment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    super_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    agent_id: {
      type: DataTypes.UUID,
      allowNull: false
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: sequelize.fn("now"),
      allowNull: false
    },
    seen: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Comments',
  });

  return Comments;
};