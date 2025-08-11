const express = require('express');
const routes = express.Router();
const { validate, validateAdmin } = require('./middlewares/auth');

const { loginCliente, loginAdmin } = require('./controllers/login');
const { createCliente } = require('./controllers/cadastro');

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

// Rotas Públicas
routes.post('/login/cliente', loginCliente);
routes.post('/login/admin', loginAdmin);
routes.post('/cadastro/cliente', createCliente);
routes.get('/produtos', Produto.read);
routes.get('/produtos/:id', Produto.readOne);

// Rotas para Clientes Logados
routes.get('/avaliacoes', validate, Avaliacao.read);
routes.get('/avaliacoes/:id', validate, Avaliacao.readOne);
routes.post('/avaliacoes', validate, Avaliacao.create);
routes.put('/avaliacoes/:id', validate, Avaliacao.update);
routes.delete('/avaliacoes/:id', validate, Avaliacao.remove);

routes.get('/pedidos', validate, Pedido.read);
routes.get('/pedidos/:id', validate, Pedido.readOne);
routes.post('/pedidos', validate, Pedido.create);
routes.put('/pedidos/:id', validate, Pedido.update);
routes.delete('/pedidos/:id', validate, Pedido.remove);

routes.get('/enderecos', validate, Endereco.read);
routes.get('/enderecos/:id', validate, Endereco.readOne);
routes.post('/enderecos', validate, Endereco.create);
routes.put('/enderecos/:id', validate, Endereco.update);
routes.delete('/enderecos/:id', validate, Endereco.remove);

routes.get('/clientes', validate, Cliente.read);
routes.get('/clientes/:id', validate, Cliente.readOne);
routes.put('/clientes/:id', validate, Cliente.update);
routes.delete('/clientes/:id', validate, Cliente.remove);

// Rotas de Administradores
routes.post('/empresas', validateAdmin, Empresa.create);
routes.get('/empresas', validateAdmin, Empresa.read);
routes.get('/empresas/:id', validateAdmin, Empresa.readOne);
routes.put('/empresas/:id', validateAdmin, Empresa.update);
routes.delete('/empresas/:id', validateAdmin, Empresa.remove);

routes.post('/produtos', validateAdmin, Produto.create);
routes.put('/produtos/:id', validateAdmin, Produto.update);
routes.delete('/produtos/:id', validateAdmin, Produto.remove);

routes.post('/tipoempregos', validateAdmin, TipoEmprego.create);
routes.get('/tipoempregos', validateAdmin, TipoEmprego.read);
routes.get('/tipoempregos/:id', validateAdmin, TipoEmprego.readOne);
routes.put('/tipoempregos/:id', validateAdmin, TipoEmprego.update);
routes.delete('/tipoempregos/:id', validateAdmin, TipoEmprego.remove);

routes.post('/funcionarios', validateAdmin, Funcionario.create);
routes.get('/funcionarios', validateAdmin, Funcionario.read);
routes.get('/funcionarios/:id', validateAdmin, Funcionario.readOne);
routes.put('/funcionarios/:id', validateAdmin, Funcionario.update);
routes.delete('/funcionarios/:id', validateAdmin, Funcionario.remove);

routes.post('/itenspedidos', validateAdmin, ItensPedido.create);
routes.get('/itenspedidos', validateAdmin, ItensPedido.read);
routes.get('/itenspedidos/:id', validateAdmin, ItensPedido.readOne);
routes.put('/itenspedidos/:id', validateAdmin, ItensPedido.update);
routes.delete('/itenspedidos/:id', validateAdmin, ItensPedido.remove);

routes.post('/pagamentos', validateAdmin, Pagamento.create);
routes.get('/pagamentos', validateAdmin, Pagamento.read);
routes.get('/pagamentos/:id', validateAdmin, Pagamento.readOne);
routes.put('/pagamentos/:id', validateAdmin, Pagamento.update);
routes.delete('/pagamentos/:id', validateAdmin, Pagamento.remove);

module.exports = routes;