const express = require('express');
const routes = express.Router();
const { validate, isCliente, isAdmin } = require('./middlewares/auth');

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
const login = require('./controllers/login');
const cadastro = require('./controllers/cadastro');

routes.get('/', (req, res) => {
    return res.json({ titulo: 'Speed Market PW' });
});

routes.post('/login', login.loginCliente);
routes.post('/login-admin', login.loginAdmin);

routes.post('/clientes', cadastro.createCliente);

routes.get('/produtos', Produto.read);
routes.get('/produtos/:id', Produto.readOne);

routes.post('/pedidos', validate, isCliente, Pedido.create);
routes.get('/pedidos', validate, isCliente, Pedido.read);
routes.get('/pedidos/:id', validate, isCliente, Pedido.readOne);
routes.put('/pedidos/:id', validate, isCliente, Pedido.update);
routes.delete('/pedidos/:id', validate, isCliente, Pedido.remove);

routes.post('/itenspedidos', validate, isCliente, ItensPedido.create);
routes.get('/itenspedidos', validate, isCliente, ItensPedido.read);
routes.get('/itenspedidos/:id', validate, isCliente, ItensPedido.readOne);
routes.put('/itenspedidos/:id', validate, isCliente, ItensPedido.update);
routes.delete('/itenspedidos/:id', validate, isCliente, ItensPedido.remove);

routes.post('/pagamentos', validate, isCliente, Pagamento.create);
routes.get('/pagamentos', validate, isCliente, Pagamento.read);
routes.get('/pagamentos/:id', validate, isCliente, Pagamento.readOne);
routes.put('/pagamentos/:id', validate, isCliente, Pagamento.update);
routes.delete('/pagamentos/:id', validate, isCliente, Pagamento.remove);

routes.post('/avaliacoes', validate, isCliente, Avaliacao.create);
routes.get('/avaliacoes', validate, isCliente, Avaliacao.read);
routes.get('/avaliacoes/:id', validate, isCliente, Avaliacao.readOne);
routes.put('/avaliacoes/:id', validate, isCliente, Avaliacao.update);
routes.delete('/avaliacoes/:id', validate, isCliente, Avaliacao.remove);

routes.post('/enderecos', validate, isCliente, Endereco.create);
routes.get('/enderecos', validate, isCliente, Endereco.read);
routes.get('/enderecos/:id', validate, isCliente, Endereco.readOne);
routes.put('/enderecos/:id', validate, isCliente, Endereco.update);
routes.delete('/enderecos/:id', validate, isCliente, Endereco.remove);

routes.post('/empresas', validate, isAdmin, Empresa.create);
routes.get('/empresas', validate, isAdmin, Empresa.read);
routes.get('/empresas/:id', validate, isAdmin, Empresa.readOne);
routes.put('/empresas/:id', validate, isAdmin, Empresa.update);
routes.delete('/empresas/:id', validate, isAdmin, Empresa.remove);

routes.post('/produtos', validate, isAdmin, Produto.create);
routes.put('/produtos/:id', validate, isAdmin, Produto.update);
routes.delete('/produtos/:id', validate, isAdmin, Produto.remove);

routes.post('/tipoempregos', validate, isAdmin, TipoEmprego.create);
routes.get('/tipoempregos', validate, isAdmin, TipoEmprego.read);
routes.get('/tipoempregos/:id', validate, isAdmin, TipoEmprego.readOne);
routes.put('/tipoempregos/:id', validate, isAdmin, TipoEmprego.update);
routes.delete('/tipoempregos/:id', validate, isAdmin, TipoEmprego.remove);

routes.post('/funcionarios', validate, isAdmin, Funcionario.create);
routes.get('/funcionarios', validate, isAdmin, Funcionario.read);
routes.get('/funcionarios/:id', validate, isAdmin, Funcionario.readOne);
routes.put('/funcionarios/:id', validate, isAdmin, Funcionario.update);
routes.delete('/funcionarios/:id', validate, isAdmin, Funcionario.remove);

routes.get('/clientes', validate, isAdmin, Cliente.read);
routes.get('/clientes/:id', validate, isAdmin, Cliente.readOne);
routes.put('/clientes/:id', validate, isAdmin, Cliente.update);
routes.delete('/clientes/:id', validate, isAdmin, Cliente.remove);

module.exports = routes;