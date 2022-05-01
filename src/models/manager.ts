import { Model, UUIDV4 } from 'sequelize';

//Interface that defines the attributes a register in the table Manager needs
interface ManagerAttributes{
  manager_id: string,
  manager_name: string,
  manager_surname: string,
  password: string,
  email: string,
  profile_picture: string,
  is_quality: boolean
};

module.exports = (sequelize:any, DataTypes:any) => {
  class Manager extends Model<ManagerAttributes> implements ManagerAttributes {
    manager_id!: string;
    manager_name!: string;
    manager_surname!: string;
    password!: string;
    email!: string;
    profile_picture!: string;
    is_quality!: boolean;
    
    static associate(models:any) {
      Manager.hasMany(models.Comments, {
        foreignKey: 'super_id'
      });

      Manager.hasMany(models.Agent, {
        foreignKey: 'super_id'
      });
    }
  }

  Manager.init({
    manager_id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    manager_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    manager_surname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    profile_picture: {
      type: DataTypes.STRING,
      allowNull: true
    },
    is_quality: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Manager',
  });

  return Manager;
};