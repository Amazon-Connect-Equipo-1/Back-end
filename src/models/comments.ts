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
      /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
      // define association here
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