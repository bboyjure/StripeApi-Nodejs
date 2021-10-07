var session = require('express-session');
var Keycloak = require('keycloak-connect');

let _keycloak;

var keycloakConfig = {
    clientId: process.env.KC_CLIENTID,
    bearerOnly: true,
    serverUrl: process.env.KC_URL,
    realm: process.env.KC_REALM,
    realmPublicKey: process.env.KC_PUBLIC_KEY
};

function initKeycloak() {
    if (_keycloak) {
        console.warn("Keycloak Initialized!");
        return _keycloak;
    } 
    else {
        console.log("Initializing Keycloak...");
        var memoryStore = new session.MemoryStore();
        _keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);
        return _keycloak;
    }
}

function getKeycloak() {
    if (!_keycloak){
        console.error('Keycloak has not been initialized. Please called init first.');
    } 
    return _keycloak;
}

initKeycloak()

module.exports = {
    initKeycloak,
    getKeycloak
};