import { isFail, type Result } from '@joyautomation/dark-matter';

export const failOrTest = (result: Result<unknown>, test: (value: unknown) => void) => {
	if (isFail(result)) {
		throw result.error;
	}
	test(result.output);
};
