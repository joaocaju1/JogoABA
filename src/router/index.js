import { createRouter, createWebHistory } from 'vue-router';
import AuthenticateForm from '../views/AuthenticateForm.vue';
import Minigame from '../views/MiniGame.vue';


const routes = [
  {
    path: '/',
    redirect: '/authenticate'
  },
  {
    path: '/authenticate',
    name: 'Authenticate',
    component: AuthenticateForm
  },
  {
    path: '/minigame',
    name: 'Minigame',
    component: Minigame,
  },

  
  // ... outras rotas, se houver
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
