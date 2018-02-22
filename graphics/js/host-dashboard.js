'use strict';
$(() => {
	// JQuery selectors.
	var donationTotalElement = $('#donationTotal');
	var prizesContainer = $('#prizesContainer');
	var bidsContainer = $('#bidsContainer');
	var runsContainer = $('#runsContainer');
	
	// Declaring variables.
	var prizeHTML = $('<div class="prize"><span class="prizeName"></span><br>Provided by <span class="prizeProvider"></span><br>minimum donation <span class="prizeMinDonation"></span></div>');
	var bidHTML = $('<div class="bid"><span class="bidGame"></span><br><span class="bidName"></span></div>')
	var runHTML = $('<div class="run"><span class="justMissed">YOU HAVE JUST WATCHED<br></span><span class="gameName"></span><br><span class="gameCategory"></span><br><span class="gameConsole"></span><br><span class="gameRunners"></span><br><span class="gameTime"></span><br><span class="gameFinal"></span></div>');
	
	// Keep donation total updated.
	var donationTotal = nodecg.Replicant('donationTotal');
	donationTotal.on('change', newVal => {
		donationTotalElement.html(formatDollarAmount(donationTotal.value, true));
	});
	
	// Keep prizes updated.
	var prizes = nodecg.Replicant('prizes');
	prizes.on('change', newVal => {
		prizesContainer.html('');
		newVal.forEach(prize => {
			var prizeElement = prizeHTML.clone();
			$('.prizeName', prizeElement).html(prize.name);
			$('.prizeProvider', prizeElement).html(prize.provided);
			$('.prizeMinDonation', prizeElement).html(formatDollarAmount(prize.minimum_bid));
			prizesContainer.append(prizeElement);
		});
	});
	
	// Keep bids updated.
	var bids = nodecg.Replicant('bids');
	bids.on('change', newVal => {
		var i = 0;
		bidsContainer.html('');
		newVal.forEach(bid => {
			if (i >= 6) return;
			var bidElement = bidHTML.clone();
			$('.bidGame', bidElement).html(bid.game+' - '+bid.category);
			$('.bidName', bidElement).html(bid.name);
			// Donation Goal
			if (!bid.options) {
				bidElement.append('<br>'+formatDollarAmount(bid.total)+'/'+formatDollarAmount(bid.goal)); 
			}
			// Bid War
			else {
				if (bid.options.length) {
					bid.options.forEach(option => {
						bidElement.append('<br>'+option.name+' ('+formatDollarAmount(option.total)+')')
					});
					
					if (bid.allow_user_options)
						bidElement.append('<br><i>Users can submit their own options.</i>')
				}
				else
					bidElement.append('<br><i>No options submitted yet.</i>')
			}
			bidsContainer.append(bidElement);
			i++;
		});
	});
	
	var runDataArray = nodecg.Replicant('runDataArray', 'nodecg-speedcontrol');
	var runDataActiveRun = nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol');
	//var runFinishTimes = nodecg.Replicant('runFinishTimes', 'nodecg-speedcontrol');
	runDataActiveRun.on('change', newVal => {
		runsContainer.html('');
		var indexOfCurrentRun = findIndexInRunDataArray(runDataActiveRun.value);
		for (var i = -1; i < 3; i++) {
			var run = runDataArray.value[indexOfCurrentRun+i];
			if (run) {
				var runElement = runHTML.clone();
				if (i === -1) {
					$('.justMissed', runElement).show();
					/*setTimeout(() => console.log(runFinishTimes.value), 5000);
					if (runFinishTimes.value[runDataActiveRun.value.runID]) {
						$('.gameFinal', runElement).show();
						$('.gameFinal', runElement).html(runFinishTimes.value[runDataActiveRun.value.runID]);
					}*/
				}
				else {
					$('.justMissed', runElement).hide();
					$('.gameFinal', runElement).hide();
				}
				$('.gameFinal', runElement).hide() // temp
				$('.gameName', runElement).html(run.game);
				$('.gameCategory', runElement).html(run.category);
				$('.gameConsole', runElement).html(run.system);
				$('.gameRunners', runElement).html(formPlayerNamesString(run));
				$('.gameTime', runElement).html(run.estimate);
				runsContainer.append(runElement);
			}
		}
	});
});