const fetch = require("node-fetch");
const { BASE_URL, API_KEY } = require("../config");

describe("User Login E2E Test", () => {
  // Setup: Create a test user before running login tests
  let testUser = {
    full_name: "Test User",
    username: "testuser" + Date.now(),
    email: `testuser.${Date.now()}@example.com`,
    password: "password123",
    confirm_password: "password123",
  };

  beforeAll(async () => {
    // Register a test user
    await fetch(`${BASE_URL}/api/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify(testUser),
    });
  });

  test("Login user without Authorization", async () => {
    const loginData = {
      username: testUser.username,
      password: testUser.password,
    };

    const response = await fetch(`${BASE_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // No X-API-Key header
      },
      body: JSON.stringify(loginData),
    });

    const responseBody = await response.json();

    try {
      expect(response.status).toBe(401);
      expect(responseBody.isSuccess).toBe(false);
      expect(responseBody.message).toBe("API Key is required");
    } catch (e) {
      console.log("API Response:", JSON.stringify(responseBody, null, 2));
      throw e;
    }
  });

  test("Login user with Invalid Authorization", async () => {
    const loginData = {
      username: testUser.username,
      password: testUser.password,
    };

    const response = await fetch(`${BASE_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": "invalid-key",
      },
      body: JSON.stringify(loginData),
    });

    const responseBody = await response.json();

    try {
      expect(response.status).toBe(401);
      expect(responseBody.isSuccess).toBe(false);
      expect(responseBody.message).toBe("Invalid API Key");
    } catch (e) {
      console.log("API Response:", JSON.stringify(responseBody, null, 2));
      throw e;
    }
  });

  test("Login User with Empty payload", async () => {
    const response = await fetch(`${BASE_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      // No body at all
    });

    const responseBody = await response.json();

    try {
      expect(response.status).toBe(400);
      expect(responseBody.isSuccess).toBe(false);
    } catch (e) {
      console.log("API Response:", JSON.stringify(responseBody, null, 2));
      throw e;
    }
  });

  test("Login User with Invalid Payload", async () => {
    const invalidLoginData = {
      username: "", // empty (required)
      password: "", // empty (required)
    };

    const response = await fetch(`${BASE_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify(invalidLoginData),
    });

    const responseBody = await response.json();

    try {
      expect(response.status).toBe(400);
      expect(responseBody.isSuccess).toBe(false);
      expect(responseBody.message).toMatch(/Validation failed/);
    } catch (e) {
      console.log("API Response:", JSON.stringify(responseBody, null, 2));
      throw e;
    }
  });

  test("Login User (Valid)", async () => {
    const loginData = {
      username: testUser.username,
      password: testUser.password,
    };

    const response = await fetch(`${BASE_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify(loginData),
    });

    const responseBody = await response.json();

    try {
      expect(response.status).toBe(200);
      expect(responseBody.isSuccess).toBe(true);
      expect(responseBody.message).toBe("Login successful");
      expect(responseBody.data).toHaveProperty("access_token");
      expect(typeof responseBody.data.access_token).toBe("string");
      const setCookieHeader = response.headers.get("set-cookie");
      expect(setCookieHeader).toBeDefined();
      expect(setCookieHeader).toMatch(/refresh_token=/);
    } catch (e) {
      console.log("API Response:", JSON.stringify(responseBody, null, 2));
      console.log("Set-Cookie Header:", response.headers.get("set-cookie"));
      throw e;
    }
  });

  test("Login User with Non-existing User", async () => {
    const loginData = {
      username: "nonexistentuser" + Date.now(),
      password: "password123",
    };

    const response = await fetch(`${BASE_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify(loginData),
    });

    const responseBody = await response.json();

    try {
      expect(response.status).toBe(401);
      expect(responseBody.isSuccess).toBe(false);
      expect(responseBody.message).toBe("invalid username or password");
    } catch (e) {
      console.log("API Response:", JSON.stringify(responseBody, null, 2));
      throw e;
    }
  });

  test("Login User with Wrong Password", async () => {
    const loginData = {
      username: testUser.username,
      password: "wrongpassword",
    };

    const response = await fetch(`${BASE_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
      },
      body: JSON.stringify(loginData),
    });

    const responseBody = await response.json();

    try {
      expect(response.status).toBe(401);
      expect(responseBody.isSuccess).toBe(false);
      expect(responseBody.message).toBe("invalid username or password");
    } catch (e) {
      console.log("API Response:", JSON.stringify(responseBody, null, 2));
      throw e;
    }
  });
});
