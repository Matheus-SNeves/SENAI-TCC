const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require('bcrypt');

const validate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).send({ message: "Acesso negado. Nenhum token recebido." });
    }

    try {
        const payload = jsonwebtoken.verify(token, process.env.SECRET_JWT);
        
        // Adiciona o payload (dados do usuário) à requisição
        req.user = payload;

        next();
    } catch (err) {
        return res.status(403).send({ message: "Token inválido ou expirado." });
    }
}

// Novo middleware para proteger rotas de administrador
const validateAdmin = (req, res, next) => {
    // Reutiliza o middleware de validação para verificar se o token é válido
    validate(req, res, () => {
        // Após a validação, checa a role do usuário
        if (req.user && req.user.role === 'ADMIN') {
            next();
        } else {
            return res.status(403).send({ message: "Acesso negado. Você não tem permissão de administrador." });
        }
    });
};

const createHash = async (senha) => {
    if (!senha) return null;

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(senha, salt);
        return hash;
    } catch (error) {
        console.error('Erro ao criar hash:', error);
        throw new Error('Erro ao criar hash');
    }   
}

const validatePassword = async (senha, hash) => {
    if (!senha || !hash) return false;

    try {
        return await bcrypt.compare(senha, hash);
    } catch (error) {
        console.error('Erro ao validar senha:', error);
        throw new Error('Erro ao validar senha');
    }
}

module.exports = { validate, validateAdmin, createHash, validatePassword };