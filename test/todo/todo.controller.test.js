const request = require("supertest");
const app = require("../../index");
const statusCode = require("../../src/utils/constants/statusCode");
const mongoose = require("mongoose");
// Import and mock the MongoDB operations
const db = require("../../src/models/todo.model");
jest.mock("../../src/models/todo.model");
beforeAll((done) => {
  done();
});

afterAll((done) => {
  // Closing the DB connection allows Jest to exit successfully.
  mongoose.connection.close();
  done();
});
describe("Todo API", () => {
  // Test data
  const fakeTodoList = [
    {
      _id: "64dc6dbca2eba7e1ae7f5f7e",
      title: "Title 1",
      description: "Description 1",
      completed: false,
      createdAt: "2023-08-16T06:33:32.815Z",
      __v: 0,
    },
    {
      _id: "64deec0507d82ec29e0279e0",
      title: "Title2",
      description: "Description 2",
      completed: false,
      createdAt: "2023-08-18T03:56:53.184Z",
      __v: 0,
    },
    {
      _id: "64deec802b5e4c9aa85fcc9f",
      title: "Title 3 test update",
      description: "Description 3",
      completed: false,
      created_at: "2023-08-18T03:58:56.109Z",
      updated_at: "2023-08-18T03:58:56.109Z",
      __v: 0,
      updatedAt: "2023-08-18T04:24:43.777Z",
    },
  ];

  // Test for get list todo
  it("should get list todo", async () => {
    db.find.mockResolvedValue(fakeTodoList);

    const res = await request(app).get("/todos");

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3);
  });

  // Test for create a new todo
  it("should create a new todo", async () => {
    // Mock the 'save' function to resolve with a mocked todo object
    const mockTodoInstance = {
      _id: "mockId",
      title: "Mocked Todo",
      description: "Mocked Description",
      completed: false,
      save: jest.fn().mockResolvedValue({
        _id: "mockId",
        title: "Mocked Todo",
        description: "Mocked Description",
        completed: false,
      }),
    };
    db.mockReturnValueOnce(mockTodoInstance);
    const response = await request(app).post("/todos").send({
      title: "Mocked Todo",
      description: "Mocked Description",
      completed: false,
    });

    // Assertions
    expect(response.status).toBe(statusCode.CREATED);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.title).toBe("Mocked Todo");
    expect(response.body.description).toBe("Mocked Description");
    expect(response.body.completed).toBe(false);
  });

  // Test for create a new todo with validate (title is required)
  it("should create a new todo with validate title", async () => {
    const response = await request(app).post("/todos").send({
      title: "",
      description: "Mocked Description",
      completed: false,
    });

    // Assertions
    expect(response.status).toBe(statusCode.BAD_REQUEST);
    expect(response.body).toHaveProperty("errors");
  });

  // Test for updating a todo
  it("should update a todo by ID", async () => {
    const updatedTodo = {
      title: "Updated Todo",
      description: "Updated Description",
      completed: true,
    };
    const mockTodoInstance = {
      _id: "mockId",
      ...updatedTodo,
      save: jest.fn().mockResolvedValue({}),
    };
    db.mockReturnValueOnce(mockTodoInstance);
    db.findById.mockReturnValue(new db(fakeTodoList[0]));
    const todoId = fakeTodoList[1]._id; // Replace with an actual todo ID
    const response = await request(app)
      .put(`/todos/${todoId}`)
      .send(updatedTodo);

    expect(response.status).toBe(statusCode.OK);
    expect(response.body).toHaveProperty("_id");
    expect(response.body.title).toBe("Updated Todo");
    expect(response.body.description).toBe("Updated Description");
    expect(response.body.completed).toBe(true);
  });

  // Test for updating a todo with id not found
  it("should update a todo with todo not found", async () => {
    const updatedTodo = {
      title: "Updated Todo",
      description: "Updated Description",
      completed: true,
    };
    db.findById.mockResolvedValue(false);
    db.prototype.save = jest.fn().mockResolvedValue(updatedTodo);
    const todoId = "64dc6dbca2eba7e1ae7f5f7a"; // Replace with an actual todo ID
    const response = await request(app)
      .put(`/todos/${todoId}`)
      .send(updatedTodo);

    expect(response.status).toBe(statusCode.NOT_FOUND);
    expect(response.body.message).toBe("Todo not found");
  });

  // Test for deleting a todo
  it("should delete a todo by ID", async () => {
    db.findById.mockResolvedValue(fakeTodoList[0]);
    db.deleteOne.mockResolvedValue(true);
    const todoId = fakeTodoList[1]._id; // Replace with an actual todo ID
    const response = await request(app).delete(`/todos/${todoId}`);

    expect(response.status).toBe(statusCode.OK);
    expect(response.body.message).toBe("Todo Deleted");
  });

  // Test for deleting a todo with id not found
  it("should delete a todo by ID with todo not found", async () => {
    db.findById.mockResolvedValue(null);
    const todoId = "64dc6dbca2eba7e1ae7f5f6b"; // Replace with an actual todo ID
    const response = await request(app).delete(`/todos/${todoId}`);

    expect(response.status).toBe(statusCode.NOT_FOUND);
    expect(response.body.message).toBe("Todo not found");
  });
});
