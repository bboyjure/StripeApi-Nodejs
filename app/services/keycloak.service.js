const request = require('request');
const usersUrl = process.env.KC_TOKEN_USERS
const tokenUrl = process.env.KC_TOKEN_URL
const { v4: uuidv4 } = require('uuid');


const setKeycloakAttributes = (kcSubject, customerId, stripeSub) => {

    const tokenHeaders = {
        "Content-Type": "application/x-www-form-urlencoded",
    }

    const reqPayload = {
        grant_type: "password",
        client_id: process.env.KC_ADMIN_ID,
        password:  process.env.KC_ADMIN_PASSWORD,
        username:  process.env.KC_ADMIN_USERNAME
    }
    const jsonObject = new Attributes(stripeSub, customerId, Date.now() + uuidv4())
    
    request.post({uri: tokenUrl, headers: tokenHeaders, form: reqPayload }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            const token = JSON.parse(body).access_token;
            // console.log(token)
            const userHeaders = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        
           

            request.put({uri: `${usersUrl}/${kcSubject}`, headers: userHeaders, body: JSON.stringify(jsonObject.getJsonObject())},function (error, response, body) {
                if (!error){
                    console.log(`Keycloak attributes are set for keycloak:customer  ${kcSubject} : ${customerId}`);
                }
                else{
                    throw new Error("Keycloak Attributes have NOT been set!");
                }
            })
        }
        else{
            throw new Error("Cannot get keycloak ID");
        }
    })

    return jsonObject.getJsonObject()
}

class Attributes {
    constructor(stripeSub, customerId, stripeGroupId){
        this.stripeSub = stripeSub;
        this.customerId = customerId;
        this.stripeGroupId = stripeGroupId;
    }

    getJsonObject(){
        return {"attributes": {
            "stripeSub": this.stripeSub,
            "stripeId": this.customerId,
            "stripeGroupId": this.stripeGroupId
        }}
    }
}

module.exports = { setKeycloakAttributes };