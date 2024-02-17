import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize'
import { sequelize } from '~/server/scripts/sequelize'

export class Carousel extends Model<InferAttributes<Carousel>, InferCreationAttributes<Carousel>> {
  declare id: CreationOptional<number>
  declare img: string
  declare link: string
  declare name: string
  declare order: number
  declare position: string
}

Carousel.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  img: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
    comment: '轮播图图片地址'
  },
  link: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '',
    comment: '轮播图点击后跳转的地址',
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
    defaultValue: 'homeTop',
    comment: '该菜单显示的位置：homeTop',
  },
}, {
  sequelize,
  tableName: 'carousel',
})
