/**
 * 
 */
 
$(document).ready(function() {

	$("#books").typeahead({
		source: [],
		// how many items to show
		items: 8,
		// default template
		displayText: function(item) { return item.title },
		menu: '<ul class="typeahead dropdown-menu" role="listbox"></ul>',
		item: '<li><a class="dropdown-item" href="#" role="option"></a></li>',
		headerHtml: '<li class="dropdown-header"></li>',
		headerDivider: '<li class="divider" role="separator"></li>',
		itemContentSelector: 'a',
		// min length to trigger the suggestion list
		minLength: 1,
		// number of pixels the scrollable parent container scrolled down
		scrollHeight: 0,
		// auto selects the first item
		autoSelect: true,
		// callbacks
		afterSelect: function(item) {
			//var book = $(document.getElementById("books")).val();
			var book = item.book_id
			// clearing
			$('#code').val(null)
			$('#new_chapter_title').val(null)
			$("#chapters").val(null)
			$("#chapters").data('typeahead').source = [];
			$('#text').val(null)
			$('#text').attr("disabled", true)
			// updating code
			$('#code').val(item.code)
			// updating chapters
			updateChapters(book)
		},
		afterEmptySelect: function() {
			alert("Please, select an item")
		},
		// adds an item to the end of the list
		addItem: false,
		// delay between lookups
		delay: 0,

	});

	$("#chapters").typeahead({
		source: [],
		// how many items to show
		items: 8,
		// default template
		displayText: function(item) { return item.order + ". " + item.title },
		menu: '<ul class="typeahead dropdown-menu" role="listbox"></ul>',
		item: '<li><a class="dropdown-item" href="#" role="option"></a></li>',
		headerHtml: '<li class="dropdown-header"></li>',
		headerDivider: '<li class="divider" role="separator"></li>',
		itemContentSelector: 'a',
		// min length to trigger the suggestion list
		minLength: 1,
		// number of pixels the scrollable parent container scrolled down
		scrollHeight: 0,
		// auto selects the first item
		autoSelect: true,
		// callbacks
		afterSelect: function(item) {
			// clearing
			$('#new_chapter_title').val(null)
			// showing chapter's text
			var text = item.text
			$('#text').attr("disabled", false)
			$("#text").val(text)
			// Hoang: then render the raw text to the render editor.
			raw2render()
		},
		afterEmptySelect: function() {
			alert("Please, select an item")
		},
		// adds an item to the end of the list
		addItem: false,
		// delay between lookups
		delay: 0,

	});

	$("#change_position_chapter_bu").click(function(event) {
		event.preventDefault();
		let book_id = getSelectedBookId()
		if (typeof book_id !== 'undefined') {
		let current_chapter = getSelectedChapterId()
		let current_order = getOrder(current_chapter)
		let current_title = getTitle(current_chapter)
		let new_order = getSelectedOrder()
		if (typeof current_order !== 'undefined') {
			if (typeof new_order !== 'undefined') {
				//alert(current_Position + " " +  new_Position)
				if (new_order !== current_order){
				var chaptersArray = $("#chapters").data('typeahead').source

				if (current_order < new_order) {
					var new_position = chaptersArray[new_order - 1].position + 1
					chaptersArray = updatePositions(chaptersArray, new_position, new_order + 1, chaptersArray.length - 1)
					chaptersArray[current_order - 1].position = new_position

				} else if (current_order > new_order) {
					var new_position = chaptersArray[new_order - 1].position
					chaptersArray = updatePositions(chaptersArray, new_position, new_order, current_order - 1)
					chaptersArray[current_order - 1].position = new_position

				} else {
					//done = true
				}
				// order chapters based on their position
				chaptersArray.sort(comparePosition);
				// create array of chapters ordered by position
				var orderedChaptersArray = [];
				$.each(chaptersArray, function(i, chapter) {
					var chapterPlus =
					{
						"order": (i + 1), "position": chapter.position, "title": chapter.title,
						"text": chapter.text, "chapter_id": chapter.chapter_id
					}
					orderedChaptersArray.push(chapterPlus)
				})
				// save new positions
				// when saving the new position, add chapters's new order to the old position of the last chapter in the new order
				// the position in the last chapter of the new order will always be equal or greater than the largest position 
				// for any chapter in the book.
				var nextPosition = orderedChaptersArray[orderedChaptersArray.length - 1].position + 1

				$.each(orderedChaptersArray, function(i, item){
					$.ajax({
						type: 'PUT',
						contentType: "application/json",
						url: "rest/chapters/" + item.chapter_id + "/position",
						data: JSON.stringify({ "position": nextPosition + item.order }),
						success: function(data) {
							// update chapters list, select chapter, and display chapter's text
							updateChaptersAndSelect(book_id, current_title)
							//alert("Chapter successfully update")
						},
						error: function(jqXHR, textStatus, errorThrown) {
							alert("Error");
						}
					})
					
				})
				
				
				// update chapters positions-selectable
				$("#chapters_positions").empty()
				$.each(orderedChaptersArray, function(i, chapter) {
					var option = new Option(chapter.order, chapter.chapter_id);
					$("#chapters_positions").append($(option));
				})


				$("#chapters").data('typeahead').source = orderedChaptersArray
				$.each($("#chapters").data('typeahead').source, function(i, item) {
					if (item.chapter_id == current_chapter) {
						$("#chapters").val($("#chapters").data('typeahead').displayText(item))
						$("#text").val(item.text)
						return false
					}
				})
				
			
			    } else {
				alert("Nothing to change!")
			}
				
				


			} else {
				alert("Please select a new position for the current chapter")
			}
		} else {
			alert("Please select a  chapter")
		}
	} else {
			alert("Please select a book")
		}
	}
	
	)


	$("#save_chapter_bu").click(function(event) {
		event.preventDefault();
		let book_id = getSelectedBookId()
		if (typeof book_id !== 'undefined') {
			let chapter_id = getSelectedChapterId()
			if (typeof chapter_id !== 'undefined') {
				var text = $.trim($("#text").val())
				if (typeof text !== 'undefined' && text) {
					$.ajax({
						type: 'POST',
						contentType: "application/json",
						url: "rest/chapters/" + chapter_id,
						data: JSON.stringify({ "text": text }),
						success: function(data) {
							updateChapters(book_id)
							alert("Chapter successfully saved")
						},
						error: function(jqXHR, textStatus, errorThrown) {
							alert("Error");
						}
					})
				} else {
					alert("Please, type the chapter's text")
				}
			} else {
				alert("Please, select the chapter")
			}
		} else {
			alert("Please, select the chapter's book'")
		}
	})



	$("#new_book_bu").click(function(event) {
		event.preventDefault();
		var book_title = $.trim($("#new_book_title").val())
		var book_code = $.trim($("#new_book_code").val())
		if (typeof book_title !== 'undefined' && book_title && book_code !== 'undefined' && book_code) {

			$.ajax({
				type: 'PUT',
				contentType: "application/json",
				url: "rest/books/",
				data: JSON.stringify({ "title": book_title, "code": book_code }),
				success: function(data) {
					// clearing
					$('#new_book_title').val(null)
					$('#new_book_code').val(null)
					$('#chapters').val(null)
					$("#chapters").data('typeahead').source = [];
					$('#text').val(null)
					$('#text').attr("disabled", false)
					// updating books and select new book
					$('#books').val(book_title)
					$('#code').val(book_code)
					updateBooks()

					// message
					alert("Book successfully created")
				},
				error: function(jqXHR, textStatus, errorThrown) {
					alert("Error");
				}
			})
		} else {
			alert("Please, type first the book's title and code")
		}

	}
	)

	$("#delete_book_bu").click(function(event) {
		event.preventDefault();
		let book_id = getSelectedBookId()
		if (typeof book_id !== 'undefined') {

			$.ajax({
				type: 'POST',
				contentType: "application/json",
				url: "rest/books/" + book_id,
				success: function(data) {
					// clearing
					$('#books').val(null)
					$('#code').val(null)
					$('#books').data('typeahead').source = [];
					$('#new_book_title').val(null)
					$('#new_book_code').val(null)
					$('#chapters').val(null)
					$("#chapters").data('typeahead').source = [];
					$('#text').val(null)
					$('#text').attr("disabled", false)
					// message
					alert("Book successfully deleted")
					// update books
					getBooks()
				},
				error: function(jqXHR, textStatus, errorThrown) {
					alert("Error");
				}
			})
		} else {
			alert("Please, type first the  book's title")
		}

	}
	)


	$("#new_chapter_bu").click(function(event) {
		event.preventDefault();
		let book_id = getSelectedBookId()
		if (typeof book_id !== 'undefined') {
			var chapter_title = $.trim($("#new_chapter_title").val())
			if (typeof chapter_title !== 'undefined' && chapter_title) {
				$.ajax({
					type: 'PUT',
					contentType: "application/json",
					url: "rest/books/" + book_id,
					data: JSON.stringify({ "title": chapter_title }),
					success: function(data) {
						// clearing
						$('#new_chapter_title').val(null)
						$("#chapters").data('typeahead').source = [];
						$('#text').val(null)
						$('#text').attr("disabled", false)
						// update chapters list, select new chapter, and display chapter's text
						updateChaptersAndSelect(book_id, chapter_title)
						// message
						alert("Chapter successfully created")

					},
					error: function(jqXHR, textStatus, errorThrown) {
						alert("Error");
					}
				})
			} else {
				alert("Please, type first the new chapter's title'")
			}
		} else {
			alert("Please, select first the new chapter's book'")
		}

	})

	$("#delete_chapter_bu").click(function(event) {
		event.preventDefault();
		let book_id = getSelectedBookId()
		if (typeof book_id !== 'undefined') {
			let chapter_id = getSelectedChapterId()
			if (typeof chapter_id !== 'undefined') {
				$.ajax({
					type: 'DELETE',
					url: "rest/chapters/" + chapter_id,
					success: function(data) {
						// clearing
						//$('#books').val(null)
						//$('#code').val(null)
						//$('#books').data('typeahead').source = [];
						$('#new_chapter_title').val(null)
						$('#chapters').val(null)
						$("#chapters").data('typeahead').source = [];
						$('#text').val(null)
						$('#text').attr("disabled", false)
						// message
						alert("Chapter successfully deleted")
						// update chapters
						updateChapters(book_id)
					},
					error: function(jqXHR, textStatus, errorThrown) {
						alert("Error");
					}
				})
			} else {
				alert("Please, type first the chapters's title")
			}

		}
		else {
			alert("Please, type first the book's' title")
		}
	}

	)





	// hiding all pages
	$('.page').addClass("d-none");
	// clearing
	$('#books').val(null)
	$('#code').val(null)
	$('#new_book_title').val(null)
	$('#new_book_code').val(null)
	$('#chapters').val(null)
	$('#new_chapter_title').val(null)
	$('#text').val(null)
	$('#text').attr("disabled", true)
	// downloading books
	getBooks()
	// showing editor's page
	$('#insert_container_page').removeClass('d-none');
	

	// ===================================================
	$('#div_raw').attr("hidden", true);
	$('#div_render').attr("hidden", false);
	$('#button_raw').attr("hidden", true);
	$('#button_render').attr("hidden", false);
	// Hoang's new button method (temporary)
	$("#btn_render").on("click",
		function(event) {
			raw2render();
			$('#div_raw').attr("hidden", true);
			$('#div_render').attr("hidden", false);
			$('#button_raw').attr("hidden", true);
			$('#button_render').attr("hidden", false);
		});
		
	$("#btn_raw").on("click",
		function(event) {
			render2raw();
			$('#div_raw').attr("hidden", false);
			$('#div_render').attr("hidden", true);
			$('#button_raw').attr("hidden", false);
			$('#button_render').attr("hidden", true);
		});

	$("#btn_bold").on("click",
	function(event) {
		// Get the selection object from the screen
		var selection = window.getSelection();
		// Make sure something was selected
		if (!selection.rangeCount) {
			// If not, do nothing.
			return;
		}
		// if there is some selection
		// get the container of that selection
		var ancestorContainer = selection.getRangeAt(0).commonAncestorContainer;
		// then it detects whether the selection is in the left or right hand side.
		while (ancestorContainer.id != "div_render" && ancestorContainer.parentElement != null) {
			ancestorContainer = ancestorContainer.parentElement;
		}
		if (
			/* RIGHT HAND SIDE EDITOR */
			ancestorContainer.id == "div_render"
			) {
			boldenHTML(selection);
		} else {
			// For now, let's do nothing if the text selected is not on the RHS.
		}
		// if (
		// 	/* LEFT HAND SIDE EDITOR */
		// 	parentDiv.id == "div_raw"
		// 	) {
		// 	// boldenText(selection);
		// 	// At the moment, let us focus on the rendering side.
		// 	// This raw side is to be considered.
		// } else {
		// 	// Then the text must be selected from elsewhere, we don't care.
		// }
	});
	
	$('#div_render').on('keydown', function(e) {
	  if (e.which === 13) {
	    //insertHtmlAfterSelection('<br>');
	    //document.execCommand('insertHTML',null,'</br>');
	    document.execCommand('insertLineBreak');
	    e.preventDefault();
	  }
	});

})

