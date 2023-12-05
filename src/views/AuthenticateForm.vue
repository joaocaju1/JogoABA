/* eslint-disable */
<template>
  <div>
    <h1>Autenticação</h1>
    <form @submit.prevent="authenticate">
      <label for="cpf">CPF:</label>
      <input type="text" v-model="cpf" required>
      <button type="submit">Autenticar</button>
    </form>

    <div v-if="userInfo">
      <h2>Informações do Usuário</h2>
      <p><strong>Nome:</strong> {{ userInfo.nome }}</p>
      <p><strong>CPF:</strong> {{ userInfo.RD0_CIC }}</p>
      <button @click="startMinigame">Começar</button>
    </div>

    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      cpf: '',
      userInfo: null,
      error: null
    };
  },

  methods: {
    async authenticate() {
  try {
    const response = await axios.post('http://localhost:3000/api/authenticate', {
      cpf: this.cpf
    });

    // Verifique se a resposta contém os dados esperados
    if (response.data && response.data.RD0_CIC) {
      console.log(response.data)
      // Atribua os dados do usuário a this.userInfo
      this.userInfo = response.data;
      
      // Crie uma sessão após a autenticação
      await this.createSession(this.userInfo.RD0_CIC);

      // Após a autenticação bem-sucedida, redirecione para a rota Minigame
      this.$router.push({ name: 'Minigame' });
    } else {
      console.error('Dados do usuário não encontrados na resposta da autenticação.');
      // Trate o erro conforme necessário
    }

  } catch (error) {
    console.error('Erro no servidor:', error);
    this.handleAuthenticationError(error);
  }
},



async createSession(userId) {
  try {
    // Adicione a barra antes de "api/createSession"
    const response = await axios.post('http://localhost:3000/api/createSession', {
  userId: userId
});

    // Verifique se a resposta contém os dados esperados
    if (response.data && response.data.sessionData) {
      // Armazene ou manipule os dados da sessão conforme necessário
      const sessionData = response.data.sessionData;
      console.log('Sessão criada:', sessionData);
    } else {
      console.error('Dados da sessão não encontrados na resposta da criação.');
      // Trate o erro conforme necessário
    }
  } catch (error) {
    console.error('Erro ao criar a sessão:', error);
    // Trate o erro ao criar a sessão, se necessário
  }
},

    startMinigame() {
      // Redirecionar para a página do minigame
      this.$router.push({ name: 'Minigame' });
    },

    handleAuthenticationError(error) {
      this.userInfo = null;

      if (error.response) {
        this.error = `Erro ${error.response.status}: ${error.response.data.error}`;
      } else if (error.request) {
        this.error = 'Sem resposta do servidor';
      } else {
        this.error = 'Erro ao configurar a requisição';
      }
    }
  }
};
</script>

