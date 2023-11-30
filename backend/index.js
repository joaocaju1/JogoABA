const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const config = {
  user: 'CLT144398fin.paper',
  password: 'qpoux47325UAQKV!@',
  server: '45.6.155.110',
  port: 1129,
  database: 'CRQK4E_144398_PR_DV',
  options: {
    encrypt: false,
  },
};

// Middleware para estabelecer a conexão com o banco de dados antes de cada rota
app.use(async (req, res, next) => {
  try {
    // Conectar ao banco de dados
    console.log('Conectando ao banco de dados...');
    await sql.connect(config);
    console.log('Conexão bem-sucedida!');
    next(); // Passa para a próxima função de middleware ou rota
  } catch (error) {
    console.error('Erro no servidor:', error);
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
  
});

app.post('/api/authenticate', async (req, res) => {
  const { cpf } = req.body;
  console.log(typeof cpf)
  
  try {
    // Consulta SQL para obter dados do usuário
    const result = await sql.query`SELECT RD0_NOME, RD0_CIC, RD0_FILIAL FROM RD0010 WHERE RD0_CIC = ${cpf} AND D_E_L_E_T_ = ''`;

    console.log(result.recordset)
    // Verificar se o usuário foi encontrado
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Retorne os campos desejados
    const userInfo = result.recordset[0];
      // Adicione as propriedades nome e filial ao objeto userInfo
      userInfo.nome = userInfo.RD0_NOME;
      userInfo.filial = userInfo.RD0_FILIAL;

    return res.json(userInfo);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  } finally {
    // Fechar a conexão com o banco de dados após processar a rota
    await sql.close();
  }
});

// Use middleware para analisar o corpo da solicitação
app.use(bodyParser.json()); 

// Rota para criar uma sessão (exemplo)
app.post('/api/createSession', (req, res) => {
  // Lógica para criar uma sessão (pode depender da sua aplicação)
  const userId = req.body.userId;

  // Exemplo: Crie uma sessão e envie uma resposta
  const sessionData = {
    sessionId: 'sua_sessao_gerada',
    userId: userId,
    // Outros dados de sessão
  };

  res.json(sessionData);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
