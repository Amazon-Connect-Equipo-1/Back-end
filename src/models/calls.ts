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
    call_id!: number;
    agent_id!: string;
    client_id!: string;
    time_start!: string;
    time_finish!: string;
    duration!: number;
    satisfaction!: number;
    date!: string;
    comments!: string;
    
    static associate(models:any) {
      Calls.belongsTo(models.Agent, {
        foreignKey: 'agent_id'
      });

      Calls.belongsTo(models.Client, {
        foreignKey: 'client_id'
      });
    }
  }

  Calls.init({
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