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
    chat_id!: number;
    client_id!: string;
    satisfaction!: number;
    date!: string;
    comments!: string;
    
    static associate(models:any) {
      Chat.belongsTo(models.Client, {
        foreignKey: 'client_id'
      });
    }
  }

  Chat.init({
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