<template>
  <div>
    <h1>Minigame</h1>
    <template v-if="!gameStarted">
      <button @click="startGame">Começar Jogo</button>
    </template>
    <template v-else>
      <div class="phrase-container">
        <h2>Escolha até 6 Palavras de Valores:</h2>
        <div class="phrase-list">
          <button v-for="(phrase, index) in phrases" :key="index" class="phrase-item"
            :class="{ 'highlighted-phrase': highlightedPhrase === index, 'clicked-phrase': clickedValues.includes(phrase) }"
            @click="toggleClickedValue(phrase)" :disabled="isValueButtonDisabled(phrase)">
            {{ phrase }}
          </button>
        </div>
        <h2>Escolha até 6 Palavras que Não São Valores:</h2>
        <div class="phrase-list">
          <button v-for="(phrase, index) in nonValues" :key="index" class="phrase-item"
            :class="{ 'highlighted-phrase': highlightedNonValue === index, 'clicked-phrase': clickedNonValues.includes(phrase) }"
            @click="toggleClickedNonValue(phrase)" :disabled="isNonValueButtonDisabled(phrase)">
            {{ phrase }}
          </button>
        </div>
        <button id="botao" @click="checkAnswers">Verificar Respostas</button>
      </div>
    </template>
  </div>
</template>

<script>
import axios from 'axios';


