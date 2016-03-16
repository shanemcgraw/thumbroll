"use strict";

module.exports = function(sequelize, DataTypes) {
  var students = sequelize.define("students", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
      timestamps: false,
      classMethods: {
        associate: function(models) {
          // Set bi-directional relationship
          // Creates field, but can't be
          students.hasMany(models.poll_responses, {
            foreignKey: 'student_id',
            onDelete: 'set null',
            onUpdate: 'cascade'
          }); 
          students.hasMany(models.students_classes, {
            foreignKey: 'student_id',
            onDelete: 'set null',
            onUpdate: 'cascade'
          }); 
        }
      }
    });
  return students;
};