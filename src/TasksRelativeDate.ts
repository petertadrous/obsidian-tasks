import type { Moment } from 'moment';
import type { Task } from './Task';

export class TasksRelativeDate {
    private readonly _dateType: string;
    private static readonly milliSecondsPerDay = 1000 * 60 * 60 * 24;

    public constructor(dateType: string) {
        this._dateType = dateType;
    }

    public calculate(task: Task): string {
        let _date: Moment | null;
        let pastType: string;
        let futureType: string;
        switch (this._dateType) {
            case 'created':
                _date = task.createdDate;
                pastType = 'created';
                futureType = 'create';
                break;
            case 'start':
                _date = task.startDate;
                pastType = 'started';
                futureType = 'start';
                break;
            case 'scheduled':
                _date = task.scheduledDate;
                pastType = 'scheduled for';
                futureType = 'scheduled to do';
                break;
            case 'due':
                _date = task.dueDate;
                pastType = 'overdue';
                futureType = 'due';
                break;
            case 'done':
                _date = task.doneDate;
                pastType = 'done';
                futureType = 'done';
                break;
            default:
                _date = null;
                pastType = '';
                futureType = '';
        }
        if (_date === null) {
            return '';
        }

        let relativeDate: string;
        let relativeType: string;
        const startOfToday = window.moment().startOf('day');
        const daysOverdue = Math.round(startOfToday.diff(_date) / TasksRelativeDate.milliSecondsPerDay);
        switch (daysOverdue) {
            case 0:
                relativeDate = 'today';
                relativeType = futureType;
                break;
            case 1:
                relativeDate = 'yesterday';
                relativeType = pastType;
                break;
            case -1:
                relativeDate = 'tomorrow';
                relativeType = futureType;
                break;
            default:
                if (daysOverdue > 1) {
                    relativeDate = `${daysOverdue} days ago`;
                    relativeType = pastType;
                } else {
                    relativeDate = `in ${Math.abs(daysOverdue)} days`;
                    relativeType = futureType;
                }
        }
        return `(${relativeType} ${relativeDate})`;
    }
}
