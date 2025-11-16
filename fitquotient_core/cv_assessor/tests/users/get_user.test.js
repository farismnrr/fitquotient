const fetch = require("node-fetch");
const { BASE_URL, API_KEY } = require("../config");

describe("User Get By ID E2E Test", () => {
  // Setup: Create and login a test user before running get user tests
  let testUser = {
    full_name: "Test User",
    username: "testuser" + Date.now(),
    email: `testuser.${Date.now()}@example.com`,
    password: "password123",
    confirm_password: "password123",
  };
  let accessToken = "";
  let userId = "";

  beforeAll(async () => {
    // Register a test user
    const registerResponse = await fetch(`${BASE_URL}/api/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify(testUser),
    });

    const registerData = await registerResponse.json();
    userId = registerData.data.user_id;

    // Login to get access token
    const loginResponse = await fetch(`${BASE_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify({
        username: testUser.username,
        password: testUser.password,
      }),
    });

    const loginData = await loginResponse.json();
    accessToken = loginData.data.access_token;
  });

  test("Get user by ID without Authorization", async () => {
    const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        // No Authorization header
      },
    });

    const responseBody = await response.json();

    try {
      expect(response.status).toBe(401);
      expect(responseBody.isSuccess).toBe(false);
      expect(responseBody.message).toBe("Authorization header is required");
    } catch (e) {
      console.log("API Response:", JSON.stringify(responseBody, null, 2));
      throw e;
    }
  });

  test("Get user by ID with Invalid Authorization", async () => {
    const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer invalid-token",
      },
    });

    const responseBody = await response.json();

    try {
      expect(response.status).toBe(401);
      expect(responseBody.isSuccess).toBe(false);
      expect(responseBody.message).toBe("Invalid token");
    } catch (e) {
      console.log("API Response:", JSON.stringify(responseBody, null, 2));
      throw e;
    }
  });

  test("Get User by ID (Valid)", async () => {
    const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const responseBody = await response.json();

    try {
      expect(response.status).toBe(200);
      expect(responseBody.isSuccess).toBe(true);
      expect(responseBody.message).toBe("User retrieved successfully");
      expect(responseBody.data).toHaveProperty("id");
      expect(responseBody.data).toHaveProperty("username");
      expect(responseBody.data).toHaveProperty("email");
      expect(responseBody.data).toHaveProperty("full_name");
      expect(responseBody.data.id).toBe(userId);
      expect(responseBody.data.username).toBe(testUser.username);
    } catch (e) {
      console.log("API Response:", JSON.stringify(responseBody, null, 2));
      throw e;
    }
  });

  test("Get User by Invalid ID", async () => {
    const invalidId = "invalid-uuid";
    const response = await fetch(`${BASE_URL}/api/users/${invalidId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const responseBody = await response.json();

    try {
      expect(response.status).toBe(400);
      expect(responseBody.isSuccess).toBe(false);
      expect(responseBody.message).toMatch(/Invalid user ID|Validation failed/);
    } catch (e) {
      console.log("API Response:", JSON.stringify(responseBody, null, 2));
      throw e;
    }
  });

  test("Get User by Non-existing ID", async () => {
    const nonExistingId = "550e8400-e29b-41d4-a716-446655440000"; // Random UUID
    const response = await fetch(`${BASE_URL}/api/users/${nonExistingId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const responseBody = await response.json();

    try {
      expect(response.status).toBe(404);
      expect(responseBody.isSuccess).toBe(false);
      expect(responseBody.message).toBe("user not found");
    } catch (e) {
      console.log("API Response:", JSON.stringify(responseBody, null, 2));
      throw e;
    }
  });
});
