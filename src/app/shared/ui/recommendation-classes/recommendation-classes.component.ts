import { Component, EventEmitter, Output } from '@angular/core';
import { QuestionnaireService } from '../../services/questionnaire.service';
import { AuthService } from '@auth0/auth0-angular';
import { catchError, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { UserService } from '../../services/users.service';
import { User } from '../../Models/User';

interface Question {
  question: string;
  options: { value: string; label: string }[];
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
  styleUrl: './recommendation-classes.component.css',
})
export class RecommendationClassesComponent {
  @Output()
  recommendationProcess = new EventEmitter<boolean>()

  @Output()
  private ngUnsubscribe = new Subject<void>();

  @Output() 
  isRecommendationDone = new EventEmitter<boolean>()

  currentStep = 1;
  isComplete!: boolean;

  questions: { [key: number]: Question } = {
    1: {
      question: "How's your energy level today?",
      options: [
        { value: 'low', label: 'Low - Need gentle practice' },
        { value: 'medium', label: 'Medium - Ready for balanced practice' },
        { value: 'high', label: 'High - Ready for challenge' },
      ],
    },
    2: {
      question: 'How much time do you have for practice?',
      options: [
        { value: '15', label: '15 minutes' },
        { value: '30', label: '30 minutes' },
        { value: '60', label: '60 minutes' },
      ],
    },
    3: {
      question: 'What would you like to focus on today?',
      options: [
        { value: 'flexibility', label: 'Flexibility' },
        { value: 'strength', label: 'Strength' },
        { value: 'relaxation', label: 'Relaxation' },
        { value: 'balance', label: 'Balance' },
      ],
    },
  };

  answers: { [key: string]: string } = {
    energyLevel: '',
    timeAvailable: '',
    focusArea: '',
  };

  error: string = '';
  startQuestionnaire!: boolean
  user!: User;

  recommendations: { [key: string]: Recommendation } = {
    'low-15-flexibility': {
      title: 'Gentle Morning Stretch',
      duration: '15 minutes',
      level: 'Beginner',
      instructor: 'Sarah Wilson',
    },
    'medium-30-strength': {
      title: 'Power Vinyasa Flow',
      duration: '30 minutes',
      level: 'Intermediate',
      instructor: 'Mike Chen',
    },
    'high-60-balance': {
      title: 'Advanced Balance Flow',
      duration: '60 minutes',
      level: 'Advanced',
      instructor: 'Emma Rodriguez',
    },
  };

  constructor(
    private questionnaireService: QuestionnaireService,
    public authService: AuthService,
    private userService: UserService
  ) {}

   ngOnInit() {
      this.authService.user$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((user) => {
        this.authService.user$.subscribe((user) => {
          if (user) {
         this.userService.getUser(user.email).subscribe({
            next: (response) => {
              this.user = response
              this.checkQuestionnaireStatus(this.user._id)
            },
            error: (error) => {
              console.error('Error user retreival:', error);
              // Handle error (e.g., show an error message)
            },
          })

          }
        });
      });
    }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  checkQuestionnaireStatus(userId: string) {
    return this.questionnaireService
      .checkQuestionnaireStatus(userId)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError((error) => {
          console.error('Error checking questionnaire status:', error);
          this.error =
            'Failed to check questionnaire status. Please try again later.';
          throw error;
        })
      )
      .subscribe((status: any) => {
        this.isComplete = !status.data.needsQuestionnaire
        this.isRecommendationDone.emit(this.isComplete)
        if (!status.needsQuestionnaire && status.previousAnswers) {
          this.answers = status.previousAnswers;
          if (status.recommendation) {
            this.recommendations = {
              [this.getAnswerKey()]: status.recommendation,
            };
            
          }
        }
      });
  }

  getAnswerKey(): string {
    const steps = ['energyLevel', 'timeAvailable', 'focusArea'];
    return steps[this.currentStep - 1];
  }

  selectAnswer(value: string): void {
    const currentKey = this.getAnswerKey();
    if (!currentKey) {
      console.error('Invalid step');
      return;
    }

    this.answers[currentKey] = value;

    if (this.currentStep < 3) {
      this.currentStep++;
    } else {
      this.submitQuestionnaire();
    }
  }

  submitQuestionnaire(): void {
    if (!this.validateAnswers()) {
      this.error = 'Please complete all questions before submitting.';
      return;
    }

    this.questionnaireService
      .submitQuestionnaire(this.answers, this.user._id)
      .pipe(
        takeUntil(this.ngUnsubscribe),
        catchError((error) => {
          console.error('Error submitting questionnaire:', error);
          this.error =
            'Failed to submit questionnaire. Please try again later.';
          throw error;
        })
      )
      .subscribe((response) => {
        this.isComplete = true;
        this.recommendations = {
          [this.getAnswerKey()]: response.recommendation,
        };
        
        
        this.error = '';
      });
  }

  private validateAnswers(): boolean {
    return Boolean(
      this.answers['energyLevel'] &&
        this.answers['timeAvailable'] &&
        this.answers['focusArea']
    );
  }

  get currentQuestion(): Question {
    return this.questions[this.currentStep];
  }

  get recommendation(): Recommendation {

    const key = `${this.answers['energyLevel']}-${this.answers['timeAvailable']}-${this.answers['focusArea']}`;
    return (
      this.recommendations[key] || this.recommendations['medium-30-strength']
    );
  }

  // getAnswerKey(): string {
  //   switch (this.currentStep) {
  //     case 1: return 'energyLevel';
  //     case 2: return 'timeAvailable';
  //     case 3: return 'focusArea';
  //     default: return '';
  //   }
  // }

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
    // console.log('Starting practice:', this.recommendation);
  }

  onQuestionnaireStart() {
    this.startQuestionnaire = true
  }

  onDashboardGo() {
    this.recommendationProcess.emit(false)
  }
}
