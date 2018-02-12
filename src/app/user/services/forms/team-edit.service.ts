import { AppConstants } from './../../../app.constants';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Picture } from './../../../core/models/picture';
import { Injectable } from '@angular/core';

@Injectable()
export class TeamEditService {

  constructor(
    private fb: FormBuilder
  ) {}

  initTeamForm(team: any) {
    return this.fb.group({
      'id': [team.id],
      'type': ['team'],
      'name': [team.name, Validators.required],
      'email': [team.email],
      'web_url': [team.web_url],
      'images_data': this.fb.array([]),
      'start_date': [],
      'representative': [team.representative ? team.representative : '']
      // 'pictures_attributes': this.fb.array(picture_attributes_array)
    });
  }

}
