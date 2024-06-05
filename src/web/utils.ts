import type { RequestHandler } from "express";
import { type AppError, AppResult } from "../app";

export type AppResultErrorTransformer<E> = (err: AppError) => E;

// const getDataFromAppResult = <E>(
// 	data: unknown,
// 	errTransformer: AppResultErrorTransformer<E>,
// ) => {
// 	if (data instanceof AppResult) {
// 		if (!data._isOk) {
// 			return errTransformer(data.unwrapErr());
// 		}
//
// 		return data.unwrap();
// 	}
// 	return data;
// };

// export const AppTransformerExpressMiddleware =
// 	<E>(errTransformer: AppResultErrorTransformer<E>): RequestHandler =>
// 	(_req, resp, next) => {
// 		const oldSend = resp.send;
//
// 		resp.send = (data) => {
// 			if (data?.then !== undefined) {
// 				// Is Async
// 				return data
// 					.then((d: any) => {
// 						const finalData = getDataFromAppResult(d, errTransformer);
//
// 						resp.send = oldSend;
//
// 						return oldSend.call(resp, finalData);
// 					})
// 					.catch((err: unknown) => {
// 						resp.send = oldSend;
// 						next(err);
// 					});
// 			}
// 			try {
// 				const finalData = getDataFromAppResult(data, errTransformer);
//
// 				resp.send = oldSend;
//
// 				return oldSend.call(resp, finalData);
// 			} catch (err) {
// 				resp.send = oldSend;
// 				next(err);
// 			}
// 		};
//
// 		next();
// 	};
