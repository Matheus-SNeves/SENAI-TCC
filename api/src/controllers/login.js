const jsonwebtoken = require("jsonwebtoken");
const { validatePassword } = require('../middlewares/auth');
const { PrismaClient } = require('../../generated/prisma'); 
const prisma = new PrismaClient();

const loginCliente = async (req, res) => {
    const { email, senha, validade } = req.body;

    try {
        // Encontra o cliente pelo email e verifica se ele existe
        const cliente = await prisma.cliente.findUnique({
            where: {
                email: email,
            }
        });

        if (!cliente) {
            return res.status(401).json({ message: 'E-mail ou Senha incorretos!' });
        }

        // Você precisará de um campo `senha` e `role` no modelo Cliente.
        // O código a seguir pressupõe que você já adicionou esses campos.
        // Adapte seu `schema.prisma` conforme a seção 4.
        const isValidPassword = await validatePassword(senha, cliente.senha);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'E-mail ou Senha incorretos!' });
        }

        const token = jsonwebtoken.sign(
            {
                id: cliente.id,
                nome: cliente.nome,
                email: cliente.email,
                role: 'CLIENTE', // Adiciona a role 'CLIENTE'
            },
            process.env.SECRET_JWT,
            { expiresIn: validade ? validade + "min" : "60min" }
        );
        res.status(200).json({ token: token });

    } catch (err) {
        console.error('Erro no login do cliente:', err);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// Implementação do login de administrador (funcionário)
const loginAdmin = async (req, res) => {
    const { email, senha, validade } = req.body;

    try {
        const admin = await prisma.funcionario.findUnique({
            where: {
                // Você precisará adicionar o campo `email` e `senha` no modelo Funcionario.
                // Adapte seu `schema.prisma` conforme a seção 4.
                email: email,
            }
        });

        if (!admin) {
            return res.status(401).json({ message: 'E-mail ou Senha incorretos!' });
        }

        const isValidPassword = await validatePassword(senha, admin.senha);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'E-mail ou Senha incorretos!' });
        }

        const token = jsonwebtoken.sign(
            {
                id: admin.id,
                nome: admin.nome,
                email: admin.email,
                role: 'ADMIN', // Adiciona a role 'ADMIN'
            },
            process.env.SECRET_JWT,
            { expiresIn: validade ? validade + "min" : "60min" }
        );
        res.status(200).json({ token: token });

    } catch (err) {
        console.error('Erro no login do administrador:', err);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

module.exports = {
    loginCliente,
    loginAdmin
}