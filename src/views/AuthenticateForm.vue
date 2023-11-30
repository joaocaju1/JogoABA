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

        this.userInfo = response.data;
        this.error = null;
      } catch (error) {
        console.error('Erro no servidor:', error);
        this.handleAuthenticationError(error);
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

