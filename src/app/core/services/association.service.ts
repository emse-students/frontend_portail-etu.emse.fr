import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Association,
  AssociationDTO,
  AssociationLight,
  NewAssociation,
} from '../models/association.model';
import { environment } from '../../../environments/environment';
import { JsonLdService } from './json-ld.service';
import { arrayRemoveById } from './utils';
import { InfoService } from './info.service';
import { EventService } from './event.service';

@Injectable({
  providedIn: 'root',
})
export class AssociationService {
  allAssos: Subject<AssociationLight[] | null>;
  allLists: Subject<AssociationLight[] | null>;
  allAssosAndLists: Subject<AssociationLight[] | null>;
  private _allLists: AssociationLight[] | null = null;
  private _allAssos: AssociationLight[] | null = null;
  private _allAssosAndLists: AssociationLight[] | null = null;
  private gettingLights = false;
  loaded = false;

  constructor(
    private http: HttpClient,
    private jsonLdService: JsonLdService,
    private infoService: InfoService,
  ) {
    this.allAssos = new Subject<AssociationLight[] | null>();
    this.allLists = new Subject<AssociationLight[] | null>();
    this.allAssosAndLists = new Subject<AssociationLight[] | null>();
  }

  public create(asso: NewAssociation): Observable<AssociationLight> {
    const url = `${environment.apiUrl}/associations`;
    return this.http.post<AssociationLight>(url, asso).pipe(
      map(
        newAsso => {
          if (newAsso.isList) {
            this._allLists.push(newAsso);
            this._allAssosAndLists.push(newAsso);
            this.allLists.next(this._allLists.slice(0));
            this.allAssosAndLists.next(this._allAssosAndLists.slice(0));
            this.infoService.pushSuccess('Liste créée avec succès');
          } else {
            this._allAssos.push(newAsso);
            this.allAssos.next(this._allAssos.slice(0));
            this._allAssosAndLists.push(newAsso);
            this.allAssosAndLists.next(this._allAssosAndLists.slice(0));
            this.infoService.pushSuccess('Association créée avec succès');
          }
          return newAsso;
        },
        // eslint-disable-next-line no-unused-vars
        error => {
          this.allAssos.next(this._allAssos);
        },
      ),
    );
  }

  public getLights(): void {
    if (this._allAssos) {
      setTimeout(() => {
        this.allAssos.next(this._allAssos);
        this.allLists.next(this._allLists);
        this.allAssosAndLists.next(this._allAssosAndLists);
      });
    } else if (!this.gettingLights) {
      this.gettingLights = true;
      const url = `${environment.apiUrl}/associations`;
      this.http.get<AssociationLight[]>(url).subscribe((assos: AssociationLight[]) => {
        const allAssos = JsonLdService.parseCollection<AssociationLight>(assos).collection;
        // console.log(allAssos);
        this._allAssos = [];
        this._allLists = [];
        this._allAssosAndLists = [];
        for (let i = 0; i < allAssos.length; i++) {
          this._allAssosAndLists.push(allAssos[i]);
          if (allAssos[i].isList) {
            this._allLists.push(allAssos[i]);
          } else {
            this._allAssos.push(allAssos[i]);
          }
        }
        this.allLists.next(this._allLists);
        this.allAssos.next(this._allAssos);
        this.allAssosAndLists.next(this._allAssosAndLists);
        this.loaded = true;
      });
    }
  }

  public get(assoId: number): Observable<Association> {
    const url = `${environment.apiUrl}/associations/${assoId}`;
    return this.http.get<Association>(url).pipe(
      map((association: Association) => {
        association.events.map(EventService.parseDates);
        return association;
      }),
    );
  }

  public delete(id: number): Observable<Record<string, any>> {
    const url = `${environment.apiUrl}/associations/${id}`;
    return this.http.delete(url).pipe(
      map(
        a => {
          this._allAssos = arrayRemoveById(this._allAssos, id);
          this._allLists = arrayRemoveById(this._allLists, id);
          this._allAssosAndLists = arrayRemoveById(this._allAssosAndLists, id);
          this.allAssos.next(this._allAssos.slice(0));
          this.allLists.next(this._allLists.slice(0));
          this.allAssosAndLists.next(this._allAssosAndLists.slice(0));
          return a;
        },
        // eslint-disable-next-line no-unused-vars
        error => {
          this.allAssos.next(this._allAssos);
        },
      ),
    );
  }

  public put(asso: AssociationDTO): Observable<Association> {
    const url = `${environment.apiUrl}/associations/${asso.id}`;
    const $asso = new Subject<Association>();
    return this.http.put<Association>(url, asso).pipe(
      map(
        updatedAsso => {
          updatedAsso.events.map(EventService.parseDates);
          $asso.next(updatedAsso);
          for (let i = 0; i < this._allAssosAndLists.length; i++) {
            if (this._allAssosAndLists[i].id === updatedAsso.id) {
              this._allAssosAndLists[i] = updatedAsso;
            }
          }
          this.allAssosAndLists.next(this._allAssosAndLists.slice(0));
          if (updatedAsso.isList) {
            for (let i = 0; i < this._allLists.length; i++) {
              if (this._allLists[i].id === updatedAsso.id) {
                this._allLists[i] = updatedAsso;
              }
            }
            this.allLists.next(this._allLists.slice(0));
            this.infoService.pushSuccess('Liste modifiée avec succès');
          } else {
            for (let i = 0; i < this._allAssos.length; i++) {
              if (this._allAssos[i].id === updatedAsso.id) {
                this._allAssos[i] = updatedAsso;
              }
            }
            this.allAssos.next(this._allAssos.slice(0));
            this.infoService.pushSuccess('Association modifiée avec succès');
          }
          return updatedAsso;
        },
        // eslint-disable-next-line no-unused-vars
        error => {
          this.allAssos.next(this._allAssos);
          $asso.error('Error');
        },
      ),
    );
  }

  public tagToId(tag: string): Observable<number> {
    if (this._allAssos || this._allLists) {
      if (this._allAssos) {
        for (let _i = 0; _i < this._allAssos.length; _i++) {
          if (this._allAssos[_i].tag === tag) {
            return of(this._allAssos[_i].id);
          }
        }
      }
      if (this._allLists) {
        for (let _i = 0; _i < this._allLists.length; _i++) {
          if (this._allLists[_i].tag === tag) {
            return of(this._allLists[_i].id);
          }
        }
      }
      return of(-1);
    }
    const url = `${environment.apiUrl}/associations`;
    return this.http.get<AssociationLight[]>(url).pipe(
      map((assos: AssociationLight[]) => {
        const allAssos = JsonLdService.parseCollection<AssociationLight>(assos).collection;
        this._allAssos = [];
        this._allLists = [];
        this._allAssosAndLists = [];
        for (let i = 0; i < allAssos.length; i++) {
          this._allAssosAndLists.push(allAssos[i]);
          if (allAssos[i].isList) {
            this._allLists.push(allAssos[i]);
          } else {
            this._allAssos.push(allAssos[i]);
          }
        }
        this.allLists.next(this._allLists);
        this.allAssos.next(this._allAssos);
        this.allAssosAndLists.next(this._allAssosAndLists);
        for (let _i = 0; _i < this._allAssos.length; _i++) {
          if (this._allAssos[_i].tag === tag) {
            return this._allAssos[_i].id;
          }
        }
        for (let _i = 0; _i < this._allLists.length; _i++) {
          if (this._allLists[_i].tag === tag) {
            return this._allLists[_i].id;
          }
        }
        return -1;
      }),
    );
  }
}