function getBooks() {
	$.getJSON("rest/books", function(data) {
		var titlesArray = [];
		$.each(data, function(i, obj) {
			titlesArray.push(obj)
		})
		$("#books").data('typeahead').source = titlesArray;

	});

}
function updateChapters(book) {
	$.getJSON("rest/books/" + book + "/chapters", function(data) {
		var chaptersArray = [];
		$.each(data, function(i, obj) {
			chaptersArray.push(obj)
		})
		// order chapters based on their position
		chaptersArray.sort(comparePosition);
		// create array of chapters ordered by position
		var orderedChaptersArray = [];
		$.each(chaptersArray, function(i, chapter) {
			var chapterPlus =
			{
				"order": (i + 1), "position": chapter.position, "title": chapter.title,
				"text": chapter.text, "chapter_id": chapter.chapter_id
			}
			orderedChaptersArray.push(chapterPlus)
		})
		// update chapters typeahead
		$("#chapters").data('typeahead').source = orderedChaptersArray;

		// update chapters positions-selectable
		$("#chapters_positions").empty()
		$.each(orderedChaptersArray, function(i, chapter) {
			var option = new Option(chapter.order, chapter.chapter_id);
			$("#chapters_positions").append($(option));
		})
	});
}

function updateBooks() {
	$.getJSON("rest/books", function(data) {
		var titlesArray = [];
		$.each(data, function(i, obj) {
			titlesArray.push(obj)
		})
		$("#books").data('typeahead').source = titlesArray;
	});
}

