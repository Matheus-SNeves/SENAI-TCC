const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const create = async (req, res) => {
    try {
        const pedido = await prisma.pedido.create({
            data: req.body
        });
        return res.status(201).json(pedido);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

// Dentro do seu controller/pedido.js
const read = async (req, res) => {
    // req.user é injetado pelo middleware de autenticação
    const usuarioLogado = req.user;

    let whereClause = {};

    // Se o usuário for um CLIENTE, ele só pode ver os próprios pedidos
    if (usuarioLogado.role === 'CLIENTE') {
        whereClause = {
            id_cliente: usuarioLogado.id
        };
    }
    // Se for ADMIN, o whereClause fica vazio {}, e ele busca todos os pedidos.

    const pedidos = await prisma.pedido.findMany({
        where: whereClause,
        include: {
            cliente: {
                select: {
                    nome: true
                }
            }
        }
    });
    return res.json(pedidos);
}

const readOne = async (req, res) => {
    try {
        const pedido = await prisma.pedido.findUnique({
            select: {
                id: true,
                id_cliente: true,
                data_pedido: true,
                valor: true,
                cliente:{
                    select:{
                        nome:true
                    }
                }
            },
            where: {
                id: Number(req.params.id)
            }
        });
        return res.json(pedido);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const update = async (req, res) => {
    try {
        const pedido = await prisma.pedido.update({
            where: {
                id: Number(req.params.id)
            },
            data: req.body
        });
        return res.status(202).json(pedido);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

const remove = async (req, res) => {
    try {
        await prisma.pedido.delete({
            where: {
                id: Number(req.params.id)
            }
        });
        return res.status(204).send();
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
}

module.exports = {
    create,
    read,
    readOne,
    update,
    remove
};