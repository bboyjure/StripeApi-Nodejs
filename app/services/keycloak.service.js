const request = require('request');
const usersUrl = "https://perpro.sledenje.com/auth/admin/realms/omniopti/users"
const tokenUrl = "https://perpro.sledenje.com/auth/realms/omniopti/protocol/openid-connect/token"

const setKeycloakAttributes = (kcSubject, customerId, stripeSub) => {

    const tokenHeaders = {
        "Content-Type": "application/x-www-form-urlencoded",
    }

    const reqPayload = {
        grant_type: "password",
        client_id: "angular",
        password: "fleetopti",
        username: "test"
    }
    request.post({uri: tokenUrl, headers: tokenHeaders, form: reqPayload }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            const token = JSON.parse(body).access_token;
            const userHeaders = {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        
            const jsonObject = {
                "attributes": {
                    "stripeSub": stripeSub,
                    "stripeid": customerId
                }
            }

            request.put({uri: `${usersUrl}/${kcSubject}`, headers: userHeaders, body: JSON.stringify(jsonObject)},function (error, response, body) {
                if (!error){
                    console.log(`Keycloak attributes are set for keycloak:customer  ${kcSubject} : ${customerId}`)
                }
                else{
                    throw new Error("Keycloak Attributes have NOT been set!")
                }
            })
        }
        else{
            throw new Error("Cannot get keycloak ID")
        }
    })
}

module.exports = { setKeycloakAttributes };