export interface IDiary {
  readonly _id: string;
  readonly userId: string;
  diary: string;
  feeling: string;
  sentiment: object;
  diaryDate: string; // "2022-6-10"
  imageFileName?: string;
  imageFilePath?: string;
}
