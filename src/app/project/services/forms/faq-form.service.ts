import { Faq } from './../../../core/models/faq';
import { FormBuilder, Validators } from '@angular/forms';
import { Injectable } from '@angular/core';
import { Project } from 'app/core/models/project';

@Injectable()
export class FaqFormService {
  project: Project;
  constructor(
    private fb: FormBuilder
  ) { }

  initFaqForm(project) {
    this.project = project;
    let faqs;
    if(!this.project.faqs){
      console.log("entre aqui =D");
      faqs = [new Faq];
    }else{
      console.log("entre aqui D:");
      faqs = this.project.faqs;
    }

    const faq_attributes_array = [];
    faqs.forEach((faq: any) => {
      faq_attributes_array.push(
        this.fb.group({
          'id': [faq.id],
          'question': [faq.question, Validators.required],
          'answer': [faq.answer, Validators.required],
          '_destroy': [false]
        })
      );
    });

    return this.fb.group({
      'id': [project.id],
      'type': ['faq'],
      'faqs_attributes': this.fb.array(faq_attributes_array)
    });
  }

}
