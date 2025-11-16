const fetch = require('node-fetch');
const { BASE_URL, API_KEY } = require('../config');

describe('User Registration E2E Test', () => {
  test('Add user without Authorization', async () => {
    const userData = {
      full_name: 'Jane Doe',
      username: 'janedoe' + Date.now(),
      email: `jane.doe.${Date.now()}@example.com`,
      password: 'password123',
      confirm_password: 'password123'
    };

    const response = await fetch(`${BASE_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
        // No X-API-Key header
      },
      body: JSON.stringify(userData)
    });

    const responseBody = await response.json();

    try {
      expect(response.status).toBe(401);
      expect(responseBody.isSuccess).toBe(false);
      expect(responseBody.message).toBe('API Key is required');
    } catch (e) {
      console.log('API Response:', JSON.stringify(responseBody, null, 2));
      throw e;
    }
  });

  test('Add user with Invalid Authorization', async () => {
    const userData = {
      full_name: 'Jane Doe',
      username: 'janedoe' + Date.now(),
      email: `jane.doe.${Date.now()}@example.com`,
      password: 'password123',
      confirm_password: 'password123'
    };

    const response = await fetch(`${BASE_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': 'invalid-key'
      },
      body: JSON.stringify(userData)
    });

    const responseBody = await response.json();

    try {
      expect(response.status).toBe(401);
      expect(responseBody.isSuccess).toBe(false);
      expect(responseBody.message).toBe('Invalid API Key');
    } catch (e) {
      console.log('API Response:', JSON.stringify(responseBody, null, 2));
      throw e;
    }
  });

  test('Add User with Empty payload', async () => {
    const response = await fetch(`${BASE_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      }
      // No body at all
    });

    const responseBody = await response.json();

    try {
      expect(response.status).toBe(400);
      expect(responseBody.isSuccess).toBe(false);
    } catch (e) {
      console.log('API Response:', JSON.stringify(responseBody, null, 2));
      throw e;
    }
  });

  test('Add User with Invalid Payload', async () => {
    const invalidUserData = {
      full_name: '', // empty (required)
      username: 'ab', // too short (min 3)
      email: 'not-an-email', // invalid email format
      password: '123', // too short (min 6)
      confirm_password: '456' // doesn't match password
    };

    const response = await fetch(`${BASE_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      },
      body: JSON.stringify(invalidUserData)
    });

    const responseBody = await response.json();

    try {
      expect(response.status).toBe(400);
      expect(responseBody.isSuccess).toBe(false);
      // Can be either validation failed or password mismatch error
      expect(responseBody.message).toMatch(/Validation failed|passwords do not match/);
    } catch (e) {
      console.log('API Response:', JSON.stringify(responseBody, null, 2));
      throw e;
    }
  });

  test('Add User (Valid)', async () => {
    const userData = {
      full_name: 'John Doe',
      username: 'johndoe' + Date.now(),
      email: `john.doe.${Date.now()}@example.com`,
      password: 'password123',
      confirm_password: 'password123'
    };

    const response = await fetch(`${BASE_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      },
      body: JSON.stringify(userData)
    });

    const responseBody = await response.json();

    try {
      expect(response.status).toBe(201);
      expect(responseBody.isSuccess).toBe(true);
      expect(responseBody.message).toBe('User registered successfully');
      expect(responseBody.data).toHaveProperty('user_id');
      expect(typeof responseBody.data.user_id).toBe('string');
    } catch (e) {
      console.log('API Response:', JSON.stringify(responseBody, null, 2));
      throw e;
    }
  });

  test('Add User with Existing User', async () => {
    // First, register a user
    const userData = {
      full_name: 'Existing User',
      username: 'existinguser',
      email: 'existing@example.com',
      password: 'password123',
      confirm_password: 'password123'
    };

    await fetch(`${BASE_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      },
      body: JSON.stringify(userData)
    });

    // Now try to register again with same username
    const response = await fetch(`${BASE_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': API_KEY
      },
      body: JSON.stringify(userData)
    });

    const responseBody = await response.json();

    try {
      expect(response.status).toBe(409);
      expect(responseBody.isSuccess).toBe(false);
      expect(responseBody.message).toBe('username already exists');
    } catch (e) {
      console.log('API Response:', JSON.stringify(responseBody, null, 2));
      throw e;
    }
  });
});
