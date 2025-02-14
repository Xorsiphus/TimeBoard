import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { tuiMarkControlAsTouchedAndValidate } from '@taiga-ui/cdk';
import { TuiError, TuiHint, TuiButton } from '@taiga-ui/core';
import { TuiFieldErrorPipe, tuiValidationErrorsProvider } from '@taiga-ui/kit';
import { TuiTextareaModule, TuiTextfieldControllerModule } from '@taiga-ui/legacy';
import { DayPilot, DayPilotModule } from "@daypilot/daypilot-lite-angular";

import { ScheduleService } from '../../services/schedule.service';


export function maxLengthMessageFactory(context: { requiredLength: string }): string {
  return `Максимальная длина — ${context.requiredLength}`;
}

@Component({
  selector: 'schedule-component',
  templateUrl: './schedule.component.html',
  imports: [
    AsyncPipe,
    FormsModule,
    TuiError,
    TuiFieldErrorPipe,
    ReactiveFormsModule,
    TuiHint,
    TuiButton,
    TuiTextareaModule,
    TuiTextfieldControllerModule,
    DayPilotModule
  ],
  styleUrls: ['./schedule.component.less'],
  providers: [
    DatePipe,
    tuiValidationErrorsProvider({
      required: 'Обязательное поле',
      maxlength: maxLengthMessageFactory,
    }),
  ],
})
export class ScheduleComponent implements AfterViewInit {
  protected readonly maxLength = 1024;
  events: DayPilot.EventData[] = [];
  isLoading: boolean = false;

  config: DayPilot.CalendarConfig;

  constructor(private scheduleService: ScheduleService, private datePipe: DatePipe) {
    this.config = {
      headerDateFormat: 'dd-MM-yyyy',
      locale: 'ru',
      durationBarVisible: true,
      weekStarts: 1,
      cellHeight: 20,
      viewType: "Week",
      heightSpec: "Full",
      timeFormat: 'Clock24Hours',
      startDate: this.getMondayOfCurrentWeek(),
    };
  }

  generateSchedule() {
    let prompt = this.promtForm.value.promtFormName ?? '';
    if (!prompt.trim() || prompt.length > this.maxLength) return;
    this.isLoading = true;
    this.scheduleService.getSchedule(prompt)
      .subscribe({
        next: (data) => {
          this.events = [
            ...this.events,
            ...data.map((d: any) => ({
              ...d,
              start: new Date(new Date(d.start).getTime() - new Date().getTimezoneOffset() * 60000),
              end: new Date(new Date(d.end).getTime() - new Date().getTimezoneOffset() * 60000),
              text: d.text + ` (${this.datePipe.transform(d.start, 'HH:mm')}-${this.datePipe.transform(d.end, 'HH:mm')})`
            }))
          ];
        },
        error: (error) => {
          console.error('Ошибка загрузки расписания', error);
        },
        complete: () => { this.isLoading = false; }
      }
      );
  }

  protected readonly promtForm = new FormGroup({
    promtFormName: new FormControl('', [
      Validators.required,
      Validators.maxLength(this.maxLength),
    ]),
  });

  public ngAfterViewInit(): void {
    tuiMarkControlAsTouchedAndValidate(this.promtForm);
  }

  public getMondayOfCurrentWeek(): string {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const difference = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(today);
    monday.setDate(today.getDate() + difference);
    return this.datePipe.transform(monday, 'yyyy-MM-dd')!;
  }
}

