enum Direction {
	UP = "UP",
	RIGHT = "RIGHT",
	LEFT = "LEFT",
	DOWN = "DOWN",
}

export interface HistoryItem {
	xStart: number;
	yStart: number;
	xEnd: number;
	yEnd: number;
	direction: Direction;
	traceX: number;
	traceY: number;
}

class History {
	_store: HistoryItem[] = [];
	lastTracedIndex = 0;

	push(val: HistoryItem) {
		this._store.push(val);
	}

	getLast(): HistoryItem | undefined {
		return this._store[this._store.length - 1];
	}

	getStore() {
		return this._store;
	}

	getFirstUntraced() {
		return this.getStore()[this.lastTracedIndex];
	}

	nextUntraced() {
		this.lastTracedIndex++;
	}
}

export const getCrawler = (
	hasMineFunction: (x: number, y: number) => boolean
) => (fieldAddListener?: (field: Partial<HistoryItem>) => any): number => {
	let x = 0,
		y = 0,
		sumOfFields = 0;
	let borderFields = 0;
	const history = new History();
	let traceBackDirection;

	const pushNewMoveToStack = (historyItem: Partial<HistoryItem>) => {
		fieldAddListener && fieldAddListener(historyItem);
		sumOfFields++;
		const lastMove = history.getLast();
		if (
			!lastMove ||
			lastMove.direction !== historyItem.direction ||
			traceBackDirection
		) {
			historyItem.traceX = historyItem.xStart;
			historyItem.traceY = historyItem.yStart;
			history.push(historyItem as HistoryItem);
		} else {
			lastMove.yEnd = historyItem.yEnd;
			lastMove.xEnd = historyItem.xEnd;
		}
		traceBackDirection = undefined;
		if (historyItem.xEnd === 0 || historyItem.yEnd === 0) {
			borderFields++;
		}
	};

	const historyBlock = (x, y): boolean => {
		return history.getStore().some((item) => {
			if (
				item.direction === Direction.UP &&
				item.yStart <= y &&
				item.yEnd >= y &&
				x === item.xStart
			) {
				return true;
			}

			if (
				item.direction === Direction.DOWN &&
				item.yStart >= y &&
				item.yEnd <= y &&
				x === item.xStart
			) {
				return true;
			}
			if (
				item.direction === Direction.RIGHT &&
				item.xStart <= x &&
				item.xEnd >= x &&
				y === item.yStart
			) {
				return true;
			}
			if (
				item.direction === Direction.LEFT &&
				item.xStart >= x &&
				item.xEnd <= x &&
				y === item.yStart
			) {
				return true;
			}
			return false;
		});
	};

	const isBlocked = (x, y) => {
		const blockedByConstraint = x < 0 || y < 0 || hasMineFunction(x, y);
		return blockedByConstraint || historyBlock(x, y);
	};

	pushNewMoveToStack({
		xEnd: 0,
		xStart: 0,
		yStart: 0,
		yEnd: 0,
		direction: Direction.UP,
	});

	while (true) {
		//DOWN
		if (!isBlocked(x, y - 1)) {
			pushNewMoveToStack({
				xEnd: x,
				xStart: x,
				yStart: y - 1,
				yEnd: y - 1,
				direction: Direction.DOWN,
			});
			y = y - 1;
			continue;
		}
		//LEFT
		if (!isBlocked(x - 1, y)) {
			pushNewMoveToStack({
				xEnd: x - 1,
				xStart: x - 1,
				yStart: y,
				yEnd: y,
				direction: Direction.LEFT,
			});
			x = x - 1;
			continue;
		}
		//UP
		if (!isBlocked(x, y + 1)) {
			pushNewMoveToStack({
				xEnd: x,
				xStart: x,
				yStart: y + 1,
				yEnd: y + 1,
				direction: Direction.UP,
			});
			y = y + 1;
			continue;
		}
		//RIGHT
		if (!isBlocked(x + 1, y)) {
			pushNewMoveToStack({
				xEnd: x + 1,
				xStart: x + 1,
				yStart: y,
				yEnd: y,
				direction: Direction.RIGHT,
			});
			x = x + 1;
			continue;
		}
		//Tracing back
		if (history.getFirstUntraced()) {
			const last = history.getFirstUntraced();
			traceBackDirection = last.direction;
			switch (traceBackDirection) {
				case Direction.DOWN:
					y = last.traceY;
					x = last.xStart;
					last.traceY--;
					if (last.traceY < last.yEnd) {
						history.nextUntraced();
					}
					continue;
				case Direction.LEFT:
					x = last.traceX;
					y = last.yStart;
					last.traceX--;
					if (last.traceX < last.xEnd) {
						history.nextUntraced();
					}
					continue;
				case Direction.UP:
					y = last.traceY;
					x = last.xStart;
					last.traceY++;
					if (last.traceY > last.yEnd) {
						history.nextUntraced();
					}
					continue;
				case Direction.RIGHT:
					x = last.traceX;
					y = last.yStart;
					last.traceX++;
					if (last.traceX > last.xEnd) {
						history.nextUntraced();
					}
					continue;
			}
		}
		break;
	}

	let result = sumOfFields * 4;

	//Subtract for border points where x or y = 0
	result = result - 2 * borderFields;
	//Subtract one extra for 0:0 point, which is in all planes
	result = result - 1;
	return result;
};
