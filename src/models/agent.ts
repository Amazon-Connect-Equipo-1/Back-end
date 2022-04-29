import { Model, UUIDV4 } from 'sequelize';

//Interface that defines the attributes a register in the table Agent needs
interface AgentAttributes{
  agent_id: string,
  super_id: string,
  name: string,
  surname: string,
  password: string,
  email: string,
  rating: number,
  status: number,
  calls: number
};

module.exports = (sequelize:any, DataTypes:any) => {
  class Agent extends Model<AgentAttributes> implements AgentAttributes {
    agent_id!: string;
    super_id!: string;
    name!: string;
    surname!: string;
    password!: string;
    email!: string;
    rating!: number;
    status!: number;
    calls!: number;
    
    static associate(models:any) {
      /*
        Helper method for defining associations.
        This method is not a part of Sequelize lifecycle.
        The `models/index` file will call this method automatically.
     */
      // define association here
    }
  }
  Agent.init({
    agent_id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
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
    surname: {
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
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    calls: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Agent',
  });
  return Agent;
};