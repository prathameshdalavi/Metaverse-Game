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
        avatarId = avatarResponse.data.avatarId
    })
    test("User cant update their metadata with wrong avatar ID", async () => {
        const response = await axios.patch(BACKEND_URL + "/api/v1/user/metadata", {
            avatarId: "123123123"
        }, {
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
    let avatarId: any;
    let token;
    let userId: string;
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
        avatarId = avatarResponse.data.avatarId
    })
    test("Get back avatar information for a user", async () => {
        const response = await axios.get(`${BACKEND_URL}/api/v1/user/metadata/bulk?ids={${userId}`).then((response) => { })
        expect(response.data.avatar.length).toBe(1)
        expect(response.data.avatar[0].userId).toBe(userId)
    })
    test("Available avatars lists the recently created avatar",async ()=>{
        const response = await axios.post(`${BACKEND_URL}/api/v1/avatars`,{
            
        })
        expect(response.data.avatars[0].length).not.toBe(0)
        const currentAvatar=response.data.avatars[0].find((x: { id: any; })=>x.id===avatarId)
        expect(currentAvatar).toBeDefined()
    })
})
describe("Space Information", () => {
    let mapId: any;
    let element1Id: any;
    let element2Id: any;
    let token: any ;
    let adminId: any;
    let adminToken: any;
    let userId: string;
    let userToken: any;
    beforeAll(async () => {
        const userName = `prathamesh-${Math.random()}`;
        const password= "123456";
        const signupResponse = await axios.post(BACKEND_URL + "/api/v1/signup", {
            userName,
            password,
            type: "admin"
        })

        adminId = signupResponse.data.userId
        const response = await axios.post(BACKEND_URL + "/api/v1/signin", {
            userName,
            password
        })
        adminToken   = response.data.token; 
        

        const userSignupResponse = await axios.post(BACKEND_URL + "/api/v1/signup", {
            userName: `prathamesh-${Math.random()}`,
            password,
            type: "user"
        })

        userId = userSignupResponse.data.userId
        const userSigninResponse = await axios.post(BACKEND_URL + "/api/v1/signin", {
            userName: `prathamesh-${Math.random()}`,
            password
        })

        userToken   = userSigninResponse.data.token;
        
        
        
        const element1= await axios.post(BACKEND_URL + "/api/v1/admin/element", {
            "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
            "width": 1,
            "height": 1,
            "static": true},{
            headers: {
                Authorization: `Bearer ${adminToken}` 
            }
        })
        
     
        const element2= await axios.post(BACKEND_URL + "/api/v1/admin/element", {
            "image": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
            "width": 1,
            "height": 1,
            "static": true},{
            headers: {
                Authorization: `Bearer ${adminToken}`
            }
        })
        element1Id=element1.data.elementId
        element2Id=element2.data.elementId
        const map= await axios.post(BACKEND_URL + "/api/v1/admin/map", {
            "thumbnail": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",  
            "dimensions": "100x200",
            "defaultElements":[{
                elementId:element1Id,
                x:20,
                y:20
            },
            {
                elementId:element1Id,
                x:18,
                y:20
            },
        {
            elementId:element2Id, 
            x:19,
            y:20
        }]},{
            headers: {
                Authorization: `Bearer ${adminToken}`
            }
        })
        mapId=map.data.mapId
    }
    )
})
