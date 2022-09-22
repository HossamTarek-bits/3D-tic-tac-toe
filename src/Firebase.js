// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import {
  collection,
  addDoc,
  updateDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { doc, onSnapshot } from "firebase/firestore";

class Firebase {
  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyAySp3-_5n6DHWkyrqK_n0daak6LoZt5SU",
      authDomain: "d-tic-tac-toe-d39b1.firebaseapp.com",
      projectId: "d-tic-tac-toe-d39b1",
      storageBucket: "d-tic-tac-toe-d39b1.appspot.com",
      messagingSenderId: "737838352423",
      appId: "1:737838352423:web:9ea6ab4cb9e875dfbae602",
      measurementId: "G-JP5NH76M4J",
    };

    // Initialize Firebase
    this.app = initializeApp(firebaseConfig);
    getAnalytics(this.app);
    // initializeAppCheck(this.app, {
    //   provider: new ReCaptchaV3Provider("bits-secret"),

    //   // Optional argument. If true, the SDK automatically refreshes App Check
    //   // tokens as needed.
    //   isTokenAutoRefreshEnabled: true,
    // });
    this.db = getFirestore(this.app);
  }
  subscribeToGame = (gameId, callback) => {
    const unsubscribe = onSnapshot(doc(this.db, "games", gameId), (doc) => {
      console.log("Current data: ", doc.data());
      callback(doc.data());
    });
    return unsubscribe;
  };
  createGame = async (game, callback) => {
    const gameId = await addDoc(collection(this.db, "games"), game);
    callback(gameId.id);
  };
  updateGame = async (gameId, game) => {
    await updateDoc(doc(this.db, "games", gameId), game);
  };

  deleteOldGames = async () => {
    const games = await getDocs(collection(this.db, "games"));
    games.forEach((game) => {
      if (game.data().timeCreated < Date.now() - 1000 * 60 * 60 * 24) {
        deleteDoc(doc(this.db, "games", game.id));
      }
    });
  };
}

export default Firebase;
