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

describe('given a ', () => {
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

  it('should', async () => {
    const db = initializeFirestoreTestAppWithUser();

    await firebase.assertSucceeds(
        db.doc('users/fake').get(),
    );
  });

  it('should not', async () => {
    const db = initializeFirestoreTestAppWithUser();

    await firebase.assertFails(
        db.doc('users/fake').delete(),
    );
  });
});
