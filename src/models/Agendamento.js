module.exports = (sequelize, DataTypes) => {
    const Agendamento = sequelize.define('Agendamento', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      clienteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Clientes',
          key: 'id',
        },
      },
      servico: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      data: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      hora: {
        type: DataTypes.TIME,
        allowNull: false,
      }
    }, {
      tableName: 'agendamentos',
      timestamps: false,
    });
  
    Agendamento.associate = (models) => {
      Agendamento.belongsTo(models.Cliente, {
        foreignKey: 'clienteId',
        as: 'cliente',
      });
    };
  
    return Agendamento;
  };
  