function updateChaptersAndSelect(book, select) {
	$.getJSON("rest/books/" + book + "/chapters", function(data) {
		var chaptersArray = [];
		$.each(data, function(i, obj) {
			chaptersArray.push(obj)
		})
		// order chapters based on their position
		chaptersArray.sort(comparePosition);
		// create array of chapters ordered by position
		var orderedChaptersArray = [];
		$.each(chaptersArray, function(i, chapter) {
			var chapterPlus =
			{
				"order": (i + 1), "position": chapter.position, "title": chapter.title,
				"text": chapter.text, "chapter_id": chapter.chapter_id
			}
			orderedChaptersArray.push(chapterPlus)
		})
		// update chapters positions-selectable
		$("#chapters_positions").empty()
		$.each(orderedChaptersArray, function(i, chapter) {
			var option = new Option(chapter.order, chapter.chapter_id);
			$("#chapters_positions").append($(option));
		})


		$("#chapters").data('typeahead').source = orderedChaptersArray
		$.each($("#chapters").data('typeahead').source, function(i, item) {
			if (item.title == select) {
				$("#chapters").val($("#chapters").data('typeahead').displayText(item))
				$("#text").val(item.text)
				return false
			}
		})

	});
}



function getSelectedBookId() {
	var bookId
	let selectedBook = $("#books").val()
	$.each($("#books").data('typeahead').source, function(i, item) {
		if (item.title === selectedBook) {
			bookId = item.book_id;
			return false
		}
	})
	return bookId
}

