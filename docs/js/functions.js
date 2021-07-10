/* specific functions */
function getPaths(){
	let svgDoc = G.svg.contentDocument;
  return svgDoc.querySelectorAll("path");
}

function unsolve() {
    let paths = getPaths();
    for(i = 1; i < paths.length; i++) {
        let p = paths[i];
				if(p.getAttribute('style_solve') == undefined){
					p.setAttribute('style_solve', p.getAttribute('style'));
				}
        p.setAttribute('style', G.cfg.style.unsolve);
    }
}

function solve() {
    let paths = getPaths();
    for (i = 1; i < paths.length; i++) {
        let p = paths[i];
        p.setAttribute('style', p.getAttribute('style_solve'));
    }
}

function is_solve() {
    let p = getPaths()[1];
    return p.getAttribute('style_solve') == p.getAttribute('style');
}

function load_figure(){
			let file = `${G.cfg.figures.path}${G.cfg.figures.list[G.n]}.svg`;
			change_background();
			let obj = `<object data="${file}" type="image/svg+xml" id="figure"></object>`;
			let img = $('#image');
			G.menu.val(G.n);

			img.css('opacity','0');
			img.html(obj);
			G.svg = document.getElementById("figure");
			G.svg.addEventListener("load", function () {
						img.css('opacity','1');
						unsolve(G.svg);
      }, false);
}

function menu_figures_list(){
		let options = [];
		for(let i in G.cfg.figures.list){
			options.push(`<option value="${i}">${G.cfg.figures.list[i].replace(/_/g, ' ').replace(/nn/g, 'ñ')}</option>`);
		}
		G.menu = $('#figures_list');
		G.menu.html(options.join(''));
		G.menu.on({
			change: function(ev){
				G.n = parseInt(G.menu.val());
				load_figure();
			}
		});

}

function change_figure(v){
	if(v > 0){
		G.n = (G.n + v) % G.l;
	}else{
		if(G.n + v < 0){
			G.n = G.l-1;
		}else{
			G.n = (G.n + v) % G.l;
		}
	}
}

function change_background(){
	if(G.body == undefined){ G.body = $('body'); }
	let col = _.shuffle('abcd98'.split(''));
	G.body.css('background-color', `#${col.join('')}`);

}


/* general functions */

function yml_load(url, fn){
	$.get(url, function(r){
		fn(jsyaml.load(r));
	});
}

function server_shutdown(){
	$.get('./exit', function(r){
		window.close();
	});
}

function close_server(sel){
	let e = $(sel);
	if(document.location.host.indexOf('localhost') < 0){
		e.remove();
	}
	e.on({
		click: function(ev){
			server_shutdown();
		}
	});
}

function ask_exit(){
	return false;
}

function on_before_unload(e){
    if (ask_exit()){
        e.preventDefault();
        e.returnValue = '';
    	server_shutdown();
        return;
    }
    delete e['returnValue'];
}


