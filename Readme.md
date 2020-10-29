#Kidloops test
See instructions

#Implementation

Since all the numbers for mine checking are absolute, it means
the graph will be same in all quadrants. Therefore we only need to
find solution in the 1st quadrant and multiply by 4.

The solution is based on the robot trying to move in a specified order
whilst keeping a history of moves in an array. If a dead end is reached,
the robot will start again from 0 or last traced position and attempt another move.
History is needed to avoid going around in circles.

There are optimizations available I did not do to save time:

-   I am now saving the history as a move from xstart: xEnd => ystart: yEnd
    for each move. It should be possible to keep only vertical/or horizontal moves joined to
    improve memory performance, or join the moves into squares.
-   It would be possible to remove history items that have been traced completely
    so they should never block the robot again.

In a real world project I would perform cleanup and add tests
