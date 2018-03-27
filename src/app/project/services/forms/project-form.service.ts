import { AppConstants } from './../../../app.constants';
import { Picture } from './../../../core/models/picture';
import { Project } from './../../../core/models/project';
import { FormBuilder, Validators, FormControl } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable()
export class ProjectFormService {

  constructor(
    private fb: FormBuilder
  ) {}

  initProjectForm(project) {
    let pictures = project.pictures;
    if (!pictures) {
      pictures = [new Picture];
    }

    console.log("team id", project.team_id);

    const picture_attributes_array = [];
    pictures.forEach((picture) => {
      picture_attributes_array.push(
        this.fb.group({
          'id': [picture.id],
          'url': [picture.url],
          '_destroy': [false]
        })
      );
    });

    return this.fb.group({
      'id': [project.id],
      'type': ['project'],
      'title': [project.title, Validators.required],
      'desc': [project.desc],//,  Validators.compose([Validators.required, this.validateDesc])],
      'category_id': [project.category_id, Validators.required],
      'images_data': this.fb.array([]),
      'video_url': [project.video_url, this.validateURL],
      'pledged_amount': [project.pledged_amount, Validators.compose([Validators.required, this.validateAmount])],
      'funding_model': ['flexi'],
      'start_date': [],
      'currency': [project.currency || 'USD', Validators.required],
      'duration': [project.duration, Validators.compose([Validators.required, this.validateNumber])],
      'pictures_attributes': this.fb.array(picture_attributes_array),
      'team_id': [project.team_id, Validators.required]
    });
  }

  private validateNumber(c: FormControl) {
    return c.value > 0 && c.value <= 60 ? null : { validateNumber: true };
  };

 /* private validateDesc(c: FormControl) {
    return c.value > 0 && c.value <= 60 ? null : { validateNumber: true };
  };*/

  private validateAmount(c: FormControl) {
    return c.value > 0 && c.value <= 999999999999 ? null : { validateNumber: true };
  };

  private validateURL(c: FormControl) {
    const URL_REGEXP = AppConstants.URL_REGEX;
    return !(c.value) || URL_REGEXP.test(c.value) ? null : { validateURL: true };
  }

}