export default {

  data() {
    return {
      gameStarted: false,

      selectedValues: [],
      highlightedPhrase: null,
      clickedValues: [],
      selectedNonValues: [],
      highlightedNonValue: null,
      clickedNonValues: [],
      phrases: [
        "Aprendizagem contínua",
        "Atingir Objetivos",
        "Atitude Positiva",
        "Bem estar (físico, emocional, mental e espiritual)",
        "Colaboração com o cliente",
        "Comprometimento",
        "Comunicação aberta",
        "Confiança",
        "Cooperação",
        "Crescimento profissional",
        "Criatividade",
        "Desenvolvimento da liderança",
        "Desenvolvimento de pessoas",
        "Determinação",
        "Eficiência",
        "Ética",
        "Excelência",
        "Fazer a diferença",
        "Fazer com Qualidade",
        "Honestidade",
        "Imparcialidade",
        "Iniciativa",
        "Melhoria contínua",
        "Reconhecimento dos colaboradores",
        "Respeito",
        "Satisfação do cliente",
        "Segurança",
        "Trabalho em equipe",
        "Transparência",
        "Valoriza a diversidade"
      ],
      nonValues: [
        "Aprendizagem contínua",
        "Atingir Objetivos",
        "Atitude Positiva",
        "Bem estar (físico, emocional, mental e espiritual)",
        "Colaboração com o cliente",
        "Comprometimento",
        "Comunicação aberta",
        "Confiança",
        "Cooperação",
        "Crescimento profissional",
        "Criatividade",
        "Desenvolvimento da liderança",
        "Desenvolvimento de pessoas",
        "Determinação",
        "Eficiência",
        "Ética",
        "Excelência",
        "Fazer a diferença",
        "Fazer com Qualidade",
        "Honestidade",
        "Imparcialidade",
        "Iniciativa",
        "Melhoria contínua",
        "Reconhecimento dos colaboradores",
        "Respeito",
        "Satisfação do cliente",
        "Segurança",
        "Trabalho em equipe",
        "Transparência",
        "Valoriza a diversidade"
      ],


    };

  },
  methods:
  {

    async authenticateUser() {
      // Chame a API de autenticação
      const response = await axios.post('http://localhost:3000/api/authenticate', { cpf: '12345678901' });

      // Defina this.userInfo com os dados do usuário
      this.userInfo = response.data;

      // Continue com a lógica do seu código, por exemplo, chamando checkAnswers
      this.checkAnswers();
    },


    startGame() {
      this.gameStarted = true;
    },

 
    checkAnswers: async function () {
      console.log(this.selectedValues)
    console.log(this.selectedNonValues)
  try {
    
    // Certifique-se de que this.userInfo e this.userInfo.RD0_CIC estão definidos

    // Chamada à API para armazenar as seleções no banco de dados
    await axios.post('http://localhost:3000/api/storeGameSelections', {
      selectedValues: this.selectedValues,
      selectedNonValues: this.selectedNonValues,
    });
    console.log(this.selectedValues)
    console.log(this.selectedNonValues)
    // Limpar seleções e redefinir o estado do jogo
    this.selectedValues = [];
    this.highlightedPhrase = null;
    this.clickedValues = [];
    this.selectedNonValues = [];
    this.highlightedNonValue = null;
    this.clickedNonValues = [];
    this.gameStarted = false;

  } catch (error) {
    console.error('Erro ao chamar a rota de armazenamento no backend:', error);
    // Lógica de tratamento de erro, se necessário
  }
},


    highlightPhrase(index) {
      this.highlightedPhrase = index;
    },
    resetHighlightPhrase(index) {
      if (this.highlightedPhrase === index) {
        this.highlightedPhrase = null;
      }
    },
    toggleClickedValue(phrase) {
    if (this.clickedValues.length + this.clickedNonValues.length >= 12) {
      return;
    }

    if (this.clickedValues.includes(phrase)) {
      this.clickedValues = this.clickedValues.filter((clickedValue) => clickedValue !== phrase);
      // Remova a frase desselecionada do array de valores
      this.selectedValues = this.selectedValues.filter((value) => value !== phrase);
    } else {
      this.clickedValues.push(phrase);
      // Remova a frase selecionada do array de não valores se já estiver lá
      this.clickedNonValues = this.clickedNonValues.filter((nonValue) => nonValue !== phrase);
      // Adicione a frase selecionada ao array de valores
      this.selectedValues.push(phrase);
    }
  },
    highlightNonValue(index) {
      this.highlightedNonValue = index;
    },
    resetHighlightNonValue(index) {
      if (this.highlightedNonValue === index) {
        this.highlightedNonValue = null;
      }
    },
   
    toggleClickedNonValue(phrase) {
    if (this.clickedValues.length + this.clickedNonValues.length >= 12) {
      return;
    }

    if (this.clickedNonValues.includes(phrase)) {
      this.clickedNonValues = this.clickedNonValues.filter((clickedNonValue) => clickedNonValue !== phrase);
      // Remova a frase desselecionada do array de não valores
      this.selectedNonValues = this.selectedNonValues.filter((nonValue) => nonValue !== phrase);
    } else {
      this.clickedNonValues.push(phrase);
      // Remova a frase selecionada do array de valores se já estiver lá
      this.clickedValues = this.clickedValues.filter((value) => value !== phrase);
      // Adicione a frase selecionada ao array de não valores
      this.selectedNonValues.push(phrase);
    }
  },

    isValueButtonDisabled(phrase) {
      return (
        this.selectedValues.length >= 6 ||
        (this.selectedValues.length >= 12 && !this.selectedValues.includes(phrase)) ||
        this.selectedNonValues.includes(phrase) ||
        this.clickedNonValues.includes(phrase)
      );
    },

    isNonValueButtonDisabled(phrase) {
      return (
        this.selectedNonValues.length >= 6 ||
        (this.selectedNonValues.length >= 12 && !this.selectedNonValues.includes(phrase)) ||
        this.selectedValues.includes(phrase) ||
        this.clickedValues.includes(phrase)
      );
    },

    getSelectedTotal() {
      return this.selectedValues.length + this.selectedNonValues.length;
    },

    isCheckButtonDisabled() {
      return this.getSelectedTotal() === 0 || this.getSelectedTotal() > 12;
    },
  },
};
</script>
<style scoped>
.phrase-container {
  text-align: center;
  margin-top: 20px;
}

.phrase-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.phrase-item {
  margin: 10px;
  width: 18%;
  box-sizing: border-box;
  background-color: #ffffff;
  cursor: pointer;
  transition: all 0.5s;
  border: 2px solid #066399;
  border-radius: 5px;
  padding: 10px;
}

.phrase-item:hover {
  background-color: #066399;
  color: #fff;
}

.highlighted-phrase {
  padding: 10px;
  cursor: pointer;
}

.clicked-phrase {
  background-color: #066399;
  color: #fff;
}

.selected-options {
  margin-top: 20px;
}

.selected-options h3 {
  color: #990606;
}

.selected-options ul {
  list-style-type: none;
  padding: 0;
}

.selected-options li {
  margin: 5px 0;
  color: #066399;
}

#botao {
  margin: 10px;
  width: 18%;
  box-sizing: border-box;
  background-color: #86fa90;
  cursor: pointer;
  transition: all 0.5s;
  border: 2px solid #066399;
  border-radius: 5px;
  padding: 10px;
}

#botao:hover {
  background-color: rgb(9, 238, 28);
}

/* Adicione estilos conforme necessário */
</style>
