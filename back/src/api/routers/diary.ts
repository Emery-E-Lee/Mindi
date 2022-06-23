import { Router, Request, Response, NextFunction } from "express";
import DiaryService from "../../services/diary";
import { BaseDiary, IDiary } from "../../interfaces/IDiary";
import validationErrorChecker from "../middlewares/validationErrorChecker";
import { diaryValidator } from "../middlewares/express-validator";
import { Container } from "typedi";
import imageUpload from "../middlewares/imageHandler";
import imageDelete from "../../utils/imageDelete";
import { loginRequired } from "../middlewares/loginRequired";
import { matchedData, validationResult } from "express-validator";
import { IResponse } from "../../interfaces/IResponse";
import { StatusError } from "../../utils/error";
import axios from "axios";
import config from "../../config";

export default (app: Router) => {
  const diaryRouter = Router();
  const diaryService = Container.get(DiaryService);
  const postAnalysis = async (feeling: object) => {
    const apiUrl = `${config.aiURL}/diaries/sentiment`;
    const { data } = await axios.post(apiUrl, feeling);
    return data.result;
  };

  app.use("/diaries", diaryRouter);

  diaryRouter.post(
    "/",
    loginRequired,
    imageUpload.single("background"),
    diaryValidator.diaryBody,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.user!._id;
        const imgInfo = Object(req.file);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          await imageDelete(imgInfo.key);
          throw new StatusError(400, errors.array()[0].msg);
        }

        const { diary, feeling, diaryDate } = matchedData(req);
        const aiResult = await postAnalysis({ feeling });

        let newDiary: BaseDiary = {
          userId,
          diary,
          feeling,
          sentiment: aiResult,
          diaryDate,
        };

        newDiary = imgInfo
          ? {
              ...newDiary,
              imageFileName: imgInfo.key,
              imageFilePath: imgInfo.location,
            }
          : newDiary;

        const createdDiary: IDiary = await diaryService.create(newDiary);

        const response: IResponse<IDiary> = {
          success: true,
          result: createdDiary,
        };

        res.status(201).json(response);
      } catch (error) {
        next(error);
      }
    },
  );

  diaryRouter.put(
    "/",
    loginRequired,
    imageUpload.single("background"),
    diaryValidator.diaryBody,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.user!._id;
        const imgInfo = Object(req.file);

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          await imageDelete(imgInfo.key);
          throw new StatusError(400, errors.array()[0].msg);
        }

        const { _id, diary, feeling, diaryDate, imageFileName } = req.body;
        const id: string = _id;
        const aiResult = await postAnalysis({ diary });
        let toUpdate: BaseDiary = {
          userId,
          diary,
          feeling,
          sentiment: aiResult,
          imageFileName,
          diaryDate,
        };

        toUpdate = imgInfo
          ? {
              ...toUpdate,
              imageFileName: imgInfo.key,
              imageFilePath: imgInfo.location,
            }
          : toUpdate;

        const updatedDiary = await diaryService.updateOne(id, toUpdate, imageFileName);

        const response: IResponse<IDiary> = {
          success: true,
          result: updatedDiary,
        };

        res.status(200).json(response);
      } catch (error) {
        next(error);
      }
    },
  );

  diaryRouter.delete("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.body._id;
      const imageFileName = req.body.imageFileName;
      await diaryService.deleteOne(id, imageFileName);

      const response: IResponse<string> = {
        success: true,
        result: "성공적으로 삭제되었습니다.",
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  });

  diaryRouter.get(
    "/",
    loginRequired,
    diaryValidator.getYear,
    validationErrorChecker,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const userId = req.user!._id;
        const { year, month, day } = req.query;

        let date: string;
        if (day == "00" && month == "00") {
          date = `${year}`;
        } else if (day == "00") {
          date = `${year}-${month}`;
        } else {
          date = `${year}-${month}-${day}`;
        }

        const diaries: IDiary[] = await diaryService.findByDate(userId, date);

        const response: IResponse<IDiary[]> = {
          success: true,
          result: diaries,
        };

        res.status(200).json(response);
      } catch (error) {
        next(error);
      }
    },
  );

  diaryRouter.get("/diaries/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;

      const diary: IDiary = await diaryService.findById(id);

      const response: IResponse<IDiary> = {
        success: true,
        result: diary,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  });
};
