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
 
 
 
 
function finished(){
	$.get('https://www.totalcorner.com/match/today/ended', function(res){
		const data=(new Date).toISOString().split('T')[0];
		const obj=[];
		$(res).find('tr[data-match_id]').each(function(){
			const id=$(this).attr('data-match_id');
			const liga_id=$(this).attr('data-league_id');
            const liga_nome=$(this).find('.td_league a').text();
			const data_inicio=data+' '+$(this).find('td:eq(2)').text();
			const home=$(this).find('.match_home a').text().split("'").join('').split(",").join('');
			const away=$(this).find('.match_away a').text().split("'").join('').split(",").join('');
			const placar=$(this).find('.match_goal').text().split(' - ');
			const corners_half=$(this).find('.span_half_corner').eq(0).text().replace('(','').replace(')','').split('-');
			const da=$(this).find('.match_dangerous_attacks_half_div').text().split(' - ');
			const shoots=$(this).find('.match_shoot_half_div').text().split(' - ');
			
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

			
			obj.push({
				id: Number(id),
				data_inicio:data_inicio,
                liga_id: Number(liga_id),
                liga_nome: liga_nome,
				home: home,
				away: away,
				ghf: Number(placar[0]),
				gaf: Number(placar[1]),
				ch: Number(corners_half[0]),
				ca: Number(corners_half[1]),
				dah: Number(da[0]),
				daa: Number(da[1]),
				sh: Number(shoots[0]),
				sa: Number(shoots[1]),
				sr: Number(sr),
				data_page:data.split('-').join('')
			});
			
			
			
		});
		console.log( obj );
		$.ajax({
            type: 'POST',
            url: 'https://bot-ao.com/half/insert_jogos_finished.php',
            data: JSON.stringify (obj),
            success: function(a) {
                console.log(obj)
            },
            contentType: "application/json",
            dataType: 'json'
        }); 
		
		
		
	});
	
}

 
setInterval(function(){
   $('a:contains(live version)').click();
	
	
	var timestamp=(new Date).toISOString().split('.')[0].split('T').join(' ');
	
    var a=[];
    $('tr[data-match_id]').each(function(){
        var minuto=$(this).find('.match_status_minutes').text();
        if(minuto!='Half') return;
		
        var id=$(this).attr('data-match_id');
        var liga_id=$(this).attr('data-league_id');
        var home=$(this).find('.match_home a').text().split("'").join('').split(",").join('');
        var away=$(this).find('.match_away a').text().split("'").join('').split(",").join('');
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
            gH: Number(placar[0]),
            gA: Number(placar[1]),
            cH: Number(corners_half[0]),
            cA: Number(corners_half[1]),
            daH: Number(da[0]),
            daA: Number(da[1]),
            sH: Number(shoots[0]),
            sA: Number(shoots[1]),
            sr: Number(sr),
			handicap: handicap,
			W: Number( home.includes('Women') ),
			R: Number( home.includes('Reserves') ),
			timestamp: timestamp
			
        });
    });
    var arrays = [], size = 10;
    while (a.length > 0) arrays.push(a.splice(0, size));

    $(arrays).each(function(){
        $.getScript('https://bot-ao.com/insert_stats3.php?data='+JSON.stringify(this));
    });

},15*1000);







//Atualiza os jogos finalizados
setInterval(finished, 5*60*100);







