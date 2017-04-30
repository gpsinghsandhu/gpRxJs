$(document).ready(function () {
    'use strict';

    var MAX_BOXES = 15;

    var containerNode = $('.container'),
        boxNode = getNewBoxNode(20, 'black');

    addBox(containerNode, boxNode);
    addBoxOnClick(containerNode, 30);
    addBoxOnMouseMove(containerNode, 25);

    function addBoxOnClick(containerNode, boxSide) {
        var containerOffset = containerNode.offset();

        containerNode.on('click', function(evt) {
            var posX = evt.pageX - (containerOffset.left + boxSide/2),
                posY = evt.pageY - (containerOffset.top + boxSide/2),
                boxNode = getNewBoxNode(boxSide, 'red', posX, posY);

            addBox(containerNode, boxNode);
        });
    }

    function addBoxOnMouseMove(containerNode, boxSide) {
        var containerOffset = containerNode.offset();

        containerNode.on('mousemove', function(evt) {
            var posX = evt.pageX - (containerOffset.left + boxSide/2),
                posY = evt.pageY - (containerOffset.top + boxSide/2),
                boxNode;

            if(posX < 0 || (posX > containerNode.width() - boxSide) ||
                (posY > containerNode.height() - boxSide)  || posY < 0) {
                return;
            }

            boxNode = getNewBoxNode(boxSide, 'red', posX, posY);

            addBox(containerNode, boxNode);

            var children = containerNode.children();

            if(children.length > MAX_BOXES) {
                $(children[0]).remove();
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