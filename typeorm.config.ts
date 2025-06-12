import { DataSource } from "typeorm"

export default new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5436,
  username: "postgres",
  password: "admin54321",
  database: "bd_backend_nest_docker",
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  // migrationsTableName: "migrations_tables",

})