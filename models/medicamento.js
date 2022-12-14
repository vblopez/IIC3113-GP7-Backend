const mongoose = require("mongoose");
const { model } = require("mongoose");
const Schema  = mongoose.Schema;

const medicamentoSchema = new Schema({
  
  nombre: String,
  descripcion: String,
  precio: String,
  farmacia: String,
  link: String,
  imagen: String
  }
);

//creamos el modelo

const Medicamento = mongoose.model("Medicamento", medicamentoSchema);

module.exports = Medicamento;