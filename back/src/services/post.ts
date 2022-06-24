import { Service, Inject } from "typedi";
import { StatusError } from "../utils/error";
import { MongoPostModel } from "../models/post";
import { IPost } from "../interfaces/IPost";
import winston from "winston";

@Service()
export default class PostService {
  constructor(
    private postModel: MongoPostModel,
    @Inject("logger") private logger: winston.Logger
  ) {
  }
  public async makeNewPost(body: Partial<IPost>) {
    return this.postModel.create(body);
  }

  public async getPostsWithFilter(filter: Object | null, page: number, limit: number) {
    return this.postModel.findMany(filter, { page, limit });
  }

  public async getOnePostByPostId(postId: string) {
    const postExists = await this.postModel.exists({ _id: postId });

    if (!postExists) {
      throw new StatusError(
        400,
        "게시글이 존재하지 않습니다."
      );
    }

    return this.postModel.findOne({ _id: postId });
  }

  public async updatePostInfo(postId: string, fieldToUpdate: Object) {
    const postExists = await this.postModel.exists({ _id: postId });

    if (!postExists) {
      throw new StatusError(
        400,
        "게시글이 존재하지 않습니다."
      );
    }

    return this.postModel.update({ _id: postId }, fieldToUpdate);
  }

  public async deletePost(postId: string) {
    const postExists = await this.postModel.exists({ _id: postId });

    if (!postExists) {
      throw new StatusError(
        400,
        "게시글이 존재하지 않습니다."
      );
    }

    await this.postModel.delete(postId);
  }
}