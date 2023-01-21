import { Injectable } from '@angular/core';
import { CoreServicesModule } from '../../core.services.module';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { User } from '@firetasks/models';

@Injectable({
  providedIn: CoreServicesModule,
})
export class UserService {

  constructor(private firestore: Firestore) {}

  subscribeToUsers() {
    return collectionData(collection(this.firestore, 'users')).pipe(
      map((data) => data.map((item) => item as User)),
    );
  }
}
