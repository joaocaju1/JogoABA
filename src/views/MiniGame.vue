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
          <button
            v-for="(phrase, index) in phrases"
            :key="index"
            class="phrase-item"
            :class="{ 'highlighted-phrase': highlightedPhrase === index, 'clicked-phrase': clickedValues.includes(phrase) }"
            @click="toggleClickedValue(phrase)"
            :disabled="isValueButtonDisabled(phrase)"
          >
            {{ phrase }}
          </button>
        </div>
        <h2>Escolha até 6 Palavras que Não São Valores:</h2>
        <div class="phrase-list">
          <button
            v-for="(phrase, index) in nonValues"
            :key="index"
            class="phrase-item"
            :class="{ 'highlighted-phrase': highlightedNonValue === index, 'clicked-phrase': clickedNonValues.includes(phrase) }"
            @click="toggleClickedNonValue(phrase)"
            :disabled="isNonValueButtonDisabled(phrase)"
          >
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
  methods: {
    startGame() {
      this.gameStarted = true;
    },
    checkAnswers: async function () {
      if (this.selectedValues.length + this.selectedNonValues.length > 12) {
        alert("Escolha no máximo 12 frases no total.");
        return;
      }

      // alert("Você escolheu as seguintes frases como valores: " + this.selectedValues.join(", "));
      // alert("Você escolheu as seguintes frases como não valores: " + this.selectedNonValues.join(", "));

      this.selectedValues = [];
      this.highlightedPhrase = null;
      this.clickedValues = [];
      this.selectedNonValues = [];
      this.highlightedNonValue = null;
      this.clickedNonValues = [];
      this.gameStarted = false;

      
      if (!this.userInfo) {
    console.error('Erro: this.userInfo não está definido.');
    return;
  }

      try {
      // Enviar informações selecionadas para o backend
      const response = await axios.post('http://localhost:3000/api/saveUserSelections', {
        userId: this.userInfo.RD0_CIC,
        selectedValues: this.selectedValues,
        selectedNonValues: this.selectedNonValues,
      });
      console.log(this.userInfo.RD0_CIC);


      // Verificar a resposta do servidor
      if (response.data.success) {
        alert('Informações salvas com sucesso!');
      } else {
        throw new Error('Falha ao salvar informações no servidor');
      }
    } catch (error) {
      console.error('Erro ao salvar informações:', error);
      // Trate o erro ao salvar informações, se necessário
      alert('Erro ao salvar informações. Verifique o console para mais detalhes.');
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
      if (this.clickedValues.length + this.clickedNonValues.length >= 12 || (this.clickedValues.length >= 6 && !this.clickedValues.includes(phrase))) {
        return;
      }

      if (this.clickedValues.includes(phrase)) {
        this.clickedValues = this.clickedValues.filter((clickedValue) => clickedValue !== phrase);
      } else {
        this.clickedValues.push(phrase);
        // Remova a frase selecionada do outro array
        this.selectedNonValues = this.selectedNonValues.filter((nonValue) => nonValue !== phrase);
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
      if (this.clickedValues.length + this.clickedNonValues.length >= 12 || (this.clickedNonValues.length >= 6 && !this.clickedNonValues.includes(phrase))) {
        return;
      }

      if (this.clickedNonValues.includes(phrase)) {
        this.clickedNonValues = this.clickedNonValues.filter((clickedNonValue) => clickedNonValue !== phrase);
      } else {
        this.clickedNonValues.push(phrase);
        // Remova a frase selecionada do outro array
        this.selectedValues = this.selectedValues.filter((value) => value !== phrase);
      }
    },
        isValueButtonDisabled(phrase) {
      return (
        this.selectedValues.length >= 6 ||
        (this.selectedValues.length >= 3 && !this.selectedValues.includes(phrase)) ||
        this.selectedNonValues.includes(phrase) ||
        this.clickedNonValues.includes(phrase)
      );
    },

    isNonValueButtonDisabled(phrase) {
      return (
        this.selectedNonValues.length >= 6 ||
        (this.selectedNonValues.length >= 3 && !this.selectedNonValues.includes(phrase)) ||
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

#botao{
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

#botao:hover{
  background-color: rgb(9, 238, 28);
}
/* Adicione estilos conforme necessário */

</style>
