import { getHasMine } from "./hasMine";
import { crawler, HistoryItem } from "./crawler";

const hasMine = getHasMine(23);

const fieldsAdded = new Set();

const checkNoSameFieldAdded = (field: Partial<HistoryItem>) => {
	const point = `${field.xEnd} ${field.yEnd}`;
	if (fieldsAdded.has(point)) {
		fail(`Already has a point ${field.xEnd} ${field.yEnd}`);
	}
	fieldsAdded.add(point);
};

describe("Crawler test", () => {
	it("should count correctly", () => {
		expect(crawler(1)).toBe(3 * 4);
		expect(crawler(3)).toBe(10 * 4);
		expect(crawler(9, checkNoSameFieldAdded)).toBe(580);
		fieldsAdded.clear();
		expect(crawler(23, checkNoSameFieldAdded)).toBe(487272);
	});
});
