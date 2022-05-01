import { Model } from 'sequelize';

//Interface that defines the attributes a register in the table Comments needs
interface CommentAttributes{
  comment_id: number,
  super_id: string,
  agent_id: string,
  comment: string,
  seen: boolean
};

module.exports = (sequelize:any, DataTypes:any) => {
  class Comments extends Model<CommentAttributes> implements CommentAttributes {
    comment_id!: number;
    super_id!: string;
    agent_id!: string;
    comment!: string;
    seen!: boolean;
    
    static associate(models:any) {
      Comments.belongsTo(models.Manager, {
        foreignKey: 'super_id'
      });

      Comments.belongsTo(models.Agent, {
        foreignKey: 'agent_id'
      });
    }
  }

  Comments.init({
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
    seen: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Comments',
  });

  return Comments;
};