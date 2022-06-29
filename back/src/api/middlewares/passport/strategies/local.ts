// import { Strategy } from "passport-local";
// import { IUserModel } from "../../../../interfaces/IUserModel";
// import bcrypt from "bcrypt";
//
// // request body의 email 필드와 password 필드를 각각 username과 password로 사용
// const customFields = {
//   usernameField: "email",
//   passwordField: "password"
// };
//
// export default (userModel: IUserModel) => {
//   return new Strategy(customFields, async (username: string, password: string, done) => {
//     try {
//       // db에 유저가 존재하는지 검사
//       const userExists = await userModel.exists({ email: username });
//
//       // 만약 존재하지 않는다면
//       if (!userExists) {
//         // 없다는 것을 전함
//         return done(null, false);
//       }
//
//       // 존재한다면 정보를 불러옴
//       const user = await userModel.findOne({ email: username });
//
//       // 비밀번호 일치 여부 확인
//       const correctPasswordHash = user!.password;
//
//       const isValid = await bcrypt.compare(
//         password,
//         correctPasswordHash!
//       );
//       // TODO 구조 개선 필요: 느낌표 줄이기
//
//       // 유효한 비밀번호라면
//       if (isValid) {
//         // 유저 정보를 전함
//         return done(null, user);
//       }
//       else {
//         return done(null, false);
//       }
//     } catch (error) {
//       return done(error);
//     }
//   });
// };