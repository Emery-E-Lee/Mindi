import { IDiary } from "../interfaces";
import { StatusError, imageDelete } from "../utils";
import { Service, Inject } from "typedi";
import { MongoDiaryModel } from "../models";
import winston from "winston";

@Service()
export default class DiaryService {
  constructor(
    private diaryModel: MongoDiaryModel,
    @Inject("logger") private logger: winston.Logger,
  ) {}

  public async create(newDiary: Partial<IDiary>) {
    const doc = await this.diaryModel.exists({ diaryDate: newDiary.diaryDate });
    if (doc) {
      throw new StatusError(400, "해당 날짜의 일기가 이미 존재합니다.");
    }

    try {
      const createdNewDoc = await this.diaryModel.create(newDiary);
      return createdNewDoc;
    } catch (error) {
      if (newDiary.imageFileName) {
        await imageDelete(newDiary.imageFileName);
      }
      throw new StatusError(400, "업로드에 실패했습니다.");
    }
  }

  public async updateOne(id: string, toUpdate: Partial<IDiary>, imageFileName?: string) {
    try {
      const filter = { _id: id };
      const updatedDoc = await this.diaryModel.updateOne(filter, toUpdate);
      if (imageFileName && imageFileName !== toUpdate.imageFileName) {
        await imageDelete(imageFileName); // 기존 이미지 삭제
      }
      return updatedDoc;
    } catch (error) {
      if (toUpdate.imageFileName && imageFileName !== toUpdate.imageFileName) {
        await imageDelete(toUpdate.imageFileName); // 새로 업로드했던 이미지 삭제
      }
      throw new StatusError(400, "업데이트에 실패했습니다.");
    }
  }

  public async deleteOne(id: string, imageFileName?: string) {
    try {
      if (imageFileName) {
        await imageDelete(imageFileName);
      }
      await this.diaryModel.deleteOne(id);
    } catch (error) {
      throw new StatusError(400, "삭제에 실패했습니다.");
    }
  }

  public async findByDate(userId: string, date: string) {
    const docList = await this.diaryModel.findByDate(userId, date);
    return docList;
  }

  public async findById(id: string) {
    const docInfo = await this.diaryModel.findById(id);
    if (!docInfo) {
      throw new StatusError(400, "일기가 존재하지 않습니다.");
    }

    return docInfo;
  }
}
