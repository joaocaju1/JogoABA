const express = require('express');
const session = require('express-session')
const bodyParser = require('body-parser');
const sql = require('mssql');
const mysql = require('mysql2/promise'); // Note o '/promise'
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const mysqlConfig = {
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '',
  database: 'abagame',
};

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

// Middleware para estabelecer a conexão com o banco de dados SQL Server antes de cada rota
app.use(async (req, res, next) => {
  try {
    // Conectar ao banco de dados SQL Server
    console.log('Conectando ao banco de dados SQL Server...');
    await sql.connect(config);
    console.log('Conexão bem-sucedida!');
    next(); // Passa para a próxima função de middleware ou rota
  } catch (error) {
    console.error('Erro no servidor:', error);
    res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
});

app.use(session({
  secret: 'Your_Secret_Key',
  resave: true,
  saveUninitialized: true
}));

app.post('/api/authenticate', async (req, res) => {
  const { cpf } = req.body;
  console.log("FOI NO AUTENTICATE",req.body)
  try {
    // Consulta SQL para obter dados do usuário
    const result = await sql.query`SELECT RD0_NOME, RD0_CIC, RD0_FILIAL FROM RD0010 WHERE RD0_CIC = ${cpf} AND D_E_L_E_T_ = ''`;

    // Verificar se o usuário foi encontrado
    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Retorne os campos desejados
    const userInfo = result.recordset[0];

    // Adicione as propriedades nome, filial e user_id ao objeto userInfo
    userInfo.nome = userInfo.RD0_NOME;
    userInfo.filial = userInfo.RD0_FILIAL;
    userInfo.user_id = userInfo.RD0_CIC; // Ajuste para o nome correto do campo de usuário
    // Armazene userInfo no objeto req
    req.userInfo = userInfo;
    // console.log(req.userInfo)

    // Verifique se o UserID está presente na solicitação
    if (!req.body.cpf) {
      return res.status(400).json({ error: 'O UserID não foi especificado' });
    }

    // Verifique se o UserID está no formato correto
    const regex = /^[a-zA-Z0-9]{1,255}$/;
    if (!regex.test(req.body.cpf)) {
      return res.status(400).json({ error: 'O UserID está no formato incorreto' });
    }

    return res.json(userInfo);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  } finally {
    // Fechar a conexão com o banco de dados após processar a rota
    await sql.close();
  }
});


app.post('/api/storeGameSelections', async (req, res) => {
  console.log("FOI 1",req.body);

  try {
    const { selectedValues, selectedNonValues } = req.body;

    // Certifique-se de que req.userInfo está definido e tem a propriedade user_id
    if (!req.userInfo || !req.userInfo.user_id) {
      return res.status(400).json({ error: 'ID do usuário ausente na solicitação' });
    }

    const user_id = req.session.name; // Use req.session.name como o identificador do usuário

    // Certifique-se de que as seleções estejam presentes no corpo da solicitação
    if (!selectedValues || !selectedNonValues) {
      return res.status(400).json({ error: 'Dados de seleção ausentes na solicitação' });
    }

    // Conectar ao banco de dados MySQL
    const connection = await mysql.createConnection(mysqlConfig);

    // Inserir dados na tabela user_selections
    await connection.execute(
      'INSERT INTO user_selections (user_id, selected_values, selected_non_values) VALUES (?, ?, ?)',
      [user_id, JSON.stringify(selectedValues), JSON.stringify(selectedNonValues)]
    );

    // Fechar a conexão
    await connection.end();

    // Responder com sucesso
    const successMessage = 'Dados inseridos no banco com sucesso!';
    return res.json({ success: true, message: successMessage });

  } catch (error) {
    console.error('Erro ao armazenar seleções no banco de dados:', error);
    return res.status(500).json({ error: 'Erro interno do servidor', details: error.message });
  }
});

// Use middleware para analisar o corpo da solicitação
app.use(bodyParser.json()); 

// Rota para criar uma sessão (exemplo)
// app.post('/api/createSession', (req, res) => {
//   // Lógica para criar uma sessão (pode depender da sua aplicação)
//   const userId = req.body.userId;

//   // req.session.key = value
//   req.session.name = userId
//   return res.send("Session Set")
//   // Exemplo: Crie uma sessão e envie uma resposta
//   const sessionData = {
//     sessionId: 'sua_sessao_gerada',
//     userId: userId,
//     // Outros dados de sessão
//   };

//   res.json(sessionData);
// });


app.post('/api/createSession', function(req, res){
  const userId = req.body.userId;  
  console.log('Valor de userId recebido:', userId);
  req.session.name = userId;
  console.log('Valor de req.session.name definido:', req.session.name);
  return res.send("Session Set");
});

 
app.get("/session", function(req, res){
  var name = req.session.name
  return res.send(name)
});

// app.post('/api/s', function(req, res){
//   const userId = req.body.cpf;  // corrigido de userId para cpf
//   console.log('Valor de userId recebido:', userId);
//   req.session.name = userId;
//   console.log('Valor de req.session.name definido:', req.session.name);
//   return res.send("Session Set");
// });



app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
