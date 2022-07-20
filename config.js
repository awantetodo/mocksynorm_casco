const admin = require('firebase-admin')
const serviceAccount = require("./DB/segundaentregafinal-firebase-adminsdk-y8ueh-a8458d6245.json")

// Initialize Firebase
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: "https://segundaentregafinal.firebaseio.com"
  });
console.log('Firebase conectado')
const firebaseConnection = admin.firestore()

module.exports = {       
    firebaseConnection
}


