import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize'
import { sequelize } from '~/server/scripts/sequelize'

export class PostCat extends Model<InferAttributes<PostCat>, InferCreationAttributes<PostCat>> {
  declare id: CreationOptional<number>
  declare alias: string
  declare name: string
  declare order: number
  declare position: string
}

PostCat.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false,
  },
  alias: {
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
    comment: '该分类文章显示的问题：main、sidebar',
  },
}, {
  sequelize,
  tableName: 'post-cat',
})
