#Robot test
Robot crawls on 2D plane only horizontal and vertical moves allowed. 
Can not step on the fields where sum of digits is higher or equal than 23.
Run `yarn install` and `yarn run` to run the program.

#Implementation

Since all the numbers for mine checking are absolute, it means
the graph will be same in all quadrants. Therefore we only need to
find solution in the 1st quadrant and multiply by 4 for non-border points
add border points twice, except 0:0, which needs to be added thrice.

The solution is based on the robot trying to move in a specified order
whilst keeping a history of moves in an array. If a dead end is reached,
the robot will start again from 0 or last traced position and attempt another move.
History is needed to avoid going around in circles.

There are optimizations available to improve the solution:

-   I am now saving the history as an array of all moves from xStart: yStart=> xStart: yEnd.
    This woudl be good for long 1-thick corridors. For this task and the way the graph looks
    (big areas) it would be better possible to keep only vertical/or horizontal moves joined to
    improve memory performance.
-   It would be possible to remove history items that have been traced completely
    so they should never block the robot again. This would lower the memory consumption
    as well as the speed - less history items to check.

Cleanup and tests for moves and crawler functions would be desirable for production code.
