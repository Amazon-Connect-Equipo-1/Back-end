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
    /*
    Class description
    */
    client_id!: string;
    client_name!: string;
    password!: string;
    email!: string;
    phone_number!: string;
    
    static associate(models:any) {
      /*
      Helper method for defining associations.
      This method is not a part of Sequelize lifecycle.
      The `models/index` file will call this method automatically.
     */

      /*Client.belongsToMany(models.Projects, {
        through: 'ProjectAssignments'
      });*/
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