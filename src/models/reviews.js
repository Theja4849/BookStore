import { DataTypes, Model } from "sequelize";
import { sequelize } from "./db/config.js";

class Review extends Model {}

Review.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5, 
      },
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users", 
        key: "id",
      },
      
    },
    bookId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "books", 
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Review",
    tableName: "reviews",
  }
);

export default Review;
