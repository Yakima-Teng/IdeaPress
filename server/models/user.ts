import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize'
import { sequelize } from '~/server/scripts/sequelize'

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>
  declare username: string
  declare password: string
  declare displayName: string
  declare avatar: string
  declare email: string
  declare phone: string
  declare role: string
}

User.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(127),
    allowNull: false,
    unique: 'username',
    comment: '登录用户名',
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    // 为安全起见，密码不需要可以通过接口查询出来
    get () {
      return undefined
    }
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '展示的昵称',
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '用户头像url',
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  sequelize,
  tableName: 'user',
})
