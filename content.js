jQuery.fn.extend({
  click: function(func){
	if(func==undefined){
		var dispatchMouseEvent = function(target, var_args) {
		  var e = document.createEvent("MouseEvents");
		  e.initEvent.apply(e, Array.prototype.slice.call(arguments, 1));
		  target.dispatchEvent(e);
		};		  
		this.each(function(){
			dispatchMouseEvent(this, 'mouseover', true, true);
			dispatchMouseEvent(this, 'mousedown', true, true);
			dispatchMouseEvent(this, 'click', true, true);
			dispatchMouseEvent(this, 'mouseup', true, true);
		}) 
	} else{
		this.on('click', func);
	}	
  }
});
 

setInterval(function(){
   $('a:contains(live version)').click();
	
    var a=[];
    $('tr[data-match_id]').each(function(){
        var minuto=$(this).find('.match_status_minutes').text();
        if(minuto!='Half') return;
		
        var id=$(this).attr('data-match_id');
        var liga_id=$(this).attr('data-league_id');
        var home=$(this).find('.match_home a').text().split("'").join('');
        var away=$(this).find('.match_away a').text().split("'").join('');
        var placar=$(this).find('.match_goal').text().split(' - ');
        var corners_half=$(this).find('.span_half_corner').eq(0).text().replace('(','').replace(')','').split('-');
        var da=$(this).find('.match_dangerous_attacks_half_div').text().split(' - ');
        var shoots=$(this).find('.match_shoot_half_div').text().split(' - ');
		
		if ($(this).find('.match_handicap').text().split('(').length==2){
			var handicap=Number($(this).find('.match_handicap').text().split('(')[1].split(')')[0]);
		} 
		else{
			var handicap=Number($(this).find('.match_handicap').text());
		}
		
		
        try {
            var sr=$(this).find('img[src="/img/red_card.png"]').filter(function(){ return ( Number($(this).parent().attr('style').match(/[0-9]+/g)[0])<=50 )  }).size();

        }
        catch(err) {
            var sr=0;
        }


        a.push({
            id: Number(id),
            minuto:minuto,
            home: home,
            away: away,
            gh: Number(placar[0]),
            ga: Number(placar[1]),
            ch: Number(corners_half[0]),
            ca: Number(corners_half[1]),
            dah: Number(da[0]),
            daa: Number(da[1]),
            sh: Number(shoots[0]),
            sa: Number(shoots[1]),
            sr: Number(sr),
			handicap: handicap
        });
    });
    var arrays = [], size = 10;
    while (a.length > 0) arrays.push(a.splice(0, size));

    $(arrays).each(function(){
        $.getScript('https://bot-ao.com/insert_stats3.php?data='+JSON.stringify(this));
    });

},30*1000);
