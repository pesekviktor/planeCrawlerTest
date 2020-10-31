import { crawler } from "./crawler";
import { getHasMine } from "./hasMine";

describe("Test has mine", () => {
	it("should give correct result", () => {
		expect(getHasMine(23)(55, 55)).toBe(false);
		expect(getHasMine(23)(55, 553)).toBe(false);
		expect(getHasMine(23)(55, 554)).toBe(true);
	});
});
