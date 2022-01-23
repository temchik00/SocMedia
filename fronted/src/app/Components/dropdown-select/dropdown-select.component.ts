import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SelectOption } from 'src/app/Interfaces/selectOption';

@Component({
  selector: 'app-dropdown-select',
  templateUrl: './dropdown-select.component.html',
  styleUrls: ['./dropdown-select.component.scss'],
})
export class DropdownSelectComponent implements OnInit {
  @Input() options: SelectOption[] = [];

  @Input() selectedOption: SelectOption | null = null;
  @Output() selectedOptionChange: EventEmitter<SelectOption | null> =
    new EventEmitter<SelectOption | null>();
  @Input() searchField: boolean = false;

  public isExpanded: Boolean = false;
  constructor() {}

  ngOnInit(): void {}

  public toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }

  public selectOption(option: SelectOption): void {
    this.selectedOption = option;
    this.selectedOptionChange.next(option);
    this.isExpanded = false;
  }
}
