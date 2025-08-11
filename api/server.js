const express = require('express');
const cors = require('cors');
const app = express();
const routes = require('./src/routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/swagger'); // Importe a configuração do Swagger

// Middleware para processar JSON e CORS
app.use(express.json());
app.use(cors());

// Adicione as rotas da sua API
app.use(routes);

// Adicione as rotas do Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 1243;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Documentação Swagger disponível em http://localhost:${PORT}/api-docs`);
});