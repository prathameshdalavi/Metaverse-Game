import axios from "axios";
const BACKEND_URL = "http://localhost:3000";
describe("Authentication", () => {
    test("User is able to Sign Up only for once ", async () => {
        const userName = "prathamesh" + Math.random();
        const password = "123456";
        const response = await axios.post(BACKEND_URL + "/api/v1/signup", {
            userName,
            password,
            type: "admin"
        });
        expect(response.status).toBe(200);
        const updatedResponse = await axios.post(BACKEND_URL + "/api/v1/signup", {
            userName,
            password,
            type: "admin"
        })
        expect(updatedResponse.status).toBe(400);
    })
    test("signup request fails if the  username is empty", async () => {
        const userName = `prathamesh-${Math.random()}`;
        const password = "123456";
        const response = await axios.post(BACKEND_URL + "/api/v1/signup", {
            password
        })
        expect(response.status).toBe(400)
    })
    test("signin succeeds if the username and password are correct", async () => {
        const userName = `prathamesh-${Math.random()}`;
        const password = "123456";
        await axios.post(BACKEND_URL + "/api/v1/signup", {
            userName,
            password
        })
        const response = await axios.post(BACKEND_URL + "/api/v1/signin", {
            userName,
            password
        })
        expect(response.status).toBe(200)
        expect(response.body.token).toBeDefined()
    })
    test("signin fails if the username and password are incorrect", async () => {
        const userName = `prathamesh-${Math.random()}`;
        const password = "123456";
        await axios.post(BACKEND_URL + "/api/v1/signup", {
            userName,
            password
        })
        const response = await axios.post(BACKEND_URL + "/api/v1/signin", {
            userName: "WrongUserName",
            password
        })
        expect(response.status).toBe(403)
    })
})
describe("User metadata endpoints", () => {
    let token = "";
    let avatarId = "";
    beforeAll(async () => {
        const userName = `prathamesh-${Math.random()}`;
        const password = "123456";
        await axios.post(BACKEND_URL + "/api/v1/signup", {
            userName,
            password
        })
        const response = await axios.post(BACKEND_URL + "/api/v1/signin", {
            userName,
            password
        })
        token = response.body.token;
        const avatarResponse = await axios.post(BACKEND_URL + "/api/v1/admin/avatar", {
            "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
            "name": "Avatar 1"
        })
        avatarId=avatarResponse.data.avatarId
    })
    test("User cant update their metadata with wrong avatar ID", async () => {
        const response = await axios.patch(BACKEND_URL + "/api/v1/user/metadata", {
            avatarId: "123123123"
        },{
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        expect(response.status).toBe(400)
    })
    test("User can update their metadata with correct avatar ID", async () => {
        const response = await axios.patch(BACKEND_URL + "/api/v1/user/metadata", {
            avatarId
        })
        expect(response.status).toBe(200)
    })
    test("User is not able to update their metadata if the auth header is not present", async () => {
        const response = await axios.patch(BACKEND_URL + "/api/v1/user/metadata", {
            avatarId
        })
        expect(response.status).toBe(403)
    })
    
})
describe("User avatar Information", () => {
    let avatarId;
    let token ;
    let userId;
    beforeAll(async () => {
        const userName = `prathamesh-${Math.random()}`;
        const password = "123456";
        const signupResponse = await axios.post(BACKEND_URL + "/api/v1/signup", {
            userName,
            password,
            type: "admin"
        })
        userId = signupResponse.data.userId
        const response = await axios.post(BACKEND_URL + "/api/v1/signin", {
            userName,
            password
        })
        token = response.body.token;
        const avatarResponse = await axios.post(BACKEND_URL + "/api/v1/admin/avatar", {
            "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
            "name": "Avatar 1"
        })
        avatarId=avatarResponse.data.avatarId
    })


})


