const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { createHash } = require('../middlewares/auth');

const createCliente = async (req, res) => {
    const { nome, cpf, telefone, email, senha } = req.body;

    try {
        const hashedPassword = await createHash(senha);

        const novoCliente = await prisma.cliente.create({
            data: {
                nome,
                cpf,
                telefone,
                email,
                senha: hashedPassword,
            },
        });

        res.status(201).json(novoCliente);
    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        
        if (error.code === 'P2002') {
            return res.status(409).json({ message: 'O CPF informado já está cadastrado.' });
        }
        
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};

module.exports = {
    createCliente,
};