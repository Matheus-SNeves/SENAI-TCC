const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createHash } = require('../middlewares/auth');

const createCliente = async (req, res) => {
    const { nome, cpf, telefone, email, senha } = req.body;

    try {
        // Cria um hash da senha antes de salvar no banco de dados
        const hashedPassword = await createHash(senha);

        const novoCliente = await prisma.cliente.create({
            data: {
                nome,
                cpf,
                telefone,
                email,
                senha: hashedPassword, // Salva a senha com hash
            },
        });

        res.status(201).json(novoCliente);
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

module.exports = {
    createCliente,
};