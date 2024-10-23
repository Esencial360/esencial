import { Component } from '@angular/core';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { AuthService } from '@auth0/auth0-angular';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../services/users.service';


interface Question {
  question: string;
  options: { value: string; label: string; }[];
}

interface Recommendation {
  title: string;
  duration: string;
  level: string;
  instructor: string;
}

@Component({
  selector: 'app-recommendation-classes',
  templateUrl: './recommendation-classes.component.html',
  styleUrl: './recommendation-classes.component.css'
})
export class RecommendationClassesComponent {

  private ngUnsubscribe = new Subject<void>();

  currentStep = 1;
  isComplete = false;

  questions: { [key: number]: Question } = {
    1: {
      question: "How's your energy level today?",
      options: [
        { value: 'low', label: 'Low - Need gentle practice' },
        { value: 'medium', label: 'Medium - Ready for balanced practice' },
        { value: 'high', label: 'High - Ready for challenge' }
      ]
    },
    2: {
      question: "How much time do you have for practice?",
      options: [
        { value: '15', label: '15 minutes' },
        { value: '30', label: '30 minutes' },
        { value: '60', label: '60 minutes' }
      ]
    },
    3: {
      question: "What would you like to focus on today?",
      options: [
        { value: 'flexibility', label: 'Flexibility' },
        { value: 'strength', label: 'Strength' },
        { value: 'relaxation', label: 'Relaxation' },
        { value: 'balance', label: 'Balance' }
      ]
    }
  };

  answers: { [key: string]: string } = {
    energyLevel: '',
    timeAvailable: '',
    focusArea: ''
  };

  userId!: string

  recommendations: { [key: string]: Recommendation } = {
    'low-15-flexibility': {
      title: 'Gentle Morning Stretch',
      duration: '15 minutes',
      level: 'Beginner',
      instructor: 'Sarah Wilson'
    },
    'medium-30-strength': {
      title: 'Power Vinyasa Flow',
      duration: '30 minutes',
      level: 'Intermediate',
      instructor: 'Mike Chen'
    },
    'high-60-balance': {
      title: 'Advanced Balance Flow',
      duration: '60 minutes',
      level: 'Advanced',
      instructor: 'Emma Rodriguez'
    }
  };

  constructor(private questionnaireService: QuestionnaireService, public authService: AuthService, private userService: UserService) {}

 ngOnInit() {
    this.authService.user$
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((user) => {
      if (user) {
        console.log('User:', user);
      }
      this.authService.user$.subscribe((user) => {
        if (user) {
       this.userService.getUser(user.email).subscribe({
          next: (response) => {
            console.log('User successful received', response);
            this.userId = response._id
            this.checkQuestionnaireStatus(this.userId)
          },
          error: (error) => {
            console.error('Error user retreival:', error);
            // Handle error (e.g., show an error message)
          },
        })
         

        }
      });
    });
    // this.checkQuestionnaireStatus();
  }

  private checkQuestionnaireStatus(userId: string): void {
    this.questionnaireService.checkQuestionnaireStatus(userId).subscribe({
      next: (status: any) => {
        if (!status.needsQuestionnaire) {
          this.isComplete = true;
          this.answers = status.previousAnswers;
          // Set recommendation from backend
          if (status.recommendation) {
            this.recommendations = {
              [this.getAnswerKey()]: status.recommendation
            };
          }
        }
      },
      error: (error: any) => {
        console.error('Error checking questionnaire status:', error);
        // Handle error (show notification, etc.)
      }
    });
  }

  selectAnswer(value: string): void {
    console.log(this.answers);
    
    this.answers[this.getAnswerKey()] = value;
    
    if (this.currentStep < 3) {
      this.currentStep++;
    } else {
      this.submitQuestionnaire();
    }
  }

  private submitQuestionnaire(): void {
    console.log(this.answers);
    
    this.questionnaireService.submitQuestionnaire(this.answers, this.userId).subscribe({
      next: (response: { recommendation: any; }) => {
        this.isComplete = true;
        this.recommendations = {
          [this.getAnswerKey()]: response.recommendation
        };
        console.log(this.recommendations);
        
      },
      error: (error: any) => {
        console.error('Error submitting questionnaire:', error);
        // Handle error (show notification, etc.)
      }
    });
  }

  get currentQuestion(): Question {
    return this.questions[this.currentStep];
  }

  get recommendation(): Recommendation {
    const key = `${this.answers['energyLevel']}-${this.answers['timeAvailable']}-${this.answers['focusArea']}`;
    return this.recommendations[key] || this.recommendations['medium-30-strength'];
  }

  getAnswerKey(): string {
    switch (this.currentStep) {
      case 1: return 'energyLevel';
      case 2: return 'timeAvailable';
      case 3: return 'focusArea';
      default: return '';
    }
  }

  // selectAnswer(value: string): void {
  //   this.answers[this.getAnswerKey()] = value;
    
  //   if (this.currentStep < 3) {
  //     this.currentStep++;
  //   } else {
  //     this.isComplete = true;
  //   }
  // }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  startPractice(): void {
    // Implement navigation to the recommended practice
    console.log('Starting practice:', this.recommendation);
  }

}
