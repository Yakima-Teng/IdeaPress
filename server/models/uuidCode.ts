import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize'
import { sequelize } from '~/server/scripts/sequelize'

export class UUIDCode extends Model<InferAttributes<UUIDCode>, InferCreationAttributes<UUIDCode>> {
  declare id: CreationOptional<number>
  declare uuid: string
  declare code: string
}

UUIDCode.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  uuid: {
    type: DataTypes.STRING,
    allowNull: false
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'uuid-code',
})
