import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Instructor } from '../../Models/Instructor';
import { Counselor } from '../../Models/Counselor';

@Component({
  selector: 'app-instructor-counselor-preview',
  templateUrl: './instructor-counselor-preview.component.html',
  styleUrl: './instructor-counselor-preview.component.css'
})
export class InstructorCounselorPreviewComponent {

  @Input() title!: string
  @Input() team!: Instructor[]

  @Output() teamAction = new EventEmitter<string>()

  onTeamClick(id: string | undefined) {
    this.teamAction.emit(id)
  }

  getDescriptionParagraphs(description: string): string[] {
    return description.split('. ').map(p => p.trim()).filter(p => p.length > 0);
  }
  
  
  

}
