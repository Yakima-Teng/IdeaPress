import { Sequelize } from 'sequelize'

export const sequelize = new Sequelize(
  useRuntimeConfig().mysql.database,
  useRuntimeConfig().mysql.username,
  useRuntimeConfig().mysql.password,
  {
    host: useRuntimeConfig().mysql.host,
    port: useRuntimeConfig().mysql.port,
    dialect: 'mysql',
    logging: (sql) => {
      if (sql.length > 500) {
        // eslint-disable-next-line no-console
        console.log(sql.substring(0, 500) + '...')
        return
      }
      // eslint-disable-next-line no-console
      console.log(sql)
    },
    pool: { // 连接池配置
      min: 5, // 最小连接数
      max: 10, // 最大链接数
      idle: 30000,
      acquire: 600000
    },
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
      connectTimeout: 600000
    },
    define: {
      // 字段以下划线（_）来分割（默认是驼峰命名风格）
      underscored: true
    },
    timezone: '+08:00' // for writing to database
  }
)

void (async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    /**
     * sync(): This creates the table if it doesn't exist (and does nothing if it already exists)
     * sync({ force: true }) - This creates the table, dropping it first if it already existed
     * sync({ alter: true }) - This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model.
     *
     * Reference: https://sequelize.org/docs/v6/core-concepts/model-basics/
     */
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
