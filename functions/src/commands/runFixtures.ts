import * as admin from 'firebase-admin';
import { readFileSync } from 'fs';
import { omit } from 'lodash';
import { tasks } from '../data/tasks';
import { users } from '../data/users';

let adminOptions: any;
if (process.env.PROD) {
  const keyFile = 'apollo-fire-tasks-firebase-adminsdk-b8mgo-40040892e6.json';
  const key = JSON.parse(readFileSync(keyFile).toString());
  adminOptions = {
    projectId: key.project_id,
    credential: admin.credential.cert(key),
  };
} else {
  // connect to firebase emulators
  process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:4102';
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:4103';
  adminOptions = { projectId: 'firetasks-local' };
}
const app = admin.initializeApp(adminOptions);

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