function getSelectedChapterId() {
	var chapterId
	let selectedChapter = $("#chapters").val()
	$.each($("#chapters").data('typeahead').source, function(i, item) {
		//alert(item.order + ". " + item.title + " " + selectedChapter)
		if (item.order + ". " + item.title === selectedChapter) {
			chapterId = item.chapter_id
			return false
		}
	})
	return chapterId
}

function getPosition(id) {
	var position
	$.each($("#chapters").data('typeahead').source, function(i, item) {
		if (item.chapter_id === id) { // use == instead of ===, no need to check types
			position = item.position
			return false
		}
	})
	return position

}

function getOrder(id) {
	var order
	$.each($("#chapters").data('typeahead').source, function(i, item) {
		if (item.chapter_id === id) { // use == instead of ===, no need to check types
			order = item.order
			return false
		}
	})
	return order

}

function getTitle(id){
	var title
	$.each($("#chapters").data('typeahead').source, function(i, item) {
		if (item.chapter_id === id) { // use == instead of ===, no need to check types
			title = item.title
			return false
		}
	})
	return title
}

function getSelectedOrder() {
	var order
	let selectedOrder = $("#chapters_positions").val()

	$.each($("#chapters").data('typeahead').source, function(i, item) {
		//alert(item.chapter_id + " " + selectedPosition)
		if (item.chapter_id === parseInt(selectedOrder)) { // use == instead of ===, no need to check types
			order = item.order
			return false
		}
	})
	return order
}

