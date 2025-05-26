import { NgClass } from '@angular/common'
import { Component, inject, Input, OnInit, output } from '@angular/core'
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap'
import { JsonSchemaFormModule } from '@ng-formworks/core'

import { JsonSchemaFormPatchDirective } from '@/app/core/directives/json-schema-form-patch.directive'
import { SettingsService } from '@/app/core/settings.service'

@Component({
  selector: 'app-schema-form',
  templateUrl: './schema-form.component.html',
  standalone: true,
  imports: [
    JsonSchemaFormModule,
    JsonSchemaFormPatchDirective,
    NgbAlert,
    NgClass,
  ],
})
export class SchemaFormComponent implements OnInit {
  private $settings = inject(SettingsService)

  @Input() configSchema: any
  @Input() data: any
  @Input() strictValidation: boolean = false
  readonly dataChange = output()
  readonly dataChanged = output()
  readonly isValid = output()

  public currentData: any
  public language: string = 'en'
  public validationErrorList: {
    instancePath: string
    keyword: string
    message: string
    params: any
    schemaPath: string
  }[] = []

  private availableLanguages = ['de', 'en', 'es', 'fr', 'it', 'pt', 'zh']

  public jsonFormOptions = {
    addSubmit: false,
    loadExternalAssets: false,
    returnEmptyFields: false,
    setSchemaDefaults: true,
    autocomplete: false,
  }

  constructor() {}

  ngOnInit(): void {
    // Use 'en' by default, unless the user's language is available
    const userLanguage = this.$settings.env.lang.split('-')[0]
    if (this.availableLanguages.includes(userLanguage)) {
      this.language = userLanguage
    }
    this.currentData = this.data
  }

  onChanges(data: any) {
    this.dataChange.emit(data)
    this.dataChanged.emit(data)
  }

  validChange(data: any) {
    this.isValid.emit(data)
  }

  validationErrors(errors: any[] | null) {
    this.validationErrorList = errors || []
  }
}
