import { test, expect } from '@playwright/test';
import { performance } from 'perf_hooks';

const BASE_URL = 'https://reqres.in'; 

test('Listar usuários e validar dados', async ({ request }) => {
  // get usuario
  const response = await request.get(`${BASE_URL}/api/users?page=2`);
  expect(response.status()).toBe(200);
  // verificação
  const data = await response.json();
  expect(data).toHaveProperty('data');
  expect(data.data).toBeInstanceOf(Array);
  
  for (const user of data.data) {
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('first_name');
    expect(user).toHaveProperty('last_name');
    expect(user).toHaveProperty('email');
    expect(user.email).toMatch(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/); 
  }
});

test('Criar e atualizar um usuário', async ({ request }) => {
  // Cria novo usuário
  const newUser = { name: 'Arnaldo Filho', job: 'QA' };
  const startTimeCreate = performance.now(); 
  const createResponse = await request.post(`${BASE_URL}/api/users`, { data: newUser });
  const endTimeCreate = performance.now(); 
  const createResponseTime = endTimeCreate - startTimeCreate;
  // validação criação e resposta
  expect(createResponse.status()).toBe(201);
  expect(createResponseTime).toBeLessThan(2000); 
  
  const createdUser = await createResponse.json();
  expect(createdUser).toHaveProperty('name', newUser.name);
  expect(createdUser).toHaveProperty('job', newUser.job);

  // atualizar usuário
  const updatedUser = { name: 'Arnaldo Filho atualizado', job: 'QA Engineer' };
  const startTimeUpdate = performance.now(); 
  const updateResponse = await request.put(`${BASE_URL}/api/users/${createdUser.id}`, { data: updatedUser });
  const endTimeUpdate = performance.now(); 
  const updateResponseTime = endTimeUpdate - startTimeUpdate;
  
  // validação atualização e resposta
  expect(updateResponse.status()).toBe(200);
  expect(updateResponseTime).toBeLessThan(2000); 
  
  const updatedResponse = await updateResponse.json();
  expect(updatedResponse).toHaveProperty('name', updatedUser.name);
  expect(updatedResponse).toHaveProperty('job', updatedUser.job);
});

test('Manipulação de falhas na API', async ({ request }) => {
  // delete usuario 
  const deleteResponse = await request.delete(`${BASE_URL}/api/users/999`);
  expect(deleteResponse.status()).toBe(204); 
  // verifica se usuario existe
  const verifyDeleteResponse = await request.get(`${BASE_URL}/api/users/999`);
  expect(verifyDeleteResponse.status()).toBe(404);
});