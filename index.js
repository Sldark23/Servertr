const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware para parsear JSON e servir arquivos estáticos
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Função para ler dados do arquivo JSON
const readData = () => {
    if (!fs.existsSync('data.json')) {
        // Se o arquivo não existir, retorna um objeto vazio
        return {};
    }
    const data = fs.readFileSync('data.json', 'utf-8');
    return JSON.parse(data);
};

// Função para escrever dados no arquivo JSON
const writeData = (data) => {
    fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
};

// Rota GET para obter dados
app.get('/data', (req, res) => {
    const data = readData();
    res.json(data);
});

// Rota POST para adicionar dados
app.post('/data', (req, res) => {
    const newData = req.body;

    if (!newData.id) {
        return res.status(400).json({ error: 'ID is required' });
    }

    const data = readData();

    // Adiciona os novos dados ao existente
    data[newData.id] = newData; // Presume que cada entrada tem um ID único
    writeData(data);
    res.status(201).json(newData);
});

// Rota de boas-vindas
app.get('/', (req, res) => {
    res.send('<h1>Bem-vindo ao site da SDFCoins!</h1><p>Use /data para interagir com os dados.</p>');
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});