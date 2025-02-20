import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface QuestionnaireStatus {
  needsQuestionnaire: boolean;
  previousAnswers: any;
  recommendation: any;
}

export interface QuestionnaireAnswers {
  energyLevel: string;
  timeAvailable: string;
  focusArea: string;
}

@Injectable({
  providedIn: 'root',
})
export class QuestionnaireService {
  private apiUrl = `${environment.apiUrl}questionnaire`;

  constructor(private http: HttpClient) {}

  checkQuestionnaireStatus(userId: string): Observable<any> {
    return this.http.get<QuestionnaireStatus>(
      `${this.apiUrl}/check-questionnaire/${userId}`
    );
  }

  submitQuestionnaire(answers: any, userId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/submit-questionnaire`, {
      answers,
      userId,
    });
  }

  dailyCheck(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/daily-check`);
  }
}

// Updated daily-questionnaire.component.ts
// import { Component, OnInit } from '@angular/core';
// import { QuestionnaireService } from './services/questionnaire.service';

// @Component({
//   selector: 'app-daily-questionnaire',
//   // ... existing template
// })
// export class DailyQuestionnaireComponent implements OnInit {
//   // ... existing properties

//   constructor(private questionnaireService: QuestionnaireService) {}

//   ngOnInit() {
//     this.checkQuestionnaireStatus();
//   }

//   private checkQuestionnaireStatus(): void {
//     this.questionnaireService.checkQuestionnaireStatus().subscribe({
//       next: (status) => {
//         if (!status.needsQuestionnaire) {
//           this.isComplete = true;
//           this.answers = status.previousAnswers;
//           // Set recommendation from backend
//           if (status.recommendation) {
//             this.recommendations = {
//               [this.getAnswerKey()]: status.recommendation
//             };
//           }
//         }
//       },
//       error: (error) => {
//         console.error('Error checking questionnaire status:', error);
//         // Handle error (show notification, etc.)
//       }
//     });
//   }

//   selectAnswer(value: string): void {
//     this.answers[this.getAnswerKey()] = value;

//     if (this.currentStep < 3) {
//       this.currentStep++;
//     } else {
//       this.submitQuestionnaire();
//     }
//   }

//   private submitQuestionnaire(): void {
//     this.questionnaireService.submitQuestionnaire(this.answers).subscribe({
//       next: (response) => {
//         this.isComplete = true;
//         this.recommendations = {
//           [this.getAnswerKey()]: response.recommendation
//         };
//       },
//       error: (error) => {
//         console.error('Error submitting questionnaire:', error);
//         // Handle error (show notification, etc.)
//       }
//     });
//   }
// }
