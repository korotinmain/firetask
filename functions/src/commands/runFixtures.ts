import * as admin from 'firebase-admin';
import { omit } from 'lodash';
import { tasks } from '../data/tasks';
import { users } from '../data/users';

// connect to firebase emulators
process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:4102';
process.env.FIRESTORE_EMULATOR_HOST = 'localhost:4103';
const app = admin.initializeApp({ projectId: 'firetasks-local' });

const auth = app.auth();
const firestore = app.firestore();

Promise.allSettled([
  ...users.map((user) => auth.createUser({
    ...user,
    uid: user.id,
    displayName: user.name,
    photoURL: user.avatar,
  })),
  // ...users.map((user) => firestore.collection('users').doc(user.id).set(omit(user, 'password'))),
  // TODO NOTE: in any real-life application we would NEVER allow that the plain text password will be stored in firestore
  //   this is only for the sake of the demo ;)
  ...users.map((user) => firestore.collection('users').doc(user.id).set(user)),
  ...tasks.map((task) => firestore.collection('tasks').doc(task.id).set(task.toFirestore())),
]).then(() => {
  console.log('done');
  process.exit();
}).catch((err) => {
  console.error(err);
});
