import { resolve } from 'path';
import { readFileSync } from 'fs';
import * as firebase from '@firebase/testing';
import { app as fbApp } from 'firebase';

// Visualize Evaluation: http://localhost:4103/emulator/v1/projects/test-firestore-security-project:ruleCoverage.html
const TEST_FIREBASE_PROJECT_ID = 'test-firestore-security-project';

function initializeFirestoreTestAppWithUser(user?: any): firebase.firestore.Firestore {
  return firebase
      .initializeTestApp({
        projectId: TEST_FIREBASE_PROJECT_ID,
        auth: user ?
        {
          uid: user.id,
        } :
        undefined,
      })
      .firestore();
}

const testUser1 = {
  id: 'testUser-1',
};
const testUser2 = {
  id: 'testUser-2',
};

describe('users collection', () => {
  let admin: fbApp.App;

  beforeAll((done) => {
    firebase
        .loadFirestoreRules({
          projectId: TEST_FIREBASE_PROJECT_ID,
          rules: readFileSync(resolve(__dirname, '../../../firestore.rules')).toString('utf-8'),
        })
        .then(() => {
          done();
        });
    admin = firebase.initializeAdminApp({
      projectId: TEST_FIREBASE_PROJECT_ID,
    });
  });

  afterAll(async () => {
    await admin.delete();
    await Promise.all(firebase.apps().map((app) => app.delete()));
  });

  function createTask(id: string) {
    return admin.firestore().doc(`users/${id}`).set({
      id,
      name: 'test',
    });
  }

  beforeEach(async () => {
    await createTask('user-id');
  });

  it('everyone should be able to read users', async () => {
    const db = initializeFirestoreTestAppWithUser();

    await firebase.assertSucceeds(
        db.doc('users/user-id').get(),
    );
  });

  it('any signedin user should be able to read users', async () => {
    const db = initializeFirestoreTestAppWithUser(testUser1);

    await firebase.assertSucceeds(
        db.doc('users/user-id').get(),
    );
  });

  it('noone should be allowed to update or delete users (from the frontend)', async () => {
    const db = initializeFirestoreTestAppWithUser();

    await firebase.assertFails(
        db.doc('users/user-id').update({}),
    );
    await firebase.assertFails(
        db.doc('users/user-id').delete(),
    );
  });

  it('noone should be allowed to update or delete users (from the frontend)', async () => {
    const db = initializeFirestoreTestAppWithUser(testUser1);

    await firebase.assertFails(
        db.doc('users/user-id').update({}),
    );
    await firebase.assertFails(
        db.doc('users/user-id').delete(),
    );
  });
});
