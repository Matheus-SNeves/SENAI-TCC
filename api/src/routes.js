const express = require('express');
const routes = express.Router();
const { validate, isCliente, isAdmin } = require('./middlewares/auth');

// Importa os controllers
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

// Rotas de login e cadastro
routes.post('/login', login.loginCliente);
routes.post('/login-admin', login.loginAdmin);
routes.post('/cadastro/cliente', cadastro.createCliente);

// Rotas de produtos
routes.get('/produtos', Produto.read);
routes.get('/produtos/:id', Produto.readOne);

// Rotas de pedidos
routes.post('/pedidos', validate, isCliente, Pedido.create);
// ESTA É A LINHA 30 QUE ESTÁ CAUSANDO O ERRO.
// Por favor, verifique se ela está exatamente assim no seu arquivo.
routes.get('/pedidos', validate, isCliente, Pedido.read);
routes.get('/pedidos/:id', validate, isCliente, Pedido.readOne);
routes.put('/pedidos/:id', validate, isCliente, Pedido.update);
routes.delete('/pedidos/:id', validate, isCliente, Pedido.remove);

// Rotas de itens de pedido
routes.post('/itenspedidos', validate, isCliente, ItensPedido.create);
routes.get('/itenspedidos', validate, isCliente, ItensPedido.read);
routes.get('/itenspedidos/:id', validate, isCliente, ItensPedido.readOne);
routes.put('/itenspedidos/:id', validate, isCliente, ItensPedido.update);
routes.delete('/itenspedidos/:id', validate, isCliente, ItensPedido.remove);

// Rotas de pagamento
routes.post('/pagamentos', validate, isCliente, Pagamento.create);
routes.get('/pagamentos', validate, isCliente, Pagamento.read);
routes.get('/pagamentos/:id', validate, isCliente, Pagamento.readOne);
routes.put('/pagamentos/:id', validate, isCliente, Pagamento.update);
routes.delete('/pagamentos/:id', validate, isCliente, Pagamento.remove);

// Rotas de avaliações
routes.post('/avaliacoes', validate, isCliente, Avaliacao.create);
routes.get('/avaliacoes', Avaliacao.read);
routes.get('/avaliacoes/:id', Avaliacao.readOne);
routes.put('/avaliacoes/:id', validate, isCliente, Avaliacao.update);
routes.delete('/avaliacoes/:id', validate, isCliente, Avaliacao.remove);

// Rotas de endereços
routes.post('/enderecos', validate, Endereco.create);
routes.get('/enderecos', validate, Endereco.read);
routes.get('/enderecos/:id', validate, Endereco.readOne);
routes.put('/enderecos/:id', validate, Endereco.update);
routes.delete('/enderecos/:id', validate, Endereco.remove);

// Rotas de empresas (apenas para admin)
routes.post('/empresas', validate, isAdmin, Empresa.create);
routes.get('/empresas', validate, isAdmin, Empresa.read);
routes.get('/empresas/:id', validate, isAdmin, Empresa.readOne);
routes.put('/empresas/:id', validate, isAdmin, Empresa.update);
routes.delete('/empresas/:id', validate, isAdmin, Empresa.remove);

// Rotas de produtos para admin
routes.post('/produtos', validate, isAdmin, Produto.create);
routes.put('/produtos/:id', validate, isAdmin, Produto.update);
routes.delete('/produtos/:id', validate, isAdmin, Produto.remove);

// Rotas de tipo de empregado
routes.post('/tipoempregos', validate, isAdmin, TipoEmprego.create);
routes.get('/tipoempregos', validate, isAdmin, TipoEmprego.read);
routes.get('/tipoempregos/:id', validate, isAdmin, TipoEmprego.readOne);
routes.put('/tipoempregos/:id', validate, isAdmin, TipoEmprego.update);
routes.delete('/tipoempregos/:id', validate, isAdmin, TipoEmprego.remove);

// Rotas de funcionários
routes.post('/funcionarios', validate, isAdmin, Funcionario.create);
routes.get('/funcionarios', validate, isAdmin, Funcionario.read);
routes.get('/funcionarios/:id', validate, isAdmin, Funcionario.readOne);
routes.put('/funcionarios/:id', validate, isAdmin, Funcionario.update);
routes.delete('/funcionarios/:id', validate, isAdmin, Funcionario.remove);

// Rotas de clientes (apenas para admin)
routes.get('/clientes', validate, isAdmin, Cliente.read);
routes.get('/clientes/:id', validate, isAdmin, Cliente.readOne);
routes.put('/clientes/:id', validate, isAdmin, Cliente.update);
routes.delete('/clientes/:id', validate, isAdmin, Cliente.remove);

// Exporta as rotas para serem usadas no seu arquivo principal
module.exports = routes;
