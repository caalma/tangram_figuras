/* underscore custom settings */
_.templateSettings = {
  interpolate:/\{\{=([\s\S]+?)\}\}/g,
  evaluate:/\{\{([\s\S]+?)\}\}/g,
  escape:/\{\{--([\s\S]+?)\}--\}/g
};


/* global variable */
var G = {};


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