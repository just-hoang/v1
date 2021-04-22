var rawContentTest = "This is just a <b>test</b> for a raw content, <br> và nó có một <u>chút xíu</u> tiếng Việt.";

var rawContent;
var renderContent;

$(document).ready(function() {
	loadRawContent();
	raw2render();

	$("#btn_render").on("click",
		function(event) {
			raw2render();
		});
		
	$("#btn_raw").on("click",
		function(event) {
			render2raw();
		});
});

function loadRawContent() {
	var myRawTextArea = document.getElementById("textarea_raw");
	myRawTextArea.value = rawContentTest;
}

function raw2render() {
	var myRawText = document.getElementById("textarea_raw").value;
	var $myRenderedTextArea = $("#div_rendered");
	$myRenderedTextArea.empty();
	var newRenderedText = render(myRawText);
	$myRenderedTextArea.append(newRenderedText);
}

function render2raw() {
	var $myRenderedTextArea = $("#div_rendered");
	var myRawTextArea = document.getElementById("textarea_raw");
	var myRenderedTextHTML = $myRenderedTextArea[0].innerHTML;
	var newRawText = raw(myRenderedTextHTML);
	myRawTextArea.value = newRawText;
}

function render(rawText) {
	// This should be the parseFunction from your markup language to HTML.
	var rawTextHTML = toHTML(rawText);
	return $.parseHTML(rawTextHTML);
}

function toHTML(rawText) {
	// For now, the rawText IS written in HTML.
	return rawText;
}

function fromHTML(renderTextHTML) {
	// For now, your language is also HTML.
	return renderTextHTML;
}

function raw(renderTextHTML) {
	// This should be the parseFunction from your HTML language to your language.
	var rawText = fromHTML(renderTextHTML);
	return rawText;
}