function comparePosition(chapterA, chapterB) {

	const posChapterA = chapterA.position;
	const posChapterB = chapterB.position;

	let comparison = 0;
	if (posChapterA > posChapterB) {
		comparison = 1;
	} else if (posChapterA < posChapterB) {
		comparison = -1;
	}
	return comparison;
}


function updatePositions(chaptersArray, position, start, end) {
	//alert(position + " " + start + " " + end)
	var index = (start - 1)
	var previous_position = position
	var new_chaptersArray = chaptersArray
	while (index <= end) {
		var current_position = chaptersArray[index].position
		if (previous_position >= current_position) {
			chaptersArray[index].position = chaptersArray[index].position + 1
			previous_position = chaptersArray[index].position + 1
			index = index + 1
		} else {
			break
		}
	}
	return new_chaptersArray

}

function printChaptersArray(chaptersArray) {
	$.each(chaptersArray, function(i, item) {
		alert(item.chapter_id + " " + " " + item.order + " " + item.position)

	})
}

// HOANG's NEW FUNCTION!!

// render the your DSL text to HTML elements and display on the RHS.
function raw2render() {
	var myRawText = document.getElementById("text").value;
	tempHTMLText = render(myRawText);
	
	var $myRenderedTextArea = $("#div_render");
	$myRenderedTextArea.empty();
	$myRenderedTextArea.append(tempHTMLText);
}

// render the HTML elements to your DSL text and display on the LHS
function render2raw() {
	var $myRenderedTextArea = $("#div_render");
	// get the LHS textarea
	var myRawTextArea = document.getElementById("text");
	// get the inner HTML elements on the RHS
	var myRenderedTextHTML = $myRenderedTextArea[0].innerHTML;
	// transform the HTML text to your DSL text
	// Hoang: This needs to be changed!!
	var newRawText = raw(myRenderedTextHTML);
	// assign the DSL text to the LHS textarea
	myRawTextArea.value = newRawText;
}

// transform the text from your DSL to HTML elements
function render(rawText) {
	// transform DSL text into HTML text.
	var rawTextHTML = toHTML(rawText);
	// transform HTML text into HTML elements.
	return $.parseHTML(rawTextHTML);
}

// transform HTML text to DSL text
function fromHTML(renderTextHTML) {
	renderTextHTML = renderTextHTML.replaceAll(new RegExp('<b>', "g"), '<b>');
	renderTextHTML = renderTextHTML.replaceAll(new RegExp('<\\b>', "g"), '</b>');
	renderTextHTML = renderTextHTML.replaceAll(new RegExp('<br>', "g"), '\n');
	renderTextHTML = renderTextHTML.replaceAll(new RegExp('&nbsp;', "g"), ' ');
	return renderTextHTML;
}

// transform the DSL text into HTML text
function toHTML(rawText) {
	// Just for now, proper implementation later!!
	rawText = rawText.replaceAll(new RegExp('<b>', "g"), '<b>');
	rawText = rawText.replaceAll(new RegExp('</b>', "g"), '</b>');
	rawText = rawText.replaceAll(new RegExp('\\n', "g"), '<br>');
	rawText = rawText.replaceAll(new RegExp(' ', "g"), '&nbsp;');
	return rawText;
}

// transform your HTML elements to your DSL text
function raw(renderTextHTML) {
	// This should be the parseFunction from your HTML language to your language.
	var rawText = fromHTML(renderTextHTML);
	return rawText;
}

function boldenHTML(selection) {
	// Important node: The execCommand is no longer recommended.
	// See more: https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
	// But to implement its own logic is NOT simple!!
	// TBC.
	document.execCommand('bold');
}
