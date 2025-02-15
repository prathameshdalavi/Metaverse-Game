import axios from "axios";
const BACKEND_URL = "http://localhost:3000";
describe("Authentication", () => {
    test("User is able to Sign Up only for once ", async () => {
        const userName = "prathamesh" + Math.random();
        const password = "123456";
        const response = await axios.post(BACKEND_URL + "/api/v1/signup", {
            userName,
            password,
            type:"admin"
        });
        expect(response.status).toBe(200);
        const updatedResponse = await axios.post(BACKEND_URL + "/api/v1/signup", {
            userName,
            password,
            type:"admin"
        })
        expect(updatedResponse.status).toBe(400);
    })
    test("signup request fails if the  username is empty",async ()=>{
        const userName=`prathamesh-${Math.random()}`;
        const password="123456";
        const response=await axios.post(BACKEND_URL+"/api/v1/signup",{
            password
        })
        expect(response.status).toBe(400)
    })
    test("signin succeeds if the username and password are correct",async ()=>{
        const userName=`prathamesh-${Math.random()}`;
        const password="123456";
        await axios.post(BACKEND_URL+"/api/v1/signup",{
            userName,
            password
        })
        const response=await axios.post(BACKEND_URL+"/api/v1/signin",{
            userName,
            password
        })
        expect(response.status).toBe(200)
        expect(response.body.token).toBeDefined()
    })
    test("signin fails if the username and password are incorrect",async ()=>{
        const userName=`prathamesh-${Math.random()}`;
        const password="123456";
        await axios.post(BACKEND_URL+"/api/v1/signup",{
            userName,
            password
        })
        const response=await axios.post(BACKEND_URL+"/api/v1/signin",{
            userName:"WrongUserName",
            password
        })
        expect(response.status).toBe(403)
    })
})

