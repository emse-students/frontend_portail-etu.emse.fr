import {Component, OnDestroy, OnInit} from '@angular/core';
import {Association} from '../../../core/models/association.model';
import {AssociationService} from '../../../core/services/association.service';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {FileDTO, FileToUpload} from '../../../core/models/file.model';
import {FileUploadService} from '../../../core/services/file-upload.service';
import {InfoService} from '../../../core/services/info.service';
import {Right, Role} from '../../../core/models/role.model';
import {UserLight} from '../../../core/models/auth.model';
import {RoleService} from '../../../core/services/role.service';
import {UserService} from '../../../core/services/user.service';
import {NewPosition, Position} from '../../../core/models/position.model';
import {PositionService} from '../../../core/services/position.service';
import {arrayFindById, arrayRemoveById} from '../../../core/services/utils';
import {AuthService} from '../../../core/services/auth.service';
import {JsonLdService} from '../../../core/services/json-ld.service';

@Component({
  selector: 'app-associations-review',
  templateUrl: './associations-review.component.html',
  styleUrls: ['./associations-review.component.scss']
})
export class AssociationsReviewComponent implements OnInit {
  asso: Association | null = null;
  loaded = false;
  imgPath = environment.img_url;
  addLogo = false;
  addDesc = false;
  changeName = false;
  changePos = false;
  changeColor = false;
  nameLoading = false;
  logoLoading = false;
  descLoading = false;
  positionLoading = false;
  roles: Role[];
  users: UserLight[];
  rights: Right[];
  contrasts = [
      {
        value: 'white',
        viewValue: 'Blanc'
      },
      {
        value: 'null',
        viewValue: 'Couleur 2'
      },
      {
        value: 'black',
        viewValue: 'Noir'
      }
    ];
  contrasts2 = [
    {
      value: 'white',
      viewValue: 'Blanc'
    },
    {
      value: 'null',
      viewValue: 'Couleur 1'
    },
    {
      value: 'black',
      viewValue: 'Noir'
    }
  ];

  get authService() {
    return this._authService;
  }


  constructor(
    private associationService: AssociationService,
    private route: ActivatedRoute,
    private router: Router,
    private fileUploadService: FileUploadService,
    private infoService: InfoService,
    private roleService: RoleService,
    private userService: UserService,
    private positionService: PositionService,
    private _authService: AuthService,
    private jsonLdService: JsonLdService
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.loaded = false;
      this.addLogo = false;
      this.changeName = false;
      this.addDesc = false;
      this.logoLoading = false;
      this.descLoading = false;
      if (!this.associationService.loaded) {
        this.associationService.allAssos.subscribe(() => {
          if (!this.loaded) {
            this.loadAsso(params);
          }
        });
        this.associationService.getLights();
      } else {
        this.loadAsso(params);
      }
    });
  }

  private loadAsso(params) {
    this.associationService.tagToId(params.get('id')).subscribe(
      (idAsso: number) => {
        if (idAsso === -1) {
          this.router.navigate(['/404']);
        } else {
          this.associationService.get(idAsso).subscribe((asso: Association) => {
            // console.log(asso);
            this.asso = asso;
            this.asso.color = this.asso.color ? this.asso.color : '#61259e';
            this.asso.color2 = this.asso.color2 ? this.asso.color2 : '#ffca28';
            if (this.authService.hasAssoRight(2, this.asso.id) || this.authService.isAdmin()) {
              let roleLoaded = false;
              let usersLoaded = false;
              let rightsLoaded = false;
              this.roleService.gets().subscribe((roles: Role[]) => {
                this.roles = roles;
                roleLoaded = true;
                this.loaded = usersLoaded && rightsLoaded;
              });
              this.userService.getAllUsers().subscribe((users: UserLight[]) => {
                this.users = users;
                usersLoaded = true;
                this.loaded = roleLoaded && rightsLoaded;
              });
              this.roleService.getRights().subscribe((rights: Right[]) => {
                this.rights = this.jsonLdService.parseCollection<Right>(rights).collection;
                rightsLoaded = true;
                this.loaded = roleLoaded && usersLoaded;
              });
            } else {
              this.loaded = true;
            }
          });
        }
      }
    );
  }

  uploadImg(img: FileToUpload) {
    this.addLogo = false;
    this.logoLoading = true;
    this.fileUploadService.uploadImg(img).subscribe(
      (imgDTO: FileDTO) => {
        // console.log(imgDTO);
        this.associationService.put(
          { id: this.asso.id, logo: environment.api_uri + '/img_objects/' + imgDTO.id }
        ).subscribe((asso: Association) => {
            this.asso = asso;
            this.logoLoading = false;
          },
          (error) => {
            this.logoLoading = false;
          });
      },
      (error) => {
        this.logoLoading = false;
      }
    );
  }

  uploadDesc(text: string) {
    this.addDesc = false;
    this.descLoading = true;
    this.associationService.put(
      { id: this.asso.id, description: text }
    ).subscribe(
      (asso: Association) => {
        this.asso = asso;
        this.descLoading = false;
      },
      (error) => {
        this.descLoading = false;
      }
    );
  }

  uploadName(text: string) {
    this.changeName = false;
    this.nameLoading = true;
    this.associationService.put(
      { id: this.asso.id, name: text }
    ).subscribe(
      (asso: Association) => {
        this.asso = asso;
        this.nameLoading = false;
      },
      (error) => {
        this.nameLoading = false;
      }
    );
  }

  uploadColors() {
    this.changeColor = false;
    this.associationService.put(
      {
        id: this.asso.id,
        color: this.asso.color,
        color2: this.asso.color2,
        contrastColor: this.asso.contrastColor,
        contrastColor2: this.asso.contrastColor2
      }
    ).subscribe(
      (asso: Association) => {
        this.asso = asso;
      }
    );
  }

  addPosition(position: NewPosition) {
    this.positionLoading = true;
    // console.log(position);
    const newRole = !!position.role.name;
    this.positionService.create(position).subscribe(
      (newPosition: Position) => {
        this.asso.positions.push(newPosition);
        if (newRole) {
          this.roles.push(newPosition.role);
        }
        this.positionLoading = false;
      },
      (error) => {
        this.positionLoading = false;
      }
    );
  }

  deletePosition(positionId: number) {
    this.positionService.delete(positionId).subscribe(
      () => {
        this.asso.positions = arrayRemoveById(this.asso.positions, positionId);
      },
      (error) => {
        this.asso.positions[arrayFindById(this.asso.positions, positionId)].loading = false;
        this.asso.positions = this.asso.positions.slice(0);
      }
    );
  }

  switchColor() {
    let temp = this.asso.color;
    this.asso.color = this.asso.color2;
    this.asso.color2 = temp;
    temp = this.asso.contrastColor;
    this.asso.contrastColor = this.asso.contrastColor2;
    this.asso.contrastColor2 = temp;
  }
}

