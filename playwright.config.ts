import { defineConfig } from '@playwright/test';

export default defineConfig({
  workers: process.env.CI ? 1 : undefined,  // Usa múltiplos workers localmente, apenas 1 no CI
  retries: process.env.CI ? 2 : 0,          // Tenta rodar novamente testes que falham no CI
  use: {
    headless: true,                         
    trace: 'on-first-retry',                
  },
  reporter: [['html', { open: 'never' }]],  
});
