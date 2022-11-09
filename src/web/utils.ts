import type { RequestHandler } from 'express';
import { AppResult, AppResultError } from '@carbonteq/hexapp/app';

export type AppResultErrorTransformer = (err: AppResultError) => any;

const getDataFromAppResult = (
	data: any,
	errTransformer: AppResultErrorTransformer,
) => {
	if (data instanceof AppResult) {
		if (!data.isOk) {
			return errTransformer(data.unwrapErr());
		}

		return data.unwrap();
	} else {
		return data;
	}
};

export const AppTransformerExpressMiddleware =
	(errTransformer: AppResultErrorTransformer): RequestHandler =>
	(_req, resp, next) => {
		const oldSend = resp.send;

		resp.send = (data) => {
			if (data?.then !== undefined) {
				// Is Async
				return data
					.then((d: any) => {
						const finalData = getDataFromAppResult(d, errTransformer);

						resp.send = oldSend;

						return oldSend.call(resp, finalData);
					})
					.catch((err: unknown) => {
						resp.send = oldSend;
						next(err);
					});
			} else {
				try {
					const finalData = getDataFromAppResult(data, errTransformer);

					resp.send = oldSend;

					return oldSend.call(resp, finalData);
				} catch (err) {
					resp.send = oldSend;
					next(err);
				}
			}
		};

		next();
	};
