$(document).ready(function () {
    'use strict';

    var MAX_BOXES = 15;

    var Observable = Rx.Observable;






    main(20);


    function main(boxSide) {
        var containerNode = $('.container'),
            containerOffset = containerNode.offset(),
            containerWidth = containerNode.width(),
            containerHeight = containerNode.height();

        function onlyInnerMousemoves(evt) {
            return (evt.offsetX >= 0 && evt.offsetX < containerWidth) &&
                (evt.offsetY >= 0 && evt.offsetY < containerHeight);
        }

        // Observables
        var mousemoves = Observable.fromEvent(containerNode[0], 'mousemove'),
            insideRelativeMousemoves = mousemoves.
                map(function(evt) {
                    return {
                        x: evt.pageX - containerOffset.left,
                        y: evt.pageY - containerOffset.top
                    };
                }).
                // filtering out outside mousemoves (offset doesn't work, offset can be relative to inner element)
                filter(function(coord) {
                    return (coord.x >= boxSide/2 && coord.x < containerWidth - boxSide/2) &&
                        (coord.y >= boxSide/2 && coord.y < containerHeight - boxSide/2);
                }),
            newBoxes = insideRelativeMousemoves.
                map(function(coord) {
                    return {
                        x: coord.x - boxSide/2,
                        y: coord.y - boxSide/2
                    };
                }).
                map(function(coord) {
                    return getNewBoxNode(boxSide, 'red', coord.x, coord.y);
                }),
            removableBox = insideRelativeMousemoves.
                map(function() {
                    return containerNode.children();
                }).
                // not using filter since I don't know how to combine without zip :P
                map(function(boxes) {
                    return boxes.length > MAX_BOXES ? $(boxes[0]) : undefined;
                });

        newBoxes.
            zip(removableBox).
            subscribe(function(zipped) {
                var newBox = zipped[0],
                    removableBox = zipped[1];
                addBox(containerNode, newBox);

                if(removableBox) {
                    removableBox.remove();
                }
            });
    }

    function addBox(containerNode, boxNode) {
        containerNode.append(boxNode);
    }

    function getNewBoxNode(side, color, left, top) {
        var boxNode = $('<div class="box"></div>');
        boxNode.width(side);
        boxNode.height(side);
        boxNode.css('background-color', color);
        boxNode.css('top', top || '0px');
        boxNode.css('left', left || '0px');

        return boxNode;
    }

});