import {getHasMine} from "./hasMine";


enum Direction {UP = "UP", RIGHT = "RIGHT", LEFT = "LEFT", DOWN = "DOWN"};

export interface HistoryItem {
    xStart: number,
    yStart: number,
    xEnd: number,
    yEnd: number,
    direction: Direction,
    traceX: number;
    traceY: number;
};

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

    findLast(direction: Direction) {
        for (let i = this._store.length - 1; i >= 0; i--) {
            if (this._store[i].direction === direction) {
                return this._store[i];
            }
        }
    }


    getFirstUntraced() {
        return this.getStore()[this.lastTracedIndex];
    }

    removeFirst() {
        this._store.shift();
    }

    nextUntraced() {
        this.lastTracedIndex++;
    }
}

export const crawler = (maxSum: number, fieldAddListener?: (field: Partial<HistoryItem>) => any): number => {
    const hasMine = getHasMine(maxSum);

    let x = 0, y = 0, sumOfFields = 0;
    const history = new History();
    let traceBackDirection;

    const pushNewMoveToStack = (historyItem: Partial<HistoryItem>) => {
        fieldAddListener && fieldAddListener(historyItem);
        sumOfFields++;
        const lastMove = history.getLast();
        if (!lastMove || lastMove.direction !== historyItem.direction || traceBackDirection) {
            historyItem.traceX = historyItem.xStart;
            historyItem.traceY = historyItem.yStart;
            history.push(historyItem as HistoryItem)
        } else {
            lastMove.yEnd = historyItem.yEnd;
            lastMove.xEnd = historyItem.xEnd;
        }
        traceBackDirection = undefined;
    };

    const blocked = (x, y): boolean => {
        return history.getStore().some((item) => {
            if (item.direction === Direction.UP && item.yStart <= y && item.yEnd >= y && x === item.xStart) {
                return true;
            }

            if (item.direction === Direction.DOWN && item.yStart >= y && item.yEnd <= y && x === item.xStart) {
                return true;
            }
            if (item.direction === Direction.RIGHT && item.xStart <= x && item.xEnd >= x && y === item.yStart) {
                return true;
            }
            if (item.direction === Direction.LEFT && item.xStart >= x && item.xEnd <= x && y === item.yStart) {
                return true;
            }
            return false;
        })
    }

    const historyBlock = (x, y, moveDirection: Direction) => {
        switch (moveDirection) {
            case Direction.DOWN:
                return history.getLast() && history.getLast().direction === Direction.UP || blocked(x, y);
            case Direction.LEFT:
                return history.getLast() && history.getLast().direction === Direction.RIGHT || blocked(x, y);
            case Direction.UP:
                return history.getLast() && history.getLast().direction === Direction.DOWN || blocked(x, y);
            case Direction.RIGHT:
                return history.getLast() && history.getLast().direction === Direction.LEFT || blocked(x, y);
        }

    }

    const isBlocked = (x, y, moveDirection: Direction) => {
        const blockedByContraints = x < 0 || y < 0 || hasMine(x, y);
        return blockedByContraints || historyBlock(x, y, moveDirection);
    }

    pushNewMoveToStack({
        xEnd: 0,
        xStart: 0,
        yStart: 0,
        yEnd: 0,
        direction: Direction.UP
    });

    while (true) {
        //DOWN
        if (!isBlocked(x, y - 1, Direction.DOWN)) {
            pushNewMoveToStack({
                xEnd: x,
                xStart: x,
                yStart: y - 1,
                yEnd: y - 1,
                direction: Direction.DOWN
            });
            y = y - 1;
            continue;
        }
        //LEFT
        if (!isBlocked(x - 1, y, Direction.LEFT)) {
            pushNewMoveToStack({
                xEnd: x - 1,
                xStart: x - 1,
                yStart: y,
                yEnd: y,
                direction: Direction.LEFT
            });
            x = x - 1;
            continue;
        }
        //UP
        if (!isBlocked(x, y + 1, Direction.UP)) {
            pushNewMoveToStack({
                xEnd: x,
                xStart: x,
                yStart: y + 1,
                yEnd: y + 1,
                direction: Direction.UP
            });
            y = y + 1;
            continue;
        }
        //RIGHT
        if (!isBlocked(x + 1, y, Direction.RIGHT)) {
            pushNewMoveToStack({
                xEnd: x + 1,
                xStart: x + 1,
                yStart: y,
                yEnd: y,
                direction: Direction.RIGHT
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
                    y = last.yStart
                    last.traceX++;
                    if (last.traceX > last.xEnd) {
                        history.nextUntraced();
                    }
                    continue;
            }
        }
        break;
    }

    return sumOfFields * 4;
}

