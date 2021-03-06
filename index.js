$(function () {
	
	$( ".toolbar-element" ).draggable({
		connectToSortable: ".my-row",
		cursor: 'move',
		// snap:'true',
		appendTo: 'body',
		opacity: 0.8,
		revert: "50",
		cursorAt: { left: 50, top: 10 },
		stop: function(event, ui) {
			var helper = ui.helper;
			console.log("Draggable stop event! All sortables Re-Enabled");
			$(".my-row").sortable("enable");
		},
		helper: function(event) {
			var blockWidth = $(this).data('blockWidth');
			return $('<div class="my-element col-sm-' + blockWidth + '">' + blockWidth + 'U</div>');
		}
	});

    $(".my-row").sortable({
        tolerance: 'pointer',
        revert: 50,
        helper:'clone',
        placeholder: 'my-element-placeholder-error',
        forceHelperSize: true,
        connectWith: ".my-row",
        appendTo: 'body',
        cursor: 'move',
        start: function(event, ui) {
            console.log("%c%s#%s.%s Event: start (sorting started)", "color: blue;", this.localName, this.id, this.className.replace(/ /g,"."));

            // Replace placeholder with an element of the same column width
			var item = ui.item[0];
			if($(item).hasClass('toolbar-element')) {
				// We are receiving a new element from the tool bar
				console.log("%c%s#%s.%s Event: start: We are dragging a tool bar element.", "color: DarkGoldenRod;", this.localName, this.id, this.className.replace(/ /g,"."));
				var blockWidth = $(item).data('blockWidth');
				ui.placeholder.removeAttr('class');
            	ui.placeholder.html('&nbsp;');
            	ui.placeholder.addClass('my-element my-element-placeholder col-xs-' + blockWidth);
			} else {
				console.log("%c%s#%s.%s Event: start: We are dragging an element from another row.", "color: DarkGoldenRod;", this.localName, this.id, this.className.replace(/ /g,"."));
				
				//We are receiving an element from another row
				var itemClassName = ui.item[0].className;
            	ui.placeholder.removeAttr('class');
            	ui.placeholder.html('&nbsp;');
            	ui.placeholder.addClass(itemClassName + ' my-element-placeholder');	
			}
			// Try to make the helper the same width as the placeholder
			ui.helper.width(ui.placeholder.width());
			ui.helper.height(ui.placeholder.height());
        },
        activate: function(event, ui) {
			console.log("%c%s#%s.%s Event: activate (every connected list on drag start receives it)", "color: blue;", this.localName, this.id, this.className.replace(/ /g,"."));
        },
        update: function(event, ui) {
			console.log("%c%s#%s.%s Event: sort (element added to sortable)", "color: blue;", this.localName, this.id, this.className.replace(/ /g,"."));

			var item = ui.item[0];
			if($(item).hasClass('toolbar-element')) {
				var blockWidth = $(item).data('blockWidth');
				ui.item.replaceWith('<div class="col-sm-' + blockWidth + ' my-element" data-block-width="' + blockWidth + '">' + blockWidth + 'U</div>');
			}
        },
        stop: function(event, ui) {
        	console.log("%c%s#%s.%s Event: stop (sorting stopped)", "color: blue;", this.localName, this.id, this.className.replace(/ /g,"."));
        	$(".my-row").sortable("enable");
        }
    });

	beforeSortableStart = function(event, ui) {
		console.log("%c%s#%s.%s Event: mouseDown", "color: green;", this.localName, this.id, this.className.replace(/ /g,"."));
		
		// if(this.parentElement.id != 'my-row-2') {
			
		var newElementBlockWidth = $(this).data('blockWidth');
		var rows = $(".my-row");

		for (var index=0;index<rows.length;index++) {
			var row = rows[index];
			if(row == this.parentElement) {
				// Don't disable the row we are currently on becuase we already know that we can fit the element 
				// we're about to try to move. We want to allow folks to reorder rows they are working with
				continue;
			}
			var elements = $(row).children();
			var spaceLeft = 12;
			for (var elIndex=0;elIndex<elements.length;elIndex++) {
				var el = elements[elIndex];
				var elBlockWidth = $(el).data('blockWidth');
				spaceLeft -= elBlockWidth;
			}
			if(spaceLeft < newElementBlockWidth) {
				$(row).sortable("disable");	
			}
		}	
	} 

	$('.toolbar-element').on('mousedown', beforeSortableStart);
	$('.my-element').on('mousedown', beforeSortableStart);

	$('.toolbar-element').on('mouseup', function(event, ui) {
		console.log("%c%s#%s.%s Event: mouseUp", "color: green;", this.localName, this.id, this.className.replace(/ /g,"."));

		//Re-enable all sortables
		$(".my-row").sortable("enable");
	});


	$('.my-element').on('mouseup', function(event, ui) {
		console.log("%c%s#%s.%s Event: mouseup", "color: green;", this.localName, this.id, this.className.replace(/ /g,"."));
		//Re-enable all sortables
		$(".my-row").sortable("enable");
	});
});