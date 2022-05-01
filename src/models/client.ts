import { Model, UUIDV4 } from 'sequelize';

//Interface that defines the attributes a register in the table Client needs
interface ClientAttributes{
  client_id: string,
  client_name: string,
  password: string,
  email: string,
  phone_number: string
};

module.exports = (sequelize:any, DataTypes:any) => {
  class Client extends Model<ClientAttributes> implements ClientAttributes {
    client_id!: string;
    client_name!: string;
    password!: string;
    email!: string;
    phone_number!: string;
    
    static associate(models:any) {
      Client.hasMany(models.Chat, {
        foreignKey: 'client_id'
      });

      Client.hasMany(models.Calls, {
        foreignKey: 'client_id'
      });
    }
  }
  
  Client.init({
    //Definition of the characteristics of the table attributes
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
    }
  }, {
    sequelize,
    modelName: 'Client',
  });

  return Client;
};