import { DataTypes, Model } from "sequelize";
import {sequelize} from "./db/config.js";

class User extends Model{}

User.init(
    {
        id:{
            type:DataTypes.UUID,
            primaryKey:true,
            defaultValue:DataTypes.UUIDV4
        },
          userName:{
            type:DataTypes.STRING,
            allowNull:false,
          },
          email:{
            type:DataTypes.STRING,
            unique:true,
            allowNull:false
          },
          password:{
            allowNull:false,
            type:DataTypes.STRING,

          },
          gender:{
            type:DataTypes.ENUM("male","female","other"),
            allowNull:true
          }

      }
      ,
          {
            sequelize,
            tableName:'users',
            modelName:'User'
          }
)

export default User