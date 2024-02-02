import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize'
import { sequelize } from '~/server/scripts/sequelize'
import { PostCat } from '~/server/models/postCat'

export class Post extends Model<InferAttributes<Post>, InferCreationAttributes<Post>> {
  declare id: CreationOptional<number>
  declare cover: string
  declare title: string
  declare abstract: string
  declare content: string
  declare status: string
  declare catId: number
  declare author: string
  declare source: string
  declare tag: string
}

Post.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  cover: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '封面图',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '文章标题',
  },
  abstract: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '文章摘要',
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '文章正文内容',
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '草稿',
    comment: '文章发布状态：草稿、已发布',
  },
  catId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
    comment: '文章分类id',
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '作者',
  },
  source: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '文章出处',
  },
  tag: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '文章tag',
  },
}, {
  sequelize,
  tableName: 'post',
})

Post.belongsTo(PostCat, {
  as: 'postCat',
  foreignKey: 'catId',
  targetKey: 'id'
})
PostCat.hasMany(Post, {
  as: 'posts',
  foreignKey: 'catId',
})
