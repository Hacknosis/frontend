export class ReportAnalysisResult {
  entities: ResultEntity[] = [];

  constructor(entities: ResultEntity[] = []) {
    this.entities = entities;
  }
}

export class ResultEntity {
  text: string = '';
  attributes: ResultAttribute[] = [];
  traits: Traits[] = [];

  constructor(text: string = '', attributes: ResultAttribute[] = [], traits: Traits[] = []) {
    this.text = text;
    this.attributes = attributes;
    this.traits = traits;
  }
}

export class ResultAttribute {
  type: string = '';
  text: string = '';

  constructor(type: string = '', text: string = '') {
    this.type = type;
    this.text = text;
  }
}

export enum Traits {
  PAST_HISTORY= "PAST_HISTORY",
  NEGATION = "NEGATION",
  DIAGNOSIS = "DIAGNOSIS",
  SIGN = "SIGN",
  SYMPTOM = "SYMPTOM",
}
