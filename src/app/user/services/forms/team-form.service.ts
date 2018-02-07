import { AppConstants } from './../../../app.constants';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Picture } from './../../../core/models/picture';
import { Injectable } from '@angular/core';

@Injectable()
export class TeamFormService {

  constructor(
    private fb: FormBuilder
  ) {}

  initTeamForm(team: any) {
    return this.fb.group({
      'id': [''],
      'type': ['team'],
      'name': ['', Validators.required],
      'description': [''],
      'images_data': this.fb.array([]),
      'start_date': [],
      // 'pictures_attributes': this.fb.array(picture_attributes_array)
    });
  }

}
