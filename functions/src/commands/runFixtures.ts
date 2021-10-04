import * as admin from 'firebase-admin';
import { tasks } from '../data/tasks';

// connect to firebase emulators
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:4102';
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:4103';
const app = admin.initializeApp({ projectId: 'firetasks-local' });

const firestore = app.firestore();
Promise.allSettled(
    tasks.map((task) => firestore.collection('tasks').add(task.toFirestore()))
).then(() => {
  console.log('done');
}).catch((err) => {
  console.error(err);
});
