import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Association, AssociationDTO, AssociationLight} from '../models/association.model';
import {Observable, of, Subject} from 'rxjs';
import {environment} from '../../../environments/environment';
import {JsonLdService} from './json-ld.service';
import {arrayRemoveById} from './utils';
import {InfoService} from './info.service';
import {SETTINGS} from '../../settings/models/settings.models';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AssociationService {
  allAssos: Subject<AssociationLight[] | null>;
  private _allAssos: AssociationLight[] | null = null;
  private gettingLights = false;
  loaded = false;

  constructor (private http: HttpClient, private jsonLdService: JsonLdService, private infoService: InfoService) {
    this.allAssos = new Subject<AssociationLight[] | null>();
  }

  public create(asso: AssociationLight): void {
    const url = `${environment.api_url}/associations`;
    this.http.post<AssociationLight>(url, asso).subscribe(
      (newAsso) => {
        this._allAssos.push(newAsso);
        this.allAssos.next(this._allAssos.slice(0));
        this.infoService.pushSuccess('Association créée avec succès');
      },
      (error) => {
        this.allAssos.next(this._allAssos);
      }
    );
  }

  public getLights(): void {
    if (this._allAssos) {
      setTimeout(() => {this.allAssos.next(this._allAssos); });
    } else if (!this.gettingLights) {
      this.gettingLights = true;
      const url = `${environment.api_url}/associations`;
      this.http.get<AssociationLight[]>(url).subscribe((assos: AssociationLight[]) => {
        this._allAssos = this.jsonLdService.parseCollection<AssociationLight>(assos).collection;
        this.allAssos.next(this._allAssos);
        this.loaded = true;
      });
    }
  }

  public get(assoId: number): Observable<Association> {
    const url = `${environment.api_url}/associations/${assoId}`;
    return this.http.get<Association>(url);
  }

  public delete(id: number): void {
    const url = `${environment.api_url}/associations/${id}`;
    this.http.delete(url).subscribe(
      () => {
        this._allAssos = arrayRemoveById(this._allAssos, id);
        this.allAssos.next(this._allAssos.slice(0));
        this.infoService.pushSuccess('Association supprimée avec succès');
      },
      (error) => {
        this.allAssos.next(this._allAssos);
      }
    );
  }

  public put (asso: AssociationDTO): Observable<Association> {
    const url = `${environment.api_url}/associations/${asso.id}`;
    const $asso = new Subject<Association>();
    this.http.put<Association>(url, asso).subscribe(
      (updatedAsso) => {
        $asso.next(updatedAsso);
        for (let i = 0; i < this._allAssos.length; i++) {
          if (this._allAssos[i].id === updatedAsso.id) {
            this._allAssos[i] = updatedAsso;
          }
        }
        this.allAssos.next(this._allAssos.slice(0));
        this.infoService.pushSuccess('Association modifiée avec succès');
      },
      (error) => {
        this.allAssos.next(this._allAssos);
        $asso.error('Error');
      }
    );
    return $asso;
  }

  public tagToId(tag: string): Observable<number> {
    if (this._allAssos) {
      for (let _i = 0; _i < this._allAssos.length; _i++) {
        if ( this._allAssos[_i].tag === tag ) {
          return of(this._allAssos[_i].id);
        }
      }
      return of(-1);
    } else {
      const url = `${environment.api_url}/associations`;
      return this.http.get<AssociationLight[]>(url).pipe(map((assos: AssociationLight[]) => {
        this._allAssos = this.jsonLdService.parseCollection<AssociationLight>(assos).collection;
        this.allAssos.next(this._allAssos);
        for (let _i = 0; _i < this._allAssos.length; _i++) {
          if ( this._allAssos[_i].tag === tag ) {
            return this._allAssos[_i].id;
          }
        }
        return -1;
      }));
    }
  }
}
