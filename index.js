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
        return {}; // Retorna um objeto vazio se não existir o arquivo
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
    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(data, null, 2)); // Responde com dados em formato JSON
});

// Rota POST para adicionar dados
app.post('/data', (req, res) => {
    const newData = req.body;

    if (!newData.id) {
        return res.status(400).send('ID is required'); // Retorna erro se ID não estiver presente
    }

    const data = readData();
    data[newData.id] = newData; // Presume que cada entrada tem um ID único
    writeData(data);
    res.status(201).send(`Data added: ${JSON.stringify(newData, null, 2)}`); // Retorna confirmação
});

// Rota para servir a página HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html')); // Serve a página HTML
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});