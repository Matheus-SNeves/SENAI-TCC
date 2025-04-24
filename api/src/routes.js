const express = require('express');
const routes = express.Router();

const Empresa = require('./controllers/empresa');
const Produto = require('./controllers/produto');
const TipoEmprego = require('./controllers/tipoemprego');
const Funcionario = require('./controllers/funcionario');
const Cliente = require('./controllers/cliente');
const Endereco = require('./controllers/endereco');
const Pedido = require('./controllers/pedido');
const ItensPedido = require('./controllers/itenspedido');
const Pagamento = require('./controllers/pagamento');
const Avaliacao = require('./controllers/avaliacao');

routes.get('/', (req, res) => {
  return res.json({ titulo: 'Speed Market PW' });
});

routes.post('/empresas', Empresa.create);
routes.get('/empresas', Empresa.read);
routes.get('/empresas/:id', Empresa.readOne);
routes.put('/empresas/:id', Empresa.update);
routes.delete('/empresas/:id', Empresa.remove);

routes.post('/produtos', Produto.create);
routes.get('/produtos', Produto.read);
routes.get('/produtos/:id', Produto.readOne);
routes.put('/produtos/:id', Produto.update);
routes.delete('/produtos/:id', Produto.remove);

routes.post('/tipoempregos', TipoEmprego.create);
routes.get('/tipoempregos', TipoEmprego.read);
routes.get('/tipoempregos/:id', TipoEmprego.readOne);
routes.put('/tipoempregos/:id', TipoEmprego.update);
routes.delete('/tipoempregos/:id', TipoEmprego.remove);

routes.post('/funcionarios', Funcionario.create);
routes.get('/funcionarios', Funcionario.read);
routes.get('/funcionarios/:id', Funcionario.readOne);
routes.put('/funcionarios/:id', Funcionario.update);
routes.delete('/funcionarios/:id', Funcionario.remove);

routes.post('/clientes', Cliente.create);
routes.get('/clientes', Cliente.read);
routes.get('/clientes/:id', Cliente.readOne);
routes.put('/clientes/:id', Cliente.update);
routes.delete('/clientes/:id', Cliente.remove);

routes.post('/enderecos', Endereco.create);
routes.get('/enderecos', Endereco.read);
routes.get('/enderecos/:id', Endereco.readOne);
routes.put('/enderecos/:id', Endereco.update);
routes.delete('/enderecos/:id', Endereco.remove);

routes.post('/pedidos', Pedido.create);
routes.get('/pedidos', Pedido.read);
routes.get('/pedidos/:id', Pedido.readOne);
routes.put('/pedidos/:id', Pedido.update);
routes.delete('/pedidos/:id', Pedido.remove);

routes.post('/itenspedidos', ItensPedido.create);
routes.get('/itenspedidos', ItensPedido.read);
routes.get('/itenspedidos/:id', ItensPedido.readOne);
routes.put('/itenspedidos/:id', ItensPedido.update);
routes.delete('/itenspedidos/:id', ItensPedido.remove);

routes.post('/pagamentos', Pagamento.create);
routes.get('/pagamentos', Pagamento.read);
routes.get('/pagamentos/:id', Pagamento.readOne);
routes.put('/pagamentos/:id', Pagamento.update);
routes.delete('/pagamentos/:id', Pagamento.remove);

routes.post('/avaliacoes', Avaliacao.create);
routes.get('/avaliacoes', Avaliacao.read);
routes.get('/avaliacoes/:id', Avaliacao.readOne);
routes.put('/avaliacoes/:id', Avaliacao.update);
routes.delete('/avaliacoes/:id', Avaliacao.remove);

module.exports = routes;
