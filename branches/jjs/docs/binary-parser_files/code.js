function code(m){
	addEvent(document.forms.formVote, "submit", function(e){
		for(var c, f = this.rate, i = f.length; i-- && !f[i].checked;);
		return i > 0 || (alert(m), false);
	});
}