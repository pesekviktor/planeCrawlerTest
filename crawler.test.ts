import { getHasMine } from "./hasMine";
import { getCrawler, HistoryItem } from "./crawler";

const hasMine = getHasMine(23);

const fieldsAdded = new Set();

const checkNoSameFieldAdded = (field: Partial<HistoryItem>) => {
	const point = `${field.xEnd} ${field.yEnd}`;
	if (fieldsAdded.has(point)) {
		fail(`Already has a point ${field.xEnd} ${field.yEnd}`);
	}
	fieldsAdded.add(point);
};

const lessThanAndConstraint = (
	maxXOrY: number,
	constraint: (x, y) => boolean
) => (x, y) => {
	return x >= maxXOrY || y >= maxXOrY || constraint(x, y);
};

describe("Crawler test", () => {
	it("should count correctly", () => {
		// expect(getCrawler(getHasMine(1))()).toBe(5);
		expect(getCrawler(getHasMine(2))()).toBe(13);
		expect(getCrawler(getHasMine(9))(checkNoSameFieldAdded)).toBe(505);
		fieldsAdded.clear();
		expect(getCrawler(getHasMine(23))(checkNoSameFieldAdded)).toBe(592597);
	});

	it("should crawl correctly around obstacle", () => {
		// Note: this should be changed into parametrized test for production
		expect(
			getCrawler(lessThanAndConstraint(3, (x, y) => x === 0 && y === 1))()
		).toBe(23);
		expect(
			getCrawler(lessThanAndConstraint(3, (x, y) => x === 0 && y === 2))()
		).toBe(23);

		expect(
			getCrawler(lessThanAndConstraint(3, (x, y) => x === 1 && y === 0))()
		).toBe(23);

		expect(
			getCrawler(lessThanAndConstraint(3, (x, y) => x === 1 && y === 1))()
		).toBe(21);

		expect(
			getCrawler(lessThanAndConstraint(3, (x, y) => x === 1 && y === 2))()
		).toBe(21);

		expect(
			getCrawler(lessThanAndConstraint(3, (x, y) => x === 2 && y === 0))()
		).toBe(23);

		expect(
			getCrawler(lessThanAndConstraint(3, (x, y) => x === 2 && y === 1))()
		).toBe(21);

		expect(
			getCrawler(lessThanAndConstraint(3, (x, y) => x === 2 && y === 2))()
		).toBe(21);
	});
});
