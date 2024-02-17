import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize'
import { sequelize } from '~/server/scripts/sequelize'

export class Menu extends Model<InferAttributes<Menu>, InferCreationAttributes<Menu>> {
  declare id: CreationOptional<number>
  declare link: string
  declare name: string
  declare order: number
  declare position: string
}

Menu.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '排序序号',
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'main',
    comment: '该菜单显示的位置：main',
  },
}, {
  sequelize,
  tableName: 'menu',
})
