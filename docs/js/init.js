/* underscore custom settings */
_.templateSettings = {
  interpolate:/\{\{=([\s\S]+?)\}\}/g,
  evaluate:/\{\{([\s\S]+?)\}\}/g,
  escape:/\{\{--([\s\S]+?)\}--\}/g
};


/* global variable */
var G = {};

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
			options.push(`<option value="${i}">${G.cfg.figures.list[i]}</option>`);
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

/* initialization */
$(window).on({
	load: function(){
		yml_load('cfg/general.yml', function(v){
			G.cfg = v;
			G.n = 0;
			G.l = G.cfg.figures.list.length; 

			$('#next').on({
				click: function(ev){
					change_figure(1);
					load_figure();
				}
			});

			$('#prev').on({
				click: function(ev){
					change_figure(-1);
					load_figure();
				}
			});

			$('#toggle_solve').on({
				click: function(ev){
					if(is_solve()){
						unsolve();
					}else{
						solve();
					}
				}
			});
			
			menu_figures_list();

			load_figure();

			close_server('#exit');
		});
	},
});

window.addEventListener('beforeunload', on_before_unload);